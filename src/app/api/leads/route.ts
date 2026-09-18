import { NextResponse } from 'next/server';
import crypto from 'crypto';

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

    // 1. Prepara os dados puros para o NOSSO Banco de Dados (D1/CRM)
    const rawLead = {
      id: crypto.randomUUID(),
      name,
      phone,
      email,
      city,
      procedure,
      timeframe,
      utms: JSON.stringify(utms || {}),
      created_at: new Date().toISOString()
    };

    // 2. Prepara os dados CRIPTOGRAFADOS (SHA-256) para a Meta (API de Conversões)
    const metaPayload = {
      em: hashDataForMeta(email), // Email Hasheado
      ph: hashDataForMeta(cleanPhoneForMeta(phone)), // Telefone Hasheado
      fn: hashDataForMeta(name.split(' ')[0]), // Primeiro nome Hasheado
      ct: hashDataForMeta(city), // Cidade Hasheada
    };

    // LOG PARA DEBUG (Vercel)
    console.log('✅ [NOVO LEAD CAPTURADO]', rawLead);
    console.log('🔒 [DADOS SEGUROS PARA META]', metaPayload);

    // TODO: Disparar inserção HTTP no Cloudflare D1
    // const d1Response = await fetch('https://api.cloudflare.com/client/v4/accounts/.../d1/database/.../query', { ... })

    return NextResponse.json({ 
      success: true, 
      message: 'Lead registrado e criptografado com sucesso' 
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Erro na API de Leads:', error);
    return NextResponse.json({ success: false, error: 'Erro ao processar o lead' }, { status: 500 });
  }
}
