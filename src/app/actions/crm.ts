'use server';

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

// Helper para obter a string de conexão correta
function getDbUrl() {
  let dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (dbUrl && !dbUrl.startsWith('postgres')) {
    dbUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres') ? process.env.DATABASE_URL : undefined;
  }
  return dbUrl;
}

// Função para criptografar dados no padrão exigido pelo Facebook (SHA-256)
function hashData(value: string) {
  if (!value) return '';
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

// Limpa e formata o telefone para o padrão Meta (+55...)
function cleanPhone(phone: string) {
  let clean = phone.replace(/\D/g, '');
  if (clean.length === 10 || clean.length === 11) {
    clean = '55' + clean;
  }
  return clean;
}

interface LeadData {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  procedure?: string;
  consultationCategory?: string;
}

// Dispara eventos Server-Side para a Graph API da Meta (CAPI)
async function sendMetaCapi(
  eventName: string,
  eventValue: number,
  leadData: LeadData,
  leadId: string,
  extraCustomData: Record<string, unknown> = {}
) {
  try {
    const rawPixelEnv = process.env.META_PIXEL_ID || process.env.meta_pixel_id || process.env.meta_pixel_Id || "";
    const canonicalPixels = ["4376073622648258", "9168277426523951"];
    const envPixelList = rawPixelEnv ? rawPixelEnv.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    const targetPixelIds = Array.from(new Set([...canonicalPixels, ...envPixelList]));

    const token = process.env.META_CAPI_TOKEN || process.env.meta_capi_token || process.env.META_ACCESS_TOKEN || process.env.meta_access_token;

    if (!token) {
      console.warn('⚠️ [META CAPI] Token de acesso ausente (META_CAPI_TOKEN / META_ACCESS_TOKEN). Evento não disparado.');
      return { success: false, error: 'Token ausente' };
    }

    const eventTime = Math.floor(Date.now() / 1000);
    const eventId = `crm_${eventName.toLowerCase()}_${leadId}_${eventTime}`;

    // Sanitização rigorosa para cumprir a Meta Sensitive Health Data Policy (sem termos cirúrgicos explícitos)
    const sanitizedCustomData = {
      currency: "BRL",
      value: eventValue,
      lead_id: leadId,
      content_name: 'Planejamento Personalizado',
      content_category: 'Atendimento Exclusivo',
      ...extraCustomData
    };

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime,
          event_id: eventId,
          action_source: "system_generated",
          user_data: {
            ph: [hashData(cleanPhone(leadData.phone))],
            ...(leadData.email && leadData.email.trim() ? { em: [hashData(leadData.email)] } : {}),
            ...(leadData.name && leadData.name.trim() ? { fn: [hashData(leadData.name.trim().split(' ')[0])] } : {}),
            ...(leadData.city && leadData.city.trim() ? { ct: [hashData(leadData.city)] } : {})
          },
          custom_data: sanitizedCustomData
        }
      ]
    };

    console.log(`🚀 [META CAPI] Disparando evento "${eventName}" (R$ ${eventValue.toFixed(2)}) para os Pixels: ${targetPixelIds.join(', ')}...`);

    const results = await Promise.allSettled(
      targetPixelIds.map(async (pixelId) => {
        const metaUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`;
        const metaRes = await fetch(metaUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const metaJson = await metaRes.json();
        if (metaJson.events_received) {
          console.log(`✅ [META CAPI SUCESSO] Pixel ${pixelId} recebeu "${eventName}"!`, metaJson);
          return { pixelId, success: true, metaJson };
        } else {
          console.error(`❌ [META CAPI ERRO] Resposta da Meta no Pixel ${pixelId} para "${eventName}":`, metaJson);
          return { pixelId, success: false, metaJson };
        }
      })
    );

    const hasSuccess = results.some(r => r.status === 'fulfilled' && r.value.success);
    return { success: hasSuccess, details: results };
  } catch (err) {
    console.error(`❌ [META CAPI EXCEPTION] Erro no envio de "${eventName}":`, err);
    return { success: false, error: err };
  }
}

export async function updateLeadStatus(leadId: string, newStatus: string, leadData: LeadData) {
  console.log(`[CRM BACKEND] Movendo lead ${leadId} (${leadData.name}) para a coluna: ${newStatus}`);
  
  // 1. Atualiza no Banco Neon e recupera dados completos do lead
  try {
    const dbUrl = getDbUrl();
    if (dbUrl) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { neon } = require('@neondatabase/serverless');
      const sql = neon(dbUrl as string);
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS consultation_category VARCHAR(50);`;
      const rows = await sql`UPDATE leads SET status = ${newStatus} WHERE id = ${leadId} RETURNING email, city, phone, name, procedure, consultation_category`;
      console.log(`✅ [CRM BACKEND] Lead ${leadId} atualizado no Neon Postgres para '${newStatus}'`);
      
      if (rows && rows.length > 0) {
        const row = rows[0];
        if (!leadData.email && row.email) leadData.email = row.email;
        if (!leadData.city && row.city) leadData.city = row.city;
        if (!leadData.phone && row.phone) leadData.phone = row.phone;
        if (!leadData.name && row.name) leadData.name = row.name;
        if (!leadData.procedure && row.procedure) leadData.procedure = row.procedure;
        if (!leadData.consultationCategory && row.consultation_category) leadData.consultationCategory = row.consultation_category;
      }
    } else {
      console.error('❌ [CRM BACKEND] Nenhuma URL de banco de dados válida encontrada.');
    }
  } catch (err) {
    console.error('❌ [CRM BACKEND] Erro ao atualizar status no Neon:', err);
  }
  
  // 2. SE O PACIENTE CHEGOU NA COLUNA DE AGENDADO COM SINAL PAGO (50%) -> DISPARA "Schedule"
  if (newStatus === 'consulta') {
    const isMedicalRef = leadData.consultationCategory === 'indicacao_medica' ||
                         (leadData.procedure && leadData.procedure.toLowerCase().includes('médic')) || 
                         (leadData.city && leadData.city.toLowerCase().includes('médic'));
    const depositValue = isMedicalRef ? 425.00 : 175.00; // 50% de R$ 850 ou R$ 350

    await sendMetaCapi('Schedule', depositValue, leadData, leadId, {
      content_name: `Reserva de Atendimento (Sinal)`,
      status_etapa: 'Agendamento Confirmado',
      tipo_evento: isMedicalRef ? 'Atendimento Personalizado (A)' : 'Atendimento Personalizado (B)',
      categoria_consulta: isMedicalRef ? 'Categoria A' : 'Categoria B'
    });
  }

  // 2.1 SE O PACIENTE CHEGOU NA COLUNA DE CONSULTA REALIZADA (QUITAÇÃO) -> DISPARA "Purchase" (Saldo restante de 50%)
  if (newStatus === 'consulta_realizada') {
    const isMedicalRef = (leadData.procedure && leadData.procedure.toLowerCase().includes('médic')) || 
                         (leadData.city && leadData.city.toLowerCase().includes('médic'));
    const balanceValue = isMedicalRef ? 425.00 : 175.00; // Saldo de 50% na recepção

    await sendMetaCapi('Purchase', balanceValue, leadData, leadId, {
      content_name: `Atendimento Concluído`,
      status_etapa: 'Atendimento Realizado Presencial',
      tipo_evento: isMedicalRef ? 'Atendimento Personalizado (A)' : 'Atendimento Personalizado (B)',
      categoria_consulta: isMedicalRef ? 'Categoria A' : 'Categoria B'
    });
  }

  // 3. SE O PACIENTE CHEGOU NA COLUNA DE DEPÓSITO -> DISPARA EVENTO DE CIRURGIA DE ALTO VALOR!
  if (newStatus === 'deposito') {
    let eventName = 'CRM_Paciente_Cirurgia';
    let eventValue = 45000.00; // Ticket médio base alto (Cirurgia Genérica)
    
    if (leadData.procedure) {
      const procLower = leadData.procedure.toLowerCase();
      
      // Triagem de Baixo Ticket (Clínico / Não-cirúrgico)
      if (
        procLower.includes('botox') || procLower.includes('toxina') || procLower.includes('preenchimento') || 
        procLower.includes('fios') || procLower.includes('bioestimulador') || procLower.includes('dermatologia') || 
        procLower.includes('peeling') || procLower.includes('laser') || procLower.includes('estética') || procLower.includes('consulta')
      ) {
        eventName = 'CRM_Paciente_Clinico';
        eventValue = 400.00; 
      } 
      // Triagem de Altíssimo Ticket (Cirurgias Complexas/Premium)
      else if (procLower.includes('face') || procLower.includes('lifting') || procLower.includes('ritidoplastia') || procLower.includes('pescoço')) {
        eventValue = 75000.00;
      }
      else if (procLower.includes('lipo') || procLower.includes('abd') || procLower.includes('contorno')) {
        eventValue = 55000.00;
      }
      else if (procLower.includes('rino') || procLower.includes('nariz')) {
        eventValue = 45000.00;
      }
      else if (procLower.includes('mama') || procLower.includes('mastopexia') || procLower.includes('silicone') || procLower.includes('prótese')) {
        eventValue = 35000.00;
      }
    }

    await sendMetaCapi(eventName, eventValue, leadData, leadId, {
      content_name: 'Contratação de Serviço Exclusivo',
      status_etapa: 'Confirmação',
      tipo_evento: 'Fechamento de Serviço'
    });
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function generateAiForLead(leadId: string, leadData: { procedure?: string, timeframe?: string, city?: string, name?: string }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { success: false, error: 'Sem API Key do Gemini' };

  const prompt = `Atue como Ana Paula, a Concierge exclusiva do Dr. Mário Warde, uma clínica de cirurgia plástica de alto padrão (Boutique de Luxo).
Escreva a MENSAGEM EXATA DE WHATSAPP que deve ser enviada para este paciente, seguindo estritamente os scripts do nosso Playbook "White Glove".

Regras:
1. NUNCA use a palavra "Avaliação". Use SEMPRE "Primeira Consulta".
2. Mantenha um tom sofisticado, empático e focado na dor/sonho da paciente.
3. Não use gírias ou excesso de emojis. Apenas o texto pronto para ser copiado e enviado.
4. Se apresente como Ana Paula, Concierge do Dr. Mário Warde.
5. Inicie saudando a pessoa pelo nome fornecido.
6. Apenas retorne a mensagem de whatsapp, não inclua aspas no início/fim nem explicações da IA.

Dados do Lead:
- Nome: ${leadData.name || 'Paciente'}
- Procedimento de interesse: ${leadData.procedure || 'Não informado'}
- Urgência: ${leadData.timeframe || 'Não informada'}
- Cidade: ${leadData.city || 'Não informada'}`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
      })
    });
    
    if (!res.ok) return { success: false, error: 'Erro na chamada ao Gemini' };
    const data = await res.json();
    const suggestion = data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/["\n]/g, '').trim();
    
    if (suggestion) {
      const dbUrl = getDbUrl();
      if (dbUrl) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { neon } = require('@neondatabase/serverless');
        const sql = neon(dbUrl as string);
        await sql`UPDATE leads SET ai_suggestion = ${suggestion} WHERE id = ${leadId}`;
        revalidatePath('/admin');
      }
      return { success: true, suggestion };
    }
    return { success: false, error: 'Nenhuma sugestão retornada' };
  } catch (err) {
    console.error('Erro na IA:', err);
    return { success: false, error: 'Erro interno' };
  }
}

export async function updateLeadFollowup(leadId: string, followupDate: string | null, followupNote: string | null) {
  try {
    const dbUrl = getDbUrl();
    if (dbUrl) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { neon } = require('@neondatabase/serverless');
      const sql = neon(dbUrl as string);
      
      if (followupDate) {
        await sql`UPDATE leads SET followup_date = ${followupDate}, followup_note = ${followupNote} WHERE id = ${leadId}`;
      } else {
        await sql`UPDATE leads SET followup_date = NULL, followup_note = NULL WHERE id = ${leadId}`;
      }
      revalidatePath('/admin');
      return { success: true };
    }
    return { success: false, error: 'Database URL not found' };
  } catch (err: any) {
    console.error('Erro ao atualizar follow-up:', err);
    return { success: false, error: err.message };
  }
}

export async function updateLeadConsultationCategory(leadId: string, consultationCategory: string) {
  try {
    const dbUrl = getDbUrl();
    if (dbUrl) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { neon } = require('@neondatabase/serverless');
      const sql = neon(dbUrl as string);
      
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS consultation_category VARCHAR(50);`;
      await sql`UPDATE leads SET consultation_category = ${consultationCategory} WHERE id = ${leadId}`;
      revalidatePath('/admin');
      return { success: true };
    }
    return { success: false, error: 'Database URL not found' };
  } catch (err: any) {
    console.error('Erro ao atualizar categoria de consulta:', err);
    return { success: false, error: err.message };
  }
}

export async function updateLeadAction(leadId: string, actionText: string) {
  try {
    const dbUrl = getDbUrl();
    if (dbUrl) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { neon } = require('@neondatabase/serverless');
      const sql = neon(dbUrl as string);
      
      await sql`UPDATE leads SET ai_suggestion = ${actionText} WHERE id = ${leadId}`;
      revalidatePath('/admin');
      return { success: true };
    }
    return { success: false, error: 'Database URL not found' };
  } catch (err: any) {
    console.error('Erro ao atualizar script de ação do lead:', err);
    return { success: false, error: err.message };
  }
}

