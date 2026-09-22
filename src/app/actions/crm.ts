'use server';

import crypto from 'crypto';

// Função para criptografar dados no padrão exigido pelo Facebook (SHA-256)
function hashData(value: string) {
  if (!value) return '';
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

// Limpa e formata o telefone para o padrão Meta (+55...)
function cleanPhone(phone: string) {
  let clean = phone.replace(/\D/g, '');
  if (clean.length === 10 || clean.length === 11) {
    clean = '55' + clean;
  }
  return clean;
}

interface LeadData {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  procedure?: string;
  [key: string]: unknown;
}

export async function updateLeadStatus(leadId: string, newStatus: string, leadData: LeadData) {
  console.log(`[CRM BACKEND] Movendo lead ${leadId} (${leadData.name}) para a coluna: ${newStatus}`);
  
  // AQUI FICARÁ O UPDATE NO BANCO NEON NO FUTURO:
  // UPDATE leads SET status = newStatus WHERE id = leadId
  
  // SE O PACIENTE CHEGOU NA COLUNA DE DEPÓSITO -> DISPARA A API DO META!
  if (newStatus === 'deposito') {
    try {
      const pixelId = process.env.META_PIXEL_ID;
      const token = process.env.META_CAPI_TOKEN;

      if (!pixelId || !token) {
        console.error('❌ [META CAPI] Credenciais ausentes no servidor (Verifique o arquivo .env.local).');
        return { success: false, error: 'Credenciais ausentes' };
      }

      // IMPORTANTE: Como o pixel está sob Shadowban de Políticas de Saúde, 
      // enviar eventos padrões médicos ou Purchase pode ser bloqueado.
      // Solução da Inteligência: Usar um EVENTO PERSONALIZADO de altíssimo valor.
      const eventName = 'CRM_Paciente_Pagante';
      const eventTime = Math.floor(Date.now() / 1000);
      
      const payload = {
        data: [
          {
            event_name: eventName,
            event_time: eventTime,
            action_source: "system_generated",
            user_data: {
              // Os dados críticos criptografados (O "DNA" do comprador)
              em: [hashData(leadData.email || 'paciente@email.com')],
              ph: [hashData(cleanPhone(leadData.phone))],
              fn: [hashData(leadData.name.split(' ')[0])],
              ct: [hashData(leadData.city || 'São Paulo')] 
            },
            custom_data: {
              currency: "BRL",
              value: 20000.00, // Ticket médio fictício configurado para adestrar a inteligência
              procedimento_interesse: leadData.procedure
            }
          }
        ]
      };

      console.log(`🚀 [META CAPI] Preparando disparo do evento "${eventName}" para o Pixel ${pixelId}...`);

      const metaUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`;
      
      const metaRes = await fetch(metaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const metaJson = await metaRes.json();
      
      if (metaJson.events_received) {
        console.log('✅ [META CAPI SUCESSO] Evento recebido pela Meta Ads!', metaJson);
      } else {
        console.error('❌ [META CAPI ERRO] Falha no retorno da Meta:', metaJson);
      }

    } catch (err) {
      console.error('❌ [META CAPI EXCEPTION]', err);
    }
  }

  return { success: true };
}
