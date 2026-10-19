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

    const rawPixelEnv = process.env.META_PIXEL_ID || process.env.meta_pixel_id || process.env.meta_pixel_Id || "";
    const metaAccessToken = process.env.META_CAPI_TOKEN || process.env.meta_capi_token || process.env.META_ACCESS_TOKEN || process.env.meta_access_token;

    // Lista canônica de Pixels para envio simultâneo (Dupla Conexão):
    // 1. Dataset Primário (MD - Mario Warde): 4376073622648258
    // 2. Pixel Oficial Limpo (Pixel de CA - Mario Warde): 9168277426523951
    const canonicalPixels = ["4376073622648258", "9168277426523951"];
    const envPixelList = rawPixelEnv ? rawPixelEnv.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    const targetPixelIds = Array.from(new Set([...canonicalPixels, ...envPixelList]));

    // Se for apenas ping de teste de infraestrutura/conexão, não envia para o Pixel em produção para não poluir o Gerenciador
    if (finalEventName.toLowerCase().includes('ping') || finalEventName.toLowerCase().includes('teste')) {
      return NextResponse.json({ 
        success: true, 
        eventId: finalEventId, 
        eventName: finalEventName, 
        message: 'Teste de conexão validado com sucesso pelo servidor (ignorado envio à Meta para manter o Pixel limpo).' 
      });
    }

    if (metaAccessToken && targetPixelIds.length > 0) {
      const userData: Record<string, unknown> = {
        client_ip_address: clientIp,
        client_user_agent: userAgent,
      };
      if (hashedEmail) userData.em = [hashedEmail];
      if (hashedPhone) userData.ph = [hashedPhone];
      if (hashedFn) userData.fn = [hashedFn];
      if (fbp) userData.fbp = fbp;
      if (fbc) userData.fbc = fbc;

      // Injeção do código de teste para depuração no painel do Meta
      let resolvedTestCode = testCode;
      if (!resolvedTestCode && sourceUrl) {
        try {
          const parsedSource = new URL(sourceUrl);
          resolvedTestCode = parsedSource.searchParams.get('test_event_code') || parsedSource.searchParams.get('test_code') || undefined;
        } catch {}
      }
      if (!resolvedTestCode) {
        try {
          const reqUrl = new URL(request.url);
          resolvedTestCode = reqUrl.searchParams.get('test_event_code') || reqUrl.searchParams.get('test_code') || undefined;
        } catch {}
      }

      // Parâmetros de custom_data sanitizados contra a política de dados de saúde sensíveis da Meta
      const defaultSanitizedCustomData = {
        content_name: 'Planejamento Personalizado',
        content_category: 'Atendimento Exclusivo',
        status: 'lead_captured',
        currency: 'BRL',
        value: 0.00
      };
      const finalCustomData = customData ? { ...defaultSanitizedCustomData, ...customData } : defaultSanitizedCustomData;

      // Se o evento for Lead, preparamos tanto 'Lead' (computado com 100% no Pixel limpo)
      // quanto 'Contato_VIP' (custom event 100% desbloqueado e imune a restrições em ambos os Pixels)
      const eventsToSend: Array<Record<string, unknown>> = [];

      if (finalEventName === 'Lead') {
        const leadEvent: Record<string, unknown> = {
          event_name: 'Lead',
          event_time: eventTime,
          action_source: actionSource || (sourceUrl ? 'website' : 'system_generated'),
          event_source_url: sourceUrl || 'https://drmariowarde.com/',
          event_id: finalEventId,
          user_data: userData,
          custom_data: finalCustomData
        };
        const vipEvent: Record<string, unknown> = {
          event_name: 'Contato_VIP',
          event_time: eventTime,
          action_source: actionSource || (sourceUrl ? 'website' : 'system_generated'),
          event_source_url: sourceUrl || 'https://drmariowarde.com/',
          event_id: finalEventId,
          user_data: userData,
          custom_data: finalCustomData
        };

        const contactEvent: Record<string, unknown> = {
          event_name: 'Contact',
          event_time: eventTime,
          action_source: actionSource || (sourceUrl ? 'website' : 'system_generated'),
          event_source_url: sourceUrl || 'https://drmariowarde.com/',
          event_id: finalEventId,
          user_data: userData,
          custom_data: finalCustomData
        };

        if (resolvedTestCode) {
          leadEvent.test_event_code = resolvedTestCode;
          vipEvent.test_event_code = resolvedTestCode;
          contactEvent.test_event_code = resolvedTestCode;
        }

        eventsToSend.push(leadEvent, vipEvent, contactEvent);
      } else {
        const singleEvent: Record<string, unknown> = {
          event_name: finalEventName,
          event_time: eventTime,
          action_source: actionSource || (sourceUrl ? 'website' : 'system_generated'),
          event_source_url: sourceUrl || 'https://drmariowarde.com/',
          event_id: finalEventId,
          user_data: userData,
          custom_data: finalCustomData
        };
        if (resolvedTestCode) {
          singleEvent.test_event_code = resolvedTestCode;
        }
        eventsToSend.push(singleEvent);
      }

      // Disparo simultâneo para todos os Pixels via Meta Graph API CAPI
      const metaPayload = { data: eventsToSend };

      const capiResults = await Promise.allSettled(
        targetPixelIds.map(async (pixelId) => {
          const metaUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${metaAccessToken}`;
          const metaResponse = await fetch(metaUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(metaPayload)
          });
          const metaResult = await metaResponse.json();
          if (!metaResponse.ok || metaResult.error) {
            console.error(`❌ [META CAPI ERRO] Falha no Pixel ${pixelId} (${finalEventName}):`, JSON.stringify(metaResult));
            return { pixelId, success: false, result: metaResult };
          } else {
            console.log(`✅ [META CAPI SUCESSO] Pixel ${pixelId} recebeu (${finalEventName} + Contato_VIP):`, JSON.stringify(metaResult));
            return { pixelId, success: true, result: metaResult };
          }
        })
      );

      return NextResponse.json({ 
        success: true, 
        eventId: finalEventId, 
        eventName: finalEventName, 
        pixelsSent: targetPixelIds,
        results: capiResults.map(r => r.status === 'fulfilled' ? r.value : { error: r.reason }),
        message: 'Evento CAPI processado com dupla conexão.' 
      });
    } else {
      console.warn(`⚠️ [META CAPI AVISO] META_ACCESS_TOKEN ausente na Vercel! Evento ${finalEventName} ignorado no servidor.`);
    }

    return NextResponse.json({ success: true, eventId: finalEventId, eventName: finalEventName, message: 'Evento recebido.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
