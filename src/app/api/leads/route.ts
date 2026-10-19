import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';

// Função para formatar e criptografar dados para a Meta (CAPI)
function hashDataForMeta(value: string): string {
  if (!value) return '';
  // Meta exige: minúsculo, sem espaços, trim
  const cleanValue = value.trim().toLowerCase();
  return crypto.createHash('sha256').update(cleanValue).digest('hex');
}

function cleanPhoneForMeta(phone: string): string {
  // Mantém apenas os números
  let clean = phone.replace(/\D/g, '');
  // Se não tiver código do país (55), adiciona
  if (clean.length === 10 || clean.length === 11) {
    clean = '55' + clean;
  }
  return clean;
}

async function generateAISuggestion(leadData: any): Promise<string> {
  const rawName = (leadData.name || '').trim();
  const nameParts = rawName.split(/\s+/);
  const firstName =
    nameParts.length > 1 && /^(dr\.?|dra\.?|sr\.?|sra\.?|srta\.?|dona|seu)$/i.test(nameParts[0])
      ? `${nameParts[0]} ${nameParts[1]}`
      : nameParts[0] || 'Paciente';

  const procLower = (leadData.procedure || '').toLowerCase();
  let cleanProc = 'seu planejamento cirúrgico';
  if (procLower.includes('deep plane') || procLower.includes('facial') || procLower.includes('lifting') || procLower.includes('blefaro') || procLower.includes('rosto') || procLower.includes('pescoço')) {
    cleanProc = 'rejuvenescimento facial';
  } else if (procLower.includes('combinad') || (procLower.includes('face') && procLower.includes('corpo')) || (procLower.includes('tórax') && procLower.includes('abd'))) {
    cleanProc = 'planejamento cirúrgico combinado';
  } else if (procLower.includes('mama') || procLower.includes('mastopexia') || procLower.includes('prótese') || procLower.includes('silicone')) {
    cleanProc = 'cirurgia mamária';
  } else if (procLower.includes('corporal') || procLower.includes('abd') || procLower.includes('lipo')) {
    cleanProc = 'contorno corporal';
  } else if (leadData.procedure && leadData.procedure !== '-' && !procLower.includes('não informado')) {
    cleanProc = leadData.procedure.replace(/\s*\(.*?\)\s*/g, '').trim();
  }

  const fallbackSuggestion = `Olá, ${firstName}! Tudo bem? Aqui é a Ana Paula, Concierge exclusiva do Dr. Mário Warde. Recebemos o seu cadastro sobre ${cleanProc}. Para eu preparar o seu atendimento com todo cuidado, me conta um pouquinho: o que mais tem te incomodado hoje e qual é o seu principal objetivo com a cirurgia?`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallbackSuggestion;

  const prompt = `Atue como Ana Paula, a Concierge exclusiva do Dr. Mário Warde, clínica de cirurgia plástica de alto padrão em São Paulo (Vila Madalena).
Escreva a MENSAGEM EXATA DE WHATSAPP para abordar este paciente, seguindo as Regras de Ouro Versão 1.4 do nosso Playbook:

Regras Inegociáveis:
1. NUNCA use a palavra "Avaliação". Use SEMPRE "Primeira Consulta".
2. NUNCA cite valores de cirurgia no chat (proibido falar R$ 32.000 ou R$ 35.000).
3. NUNCA faça interrogatórios robóticos ("Há quanto tempo busca?"). Seja calorosa, breve (máximo 3 frases curtas) e humana.
4. ZERO emojis, ZERO colchetes ([Nome] ou [Procedimento]), ZERO símbolos ">" ou aspas no início/fim.
5. Inicie saudando pelo primeiro nome (${firstName}), apresente-se como Ana Paula, Concierge do Dr. Mário Warde, valide o interesse em ${cleanProc} e pergunte de forma acolhedora o que mais incomoda hoje.

Dados do Paciente:
- Nome: ${firstName}
- Procedimento: ${cleanProc}
- Janela desejada: ${leadData.timeframe || 'Não informada'}
- Região: ${leadData.city || 'São Paulo'}`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 250 }
      })
    });
    
    if (!res.ok) return fallbackSuggestion;
    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const suggestion = rawText.replace(/^["“>]+|["”]+$/g, '').replace(/\[.*?\]/g, '').trim();
    return suggestion || fallbackSuggestion;
  } catch (e) {
    console.error('Erro na geração da IA:', e);
    return fallbackSuggestion;
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, city, procedure, timeframe, utms } = body;

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'Nome e telefone são obrigatórios' }, { status: 400 });
    }

    let dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (dbUrl && !dbUrl.startsWith('postgres')) {
      dbUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres') ? process.env.DATABASE_URL : undefined;
    }

    // --- TRAVA DE DEDUPLICAÇÃO ANTI-DOUBLE SUBMIT (Postgres Neon) ---
    // Impede que requisições repetidas nos últimos 10 minutos gerem leads duplicados no CRM
    const cleanDigits = phone.replace(/\D/g, '');
    const phoneWith55 = cleanDigits.startsWith('55') ? cleanDigits : '55' + cleanDigits;
    const phoneWithout55 = cleanDigits.startsWith('55') ? cleanDigits.slice(2) : cleanDigits;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (dbUrl) {
      try {
        const sql = neon(dbUrl as string);
        const existing = await sql`
          SELECT id, name, phone, created_at 
          FROM leads
          WHERE (
            (${cleanDigits} != '' AND (
              regexp_replace(phone, '[^0-9]', '', 'g') = ${cleanDigits} OR
              regexp_replace(phone, '[^0-9]', '', 'g') = ${phoneWith55} OR
              regexp_replace(phone, '[^0-9]', '', 'g') = ${phoneWithout55}
            ))
            OR (${cleanEmail} != '' AND LOWER(email) = ${cleanEmail})
          )
          AND created_at >= NOW() - INTERVAL '10 minutes'
          ORDER BY created_at DESC
          LIMIT 1;
        `;

        if (existing && existing.length > 0) {
          console.log(`🛡️ [DEDUPLICAÇÃO ATIVA] Lead idêntico recebido em menos de 10 min (${name} - ${phone}). Bloqueando insert duplicado.`);
          return NextResponse.json({
            success: true,
            deduplicated: true,
            leadId: existing[0].id,
            message: 'Lead já registrado recentemente. Duplicidade bloqueada com sucesso.'
          }, { status: 200 });
        }
      } catch (checkErr) {
        console.warn('Aviso na checagem de deduplicação (seguindo fluxo):', checkErr);
      }
    }

    const leadId = crypto.randomUUID();
    const utmsJson = JSON.stringify(utms || {});

    // 1. Prepara os dados puros para o NOSSO Banco de Dados (CRM)
    const rawLead = {
      id: leadId,
      name,
      phone,
      email,
      city,
      procedure,
      timeframe,
      utms: utmsJson,
      created_at: new Date().toISOString()
    };

    // Gera a sugestão de IA assincronamente (se a chave estiver configurada)
    const aiSuggestion = await generateAISuggestion(rawLead);
    (rawLead as any).ai_suggestion = aiSuggestion;

    // 2. Insere no Banco de Dados Neon (se configurado)
    if (dbUrl) {
      const sql = neon(dbUrl as string);
      
      // Garante que a coluna ai_suggestion existe antes de inserir
      try {
        await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_suggestion TEXT;`;
      } catch (e) {
        console.log('Ignorando erro ao tentar criar coluna:', e);
      }

      await sql`
        INSERT INTO leads (id, name, phone, email, city, procedure, timeframe, utms, ai_suggestion)
        VALUES (${leadId}, ${name}, ${phone}, ${email || ''}, ${city || ''}, ${procedure || ''}, ${timeframe || ''}, ${utmsJson}, ${aiSuggestion || ''})
      `;
    }

    // 3. Prepara os dados CRIPTOGRAFADOS (SHA-256) para a Meta (API de Conversões)
    const metaPayload = {
      em: hashDataForMeta(email),
      ph: hashDataForMeta(cleanPhoneForMeta(phone)),
      fn: hashDataForMeta(name.split(' ')[0]),
      ct: hashDataForMeta(city),
    };

    // LOG PARA DEBUG (Vercel)
    console.log('✅ [NOVO LEAD SALVO]', rawLead);
    console.log('🔒 [DADOS SEGUROS PARA META]', metaPayload);

    return NextResponse.json({
      success: true,
      message: 'Lead registrado e salvo no banco de dados com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Erro na API de Leads:', error);
    return NextResponse.json({ success: false, error: 'Erro ao processar o lead' }, { status: 500 });
  }
}
