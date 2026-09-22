import { NextResponse } from 'next/server';
import crypto from 'crypto';

function hashData(data: string): string {
  if (!data) return '';
  const normalized = data.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

function normalizePhone(phone: string): string {
  if (!phone) return '';
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.startsWith('55') ? digitsOnly : `55${digitsOnly}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { procedure, timeframe, name, phone, email } = body;

    const normalizedPhone = normalizePhone(phone);
    const hashedEmail = hashData(email);
    const hashedPhone = hashData(normalizedPhone);
    const eventId = crypto.randomUUID();
    const eventTime = Math.floor(Date.now() / 1000);
    
    const clientIp = request.headers.get('x-forwarded-for') || '0.0.0.0';
    const userAgent = request.headers.get('user-agent') || '';

    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (makeWebhookUrl) {
      fetch(makeWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId, timestamp: new Date().toISOString(), procedure, timeframe, name, phone: normalizedPhone, email, source: 'Website Lead Form'
        })
      }).catch(err => console.error("Make Webhook Error:", err));
    }

    // Usando fallback para caso a variável esteja com nome diferente no Vercel
    const metaPixelId = process.env.META_PIXEL_ID || "4376073622648258"; // ID corrigido da imagem
    const metaAccessToken = process.env.META_ACCESS_TOKEN || process.env.META_CAPI_TOKEN;

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
      
      fetch(metaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metaPayload)
      }).catch(err => console.error("Meta CAPI Error:", err));
    }

    return NextResponse.json({ success: true, eventId, message: 'Lead recebido.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
