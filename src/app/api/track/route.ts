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
    
    // Extração e higienização rigorosa do IP (apenas o primeiro IP público, sem portas ou proxies)
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '0.0.0.0';
    const clientIp = rawIp.split(',')[0].trim();
    const userAgent = request.headers.get('user-agent') || '';

    // Extração automática dos cookies primários da Meta (_fbp e _fbc)
    const cookiesHeader = request.headers.get('cookie') || '';
    const fbpMatch = cookiesHeader.match(/_fbp=([^;]+)/);
    const fbcMatch = cookiesHeader.match(/_fbc=([^;]+)/);
    const fbp = body.fbp || (fbpMatch ? fbpMatch[1] : undefined);
    const fbc = body.fbc || (fbcMatch ? fbcMatch[1] : undefined);

    const metaPixelId = process.env.META_PIXEL_ID || "4376073622648258";
    const metaAccessToken = process.env.META_ACCESS_TOKEN || process.env.META_CAPI_TOKEN;

    // Se for apenas ping de teste de infraestrutura/conexão, não envia para o Pixel em produção para não poluir o Gerenciador
    if (finalEventName.toLowerCase().includes('ping') || finalEventName.toLowerCase().includes('teste')) {
      return NextResponse.json({ 
        success: true, 
        eventId: finalEventId, 
        eventName: finalEventName, 
        message: 'Teste de conexão validado com sucesso pelo servidor (ignorado envio à Meta para manter o Pixel limpo).' 
      });
    }

    if (metaPixelId && metaAccessToken) {
      const userData: Record<string, unknown> = {
        client_ip_address: clientIp,
        client_user_agent: userAgent,
      };
      if (hashedEmail) userData.em = [hashedEmail];
      if (hashedPhone) userData.ph = [hashedPhone];
      if (hashedFn) userData.fn = [hashedFn];
      if (fbp) userData.fbp = fbp;
      if (fbc) userData.fbc = fbc;

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
      if (!metaResponse.ok || metaResult.error) {
        console.error(`❌ [META CAPI ERRO] Falha no envio de ${finalEventName}:`, JSON.stringify(metaResult));
      } else {
        console.log(`✅ [META CAPI SUCESSO] ${finalEventName} enviado com sucesso:`, JSON.stringify(metaResult));
      }
    } else {
      console.warn(`⚠️ [META CAPI AVISO] META_ACCESS_TOKEN ausente na Vercel! Evento ${finalEventName} ignorado no servidor.`);
    }

    return NextResponse.json({ success: true, eventId: finalEventId, eventName: finalEventName, message: 'Evento recebido.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
