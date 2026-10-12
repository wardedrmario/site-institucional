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
    const { phone, email, name, testCode, sourceUrl, eventId, eventName, customData, actionSource } = body;

    const normalizedPhone = phone ? normalizePhone(phone) : '';
    const hashedEmail = email ? hashData(email) : '';
    const hashedPhone = normalizedPhone ? hashData(normalizedPhone) : '';
    const hashedFn = name ? hashData(name.trim().split(' ')[0]) : '';
    const finalEventId = eventId || crypto.randomUUID();
    const eventTime = Math.floor(Date.now() / 1000);
    const finalEventName = eventName || 'Lead';
    
    const clientIp = request.headers.get('x-forwarded-for') || '0.0.0.0';
    const userAgent = request.headers.get('user-agent') || '';

    const metaPixelId = process.env.META_PIXEL_ID || "4376073622648258";
    const metaAccessToken = process.env.META_ACCESS_TOKEN || process.env.META_CAPI_TOKEN;

    if (metaPixelId && metaAccessToken) {
      const userData: Record<string, unknown> = {
        client_ip_address: clientIp,
        client_user_agent: userAgent,
      };
      if (hashedEmail) userData.em = [hashedEmail];
      if (hashedPhone) userData.ph = [hashedPhone];
      if (hashedFn) userData.fn = [hashedFn];

      const eventData: Record<string, unknown> = {
        event_name: finalEventName,
        event_time: eventTime,
        action_source: actionSource || (sourceUrl ? 'website' : 'system_generated'),
        event_source_url: sourceUrl || 'https://drmariowarde.com/',
        event_id: finalEventId,
        user_data: userData,
        ...(customData ? { custom_data: customData } : {})
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
      console.log(`Meta API Response for ${finalEventName}:`, metaResult);
    }

    return NextResponse.json({ success: true, eventId: finalEventId, eventName: finalEventName, message: 'Evento recebido.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
