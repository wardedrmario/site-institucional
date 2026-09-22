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
    const { procedure, timeframe, name, phone, email, testCode } = body;

    const normalizedPhone = normalizePhone(phone);
    const hashedEmail = hashData(email);
    const hashedPhone = hashData(normalizedPhone);
    const eventId = crypto.randomUUID();
    const eventTime = Math.floor(Date.now() / 1000);
    
    const clientIp = request.headers.get('x-forwarded-for') || '0.0.0.0';
    const userAgent = request.headers.get('user-agent') || '';

    const metaPixelId = process.env.META_PIXEL_ID || "4376073622648258";
    const metaAccessToken = process.env.META_ACCESS_TOKEN || process.env.META_CAPI_TOKEN;

    if (metaPixelId && metaAccessToken) {
      const eventData: any = {
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
      };

      // Injeção do código de teste para depuração no painel do Meta
      if (testCode) {
        eventData.test_event_code = testCode;
      }

      const metaPayload = { data: [eventData] };
      const metaUrl = `https://graph.facebook.com/v19.0/${metaPixelId}/events?access_token=${metaAccessToken}`;
      
      const metaResponse = await fetch(metaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metaPayload)
      });
      
      const metaResult = await metaResponse.json();
      console.log("Meta API Response:", metaResult);
    }

    return NextResponse.json({ success: true, eventId, message: 'Lead recebido.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
