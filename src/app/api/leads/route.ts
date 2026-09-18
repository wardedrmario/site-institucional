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

    // 2. Insere no Banco de Dados Neon (se configurado)
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      await sql`
        INSERT INTO leads (id, name, phone, email, city, procedure, timeframe, utms)
        VALUES (${leadId}, ${name}, ${phone}, ${email || ''}, ${city || ''}, ${procedure || ''}, ${timeframe || ''}, ${utmsJson})
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
