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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return '';

  const prompt = `Atue como Ana Paula, a Concierge comercial de cirurgia plástica de alto padrão do Dr. Mário Warde.
Analise este lead recém-cadastrado e sugira uma ÚNICA PRÓXIMA AÇÃO de vendas em no máximo 10 a 12 palavras, baseada no Playbook Comercial "White Glove".

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
    
    if (!res.ok) return '';
    const data = await res.json();
    const suggestion = data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/["\n]/g, '').trim();
    return suggestion || '';
  } catch (e) {
    console.error('Erro na geração da IA:', e);
    return '';
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, city, procedure, timeframe, utms } = body;

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
    let dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (dbUrl && !dbUrl.startsWith('postgres')) {
      dbUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres') ? process.env.DATABASE_URL : undefined;
    }
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
