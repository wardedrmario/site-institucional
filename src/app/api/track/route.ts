import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Função auxiliar para normalizar e aplicar hash SHA-256
function hashData(data: string): string {
  if (!data) return '';
  // Normalização padrão exigida pelo Meta (trim e lowercase)
  const normalized = data.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

// Função auxiliar para normalizar telefone (apenas números)
function normalizePhone(phone: string): string {
  if (!phone) return '';
  // Remove tudo que não for dígito e adiciona o código do país se faltar (simplificado)
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.startsWith('55') ? digitsOnly : `55${digitsOnly}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { procedure, timeframe, name, phone, email } = body;

    // 1. Tratamento de Dados (LGPD & Meta CAPI)
    const normalizedPhone = normalizePhone(phone);
    const hashedEmail = hashData(email);
    const hashedPhone = hashData(normalizedPhone);
    const eventId = crypto.randomUUID(); // Identificador único para desduplicação
    const eventTime = Math.floor(Date.now() / 1000); // Timestamp em Unix
    
    const clientIp = request.headers.get('x-forwarded-for') || '0.0.0.0';
    const userAgent = request.headers.get('user-agent') || '';

    // ==========================================
    // 2. DISPARO PARA O MAKE (Planilha do Google)
    // ==========================================
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (makeWebhookUrl) {
      // Usamos void para não bloquear a resposta caso o Make demore
      fetch(makeWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          timestamp: new Date().toISOString(),
          procedure,
          timeframe,
          name,
          phone: normalizedPhone,
          email,
          source: 'Website Lead Form'
        })
      }).catch(err => console.error("Make Webhook Error:", err));
    }

    // ==========================================
    // 3. DISPARO PARA O META CAPI (Server-Side)
    // ==========================================
    const metaPixelId = process.env.META_PIXEL_ID;
    const metaAccessToken = process.env.META_ACCESS_TOKEN;

    if (metaPixelId && metaAccessToken) {
      const metaPayload = {
        data: [
          {
            event_name: 'Lead',
            event_time: eventTime,
            action_source: 'website',
            event_id: eventId,
            user_data: {
              em: [hashedEmail],
              ph: [hashedPhone],
              client_ip_address: clientIp,
              client_user_agent: userAgent,
            },
            custom_data: {
              procedure: procedure,
              timeframe: timeframe
            }
          }
        ]
      };

      const metaUrl = `https://graph.facebook.com/v19.0/${metaPixelId}/events?access_token=${metaAccessToken}`;
      
      // Envia os dados criptografados para o Meta
      fetch(metaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metaPayload)
      }).catch(err => console.error("Meta CAPI Error:", err));
    }

    // Retorna sucesso para o Front-end
    return NextResponse.json({ 
      success: true, 
      eventId,
      message: 'Lead recebido, processado e eventos disparados.' 
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
