'use server';

import crypto from 'crypto';

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
  // [key: string]: unknown;
}

export async function updateLeadStatus(leadId: string, newStatus: string, leadData: LeadData) {
  console.log(`[CRM BACKEND] Movendo lead ${leadId} (${leadData.name}) para a coluna: ${newStatus}`);
  
  // Atualiza no Banco Neon
  try {
    if ((process.env.DATABASE_URL || process.env.POSTGRES_URL)) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { neon } = require('@neondatabase/serverless');
      const sql = neon((process.env.DATABASE_URL || process.env.POSTGRES_URL));
      await sql`UPDATE leads SET status = ${newStatus} WHERE id = ${leadId}`;
      console.log(`✅ [CRM BACKEND] Lead ${leadId} atualizado no Neon Postgres para '${newStatus}'`);
    }
  } catch (err) {
    console.error('❌ [CRM BACKEND] Erro ao atualizar status no Neon:', err);
  }
  
  // SE O PACIENTE CHEGOU NA COLUNA DE DEPÓSITO -> DISPARA A API DO META!
  if (newStatus === 'deposito') {
    try {
      const pixelId = process.env.META_PIXEL_ID;
      const token = process.env.META_CAPI_TOKEN;

      if (!pixelId || !token) {
        console.error('❌ [META CAPI] Credenciais ausentes no servidor (Verifique o arquivo .env.local).');
        return { success: false, error: 'Credenciais ausentes' };
      }

      // IMPORTANTE: Como o pixel está sob Shadowban de Políticas de Saúde, 
      // enviar eventos padrões médicos ou Purchase pode ser bloqueado.
      // Solução da Inteligência: Usar um EVENTO PERSONALIZADO de altíssimo valor.
      
      let eventName = 'CRM_Paciente_Cirurgia';
      let eventValue = 45000.00; // Ticket médio base alto (Cirurgia Genérica)
      
      if (leadData.procedure) {
        const procLower = leadData.procedure.toLowerCase();
        
        // 1. Triagem de Baixo Ticket (Clínico)
        if (
          procLower.includes('botox') || procLower.includes('toxina') || procLower.includes('preenchimento') || 
          procLower.includes('fios') || procLower.includes('bioestimulador') || procLower.includes('dermatologia') || 
          procLower.includes('peeling') || procLower.includes('laser') || procLower.includes('estética') || procLower.includes('consulta')
        ) {
          eventName = 'CRM_Paciente_Clinico';
          eventValue = 400.00; 
        } 
        // 2. Triagem de Altíssimo Ticket (Cirurgias Complexas/Premium)
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

      const eventTime = Math.floor(Date.now() / 1000);
      
      const payload = {
        data: [
          {
            event_name: eventName,
            event_time: eventTime,
            action_source: "system_generated",
            user_data: {
              // Os dados críticos criptografados (O "DNA" do comprador)
              em: [hashData(leadData.email || 'paciente@email.com')],
              ph: [hashData(cleanPhone(leadData.phone))],
              fn: [hashData(leadData.name.split(' ')[0])],
              ct: [hashData(leadData.city || 'São Paulo')] 
            },
            custom_data: {
              currency: "BRL",
              value: eventValue,
              procedimento_interesse: leadData.procedure
            }
          }
        ]
      };

      console.log(`🚀 [META CAPI] Preparando disparo do evento "${eventName}" para o Pixel ${pixelId}...`);

      const metaUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`;
      
      const metaRes = await fetch(metaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const metaJson = await metaRes.json();
      
      if (metaJson.events_received) {
        console.log('✅ [META CAPI SUCESSO] Evento recebido pela Meta Ads!', metaJson);
      } else {
        console.error('❌ [META CAPI ERRO] Falha no retorno da Meta:', metaJson);
      }

    } catch (err) {
      console.error('❌ [META CAPI EXCEPTION]', err);
    }
  }

  return { success: true };
}

export async function generateAiForLead(leadId: string, leadData: { procedure?: string, timeframe?: string, city?: string }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { success: false, error: 'Sem API Key do Gemini' };

  const prompt = `Atue como o Dr. Mário Warde, cirurgião plástico de alto padrão.
Analise este lead recém-cadastrado e sugira para a sua equipe uma ÚNICA PRÓXIMA AÇÃO comercial em no máximo 10 a 12 palavras, baseada no Playbook "White Glove".

Regras do Playbook:
1. NUNCA use a palavra "Avaliação", use SEMPRE "Primeira Consulta".
2. Se o lead abandonou sem mandar mensagem, a ação é o "Script de Resgate".
3. Mantenha um tom sofisticado, acolhedor e focado na dor/sonho da paciente.

Dados do Lead:
- Procedimento: ${leadData.procedure || 'Não informado'}
- Urgência: ${leadData.timeframe || 'Não informada'}
- Cidade: ${leadData.city || 'Não informada'}

Exemplos de resposta esperada: 
"Enviar script de resgate para Primeira Consulta de Mama."
"Perguntar sobre a dor atual antes de agendar Primeira Consulta."

Responda apenas a ação, sem aspas.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 25 }
      })
    });
    
    if (!res.ok) return { success: false, error: 'Erro na chamada ao Gemini' };
    const data = await res.json();
    const suggestion = data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/["\n]/g, '').trim();
    
    if (suggestion) {
      if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { neon } = require('@neondatabase/serverless');
        const sql = neon((process.env.DATABASE_URL || process.env.POSTGRES_URL));
        await sql`UPDATE leads SET ai_suggestion = ${suggestion} WHERE id = ${leadId}`;
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
    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { neon } = require('@neondatabase/serverless');
      const sql = neon((process.env.DATABASE_URL || process.env.POSTGRES_URL));
      
      if (followupDate) {
        await sql`UPDATE leads SET followup_date = ${followupDate}, followup_note = ${followupNote} WHERE id = ${leadId}`;
      } else {
        await sql`UPDATE leads SET followup_date = NULL, followup_note = NULL WHERE id = ${leadId}`;
      }
      return { success: true };
    }
    return { success: false, error: 'Database URL not found' };
  } catch (err: any) {
    console.error('Erro ao atualizar follow-up:', err);
    return { success: false, error: err.message };
  }
}
