'use client';
import React, { useState, useTransition, useRef, useEffect } from 'react';
import { generateAiForLead, updateLeadFollowup, updateLeadConsultationCategory, updateLeadAction } from '@/app/actions/crm';

type LeadScore = 'HOT' | 'WARM' | 'COLD';
export type ConsultationCategory = 'internet' | 'indicacao' | 'indicacao_medica' | 'cortesia';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  procedure: string;
  timeframe: string;
  source: string;
  score: number;
  scoreLabel: LeadScore;
  nextAction: string;
  createdAt: string;
  isClinical?: boolean;
  followupDate?: string | null;
  followupNote?: string | null;
  email?: string;
  city?: string;
  status?: string;
  consultationCategory?: ConsultationCategory;
  courtesyReason?: string;
}

interface ColumnOption {
  id: string;
  title: string;
}

interface LeadCardProps {
  lead: Lead;
  onMoveToColumn?: (leadId: string, toColumnId: string) => void;
  columnsList?: ColumnOption[];
}

export default function LeadCard({ lead, onMoveToColumn, columnsList = [] }: LeadCardProps) {
  const [isPending, startTransition] = useTransition();
  const [localNextAction, setLocalNextAction] = useState(lead.nextAction);

  // Expansão de detalhes (Progressive Disclosure para economizar espaço vertical)
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Menu Rápido "Mover para..."
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const moveMenuRef = useRef<HTMLDivElement>(null);

  // Script / Next Action states
  const [isEditingAction, setIsEditingAction] = useState(false);
  const [actionDraft, setActionDraft] = useState(lead.nextAction || '');
  const [isPendingAction, startActionTransition] = useTransition();
  const [copiedAction, setCopiedAction] = useState(false);

  // Category and Financial states
  const [category, setCategory] = useState<ConsultationCategory>(
    lead.consultationCategory || 'internet'
  );
  const [courtesyReason, setCourtesyReason] = useState<string>(
    lead.courtesyReason || 'voucher_evento'
  );
  const [isPendingCategory, startCategoryTransition] = useTransition();
  const [copiedScript, setCopiedScript] = useState(false);

  // Follow-Up states
  const [isEditingFup, setIsEditingFup] = useState(false);
  const [fupDate, setFupDate] = useState(lead.followupDate ? new Date(lead.followupDate).toISOString().split('T')[0] : '');
  const [fupNote, setFupNote] = useState(lead.followupNote || '');
  const [isPendingFup, startFupTransition] = useTransition();

  // Fecha menu de mover ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moveMenuRef.current && !moveMenuRef.current.contains(event.target as Node)) {
        setIsMoveOpen(false);
      }
    }
    if (isMoveOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoveOpen]);

  const handleSaveAction = () => {
    startActionTransition(async () => {
      await updateLeadAction(lead.id, actionDraft);
      setLocalNextAction(actionDraft);
      lead.nextAction = actionDraft;
      setIsEditingAction(false);
    });
  };

  const handleCopyAction = () => {
    if (!localNextAction) return;
    navigator.clipboard.writeText(localNextAction).then(() => {
      setCopiedAction(true);
      setTimeout(() => setCopiedAction(false), 2000);
    });
  };

  const handleCategoryChange = (newCat: ConsultationCategory, reason?: string) => {
    setCategory(newCat);
    const selectedReason = reason !== undefined ? reason : courtesyReason;
    if (reason !== undefined) setCourtesyReason(reason);
    startCategoryTransition(async () => {
      await updateLeadConsultationCategory(lead.id, newCat, newCat === 'cortesia' ? selectedReason : '');
      lead.consultationCategory = newCat;
      if (newCat === 'cortesia') lead.courtesyReason = selectedReason;
    });
  };

  const handleReasonChange = (newReason: string) => {
    setCourtesyReason(newReason);
    startCategoryTransition(async () => {
      await updateLeadConsultationCategory(lead.id, 'cortesia', newReason);
      lead.courtesyReason = newReason;
    });
  };

  const [activeScriptKey, setActiveScriptKey] = useState<string | null>(null);

  // Helpers para extrair Nome e Procedimento limpos (Zero risco de enviar [Nome] ou [Procedimento])
  const getCleanFirstName = (fullName: string) => {
    const raw = (fullName || '').trim();
    if (!raw) return 'tudo bem';
    const parts = raw.split(/\s+/);
    const first = parts[0];
    if (/^(dr\.?|dra\.?|sr\.?|sra\.?|srta\.?|dona|seu)$/i.test(first) && parts.length > 1) {
      return `${first} ${parts[1]}`;
    }
    return first;
  };

  const getCleanProcedure = (proc: string) => {
    const p = (proc || '').toLowerCase();
    if (p.includes('deep plane') || p.includes('facial') || p.includes('lifting') || p.includes('blefaro') || p.includes('rosto') || p.includes('pescoço')) {
      return 'rejuvenescimento facial';
    }
    if (p.includes('combinad') || (p.includes('face') && p.includes('corpo')) || (p.includes('tórax') && p.includes('abd'))) {
      return 'planejamento cirúrgico combinado';
    }
    if (p.includes('mama') || p.includes('mastopexia') || p.includes('prótese') || p.includes('silicone')) {
      return 'cirurgia mamária';
    }
    if (p.includes('corporal') || p.includes('abd') || p.includes('lipo')) {
      return 'contorno corporal';
    }
    if (!proc || proc === '-' || p.includes('não informado')) {
      return 'seu planejamento cirúrgico';
    }
    return proc.replace(/\s*\(.*?\)\s*/g, '').trim();
  };

  const buildPlaybookScript = (type: 'primeiro_contato' | 'convite_direto' | 'contorno_preco' | 'reserva_pix' | 'endereco') => {
    const firstName = getCleanFirstName(lead.name);
    const cleanProc = getCleanProcedure(lead.procedure);
    const consultTotal = category === 'indicacao_medica' ? '850,00' : '350,00';
    const depositVal = category === 'indicacao_medica' ? '425,00' : '175,00';

    switch (type) {
      case 'primeiro_contato':
        return `Olá, ${firstName}! Tudo bem? Aqui é a Ana Paula, Concierge exclusiva do Dr. Mário Warde. Recebemos o seu cadastro sobre ${cleanProc}. Para eu preparar o seu atendimento com todo cuidado, me conta um pouquinho: o que mais tem te incomodado hoje e qual é o seu principal objetivo com a cirurgia?`;

      case 'convite_direto':
        return `Perfeito, ${firstName}, compreendo perfeitamente. Essa queixa é justamente uma das maiores especialidades do Dr. Mário, buscando sempre um reposicionamento estruturado, natural e sem estigmas.\n\nPara o Dr. Mário avaliar a sua anatomia pessoalmente e desenhar o seu planejamento cirúrgico, você prefere agendar a sua Primeira Consulta presencialmente aqui na clínica (Vila Madalena) ou por vídeo (Telemedicina)?`;

      case 'contorno_preco':
        if (category === 'cortesia') {
          return `Compreendo perfeitamente a sua necessidade de planejamento, ${firstName}.\n\nComo o Dr. Mário realiza cirurgias personalizadas e opera exclusivamente em estrutura hospitalar de primeira linha (como Sírio-Libanês, Vila Nova Star e Albert Einstein), o planejamento cirúrgico é individualizado após ele avaliar a sua anatomia pessoalmente, inclusive por norma do Conselho Federal de Medicina.\n\nComo o seu atendimento é uma Cortesia Exclusiva, a sua Primeira Consulta está liberada de custos de honorários. Você prefere que eu reserve um horário presencial aqui na clínica (Vila Madalena) ou por vídeo (Telemedicina) esta semana?`;
        }
        return `Compreendo perfeitamente a sua necessidade de planejamento, ${firstName}.\n\nComo o Dr. Mário realiza cirurgias personalizadas e opera exclusivamente em estrutura hospitalar de primeira linha (como Sírio-Libanês, Vila Nova Star e Albert Einstein), o orçamento cirúrgico não é padronizado e só pode ser definido após ele avaliar a sua anatomia em consulta, inclusive por norma do Conselho Federal de Medicina.\n\nO primeiro passo é a Primeira Consulta Médica detalhada (o valor é de R$ ${consultTotal}, sendo 100% revertido em crédito no seu plano cirúrgico). Você prefere que eu veja um horário presencial aqui na Vila Madalena ou por vídeo (Telemedicina) esta semana?`;

      case 'reserva_pix':
        if (category === 'cortesia') {
          return `Olá, ${firstName}! O Dr. Mário organiza a agenda com intervalos amplos entre os atendimentos, sem sobreposição de pacientes, para garantir total privacidade e uma consulta médica detalhada e sem pressa.\n\nComo o seu atendimento é uma Cortesia Exclusiva, o seu horário está pré-reservado diretamente na grade do Dr. Mário, sem necessidade de sinal financeiro via Pix.\n\nPosso confirmar a sua data e horário aqui na clínica (Vila Madalena)?`;
        }
        return `Olá, ${firstName}! O Dr. Mário organiza a agenda com intervalos amplos entre os atendimentos, sem sobreposição de pacientes, para garantir total privacidade e uma consulta médica detalhada e sem pressa.\n\nPor essa razão, a confirmação do horário é formalizada mediante a reserva de 50% do valor da consulta via Pix (R$ ${depositVal}), e o saldo restante é acertado no dia do atendimento.\n\nUm diferencial da clínica: caso você decida realizar o procedimento cirúrgico com o Dr. Mário, o valor integral da consulta (R$ ${consultTotal}) é revertido em crédito no seu plano cirúrgico.\n\nPosso enviar a chave Pix da clínica para travarmos a sua data com o doutor?`;

      case 'endereco':
        return `A clínica do Dr. Mário Warde está localizada em uma região nobre e de fácil acesso na Vila Madalena:\n\nEndereço: Rua Jericó, 255 - Conjunto 81 — Vila Madalena (Sumarezinho), São Paulo - SP | CEP: 05435-040 (o edifício conta com estacionamento e serviço de Valet no local, próximo à estação Vila Madalena do Metrô).\n\nLocalização no Google Maps: https://maps.google.com/?q=Rua+Jerico,255,Vila+Madalena,Sao+Paulo,SP,05435-040`;
    }
  };

  const handleSelectQuickScript = (type: 'primeiro_contato' | 'convite_direto' | 'contorno_preco' | 'reserva_pix' | 'endereco') => {
    const script = buildPlaybookScript(type);
    setLocalNextAction(script);
    setActionDraft(script);
    setActiveScriptKey(type);
    lead.nextAction = script;

    navigator.clipboard.writeText(script).then(() => {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2200);
    });

    startActionTransition(async () => {
      await updateLeadAction(lead.id, script);
    });
  };

  const handleGenerateAi = () => {
    startTransition(async () => {
      const res = await generateAiForLead(lead.id, {
        procedure: lead.procedure,
        timeframe: lead.timeframe,
        name: lead.name,
      });
      if (res?.success && res.suggestion) {
        setLocalNextAction(res.suggestion);
        setIsDetailsExpanded(true);
      }
    });
  };

  const handleSaveFup = () => {
    startFupTransition(async () => {
      const formattedDate = fupDate ? new Date(fupDate).toISOString() : null;
      await updateLeadFollowup(lead.id, formattedDate, fupNote || null);
      setIsEditingFup(false);
      lead.followupDate = formattedDate;
      lead.followupNote = fupNote || null;
    });
  };

  // Configuração visual do Score — Padrão Quiet Luxury (Pontos coloridos sutis, sem emojis)
  const scoreConfig = {
    HOT: { color: 'text-red-700 font-bold', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-600' },
    WARM: { color: 'text-amber-800 font-semibold', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-600' },
    COLD: { color: 'text-slate-600 font-medium', bg: 'bg-slate-100', border: 'border-slate-200', dot: 'bg-slate-400' },
  };

  const currentConfig = scoreConfig[lead.scoreLabel];
  const cleanPhone = lead.phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(localNextAction || '');
  const whatsLink = `https://wa.me/${cleanPhone.length <= 11 ? '55'+cleanPhone : cleanPhone}?text=${encodedMessage}`;

  // Lógica de Alerta de Follow-Up
  let fupStatus = 'none';
  if (lead.followupDate) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(lead.followupDate);
    target.setHours(0,0,0,0);
    if (target < today) fupStatus = 'late';
    else if (target.getTime() === today.getTime()) fupStatus = 'today';
    else fupStatus = 'future';
  }

  const borderClass = fupStatus === 'late' ? 'border-red-400 ring-2 ring-red-100 shadow-sm' :
                      fupStatus === 'today' ? 'border-amber-400 ring-2 ring-amber-100 shadow-sm' :
                      'border-black/5 hover:border-[#310f0e]/30';

  return (
    <div 
      className={`bg-white rounded-2xl border p-4 hover:shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing mb-3 group flex flex-col gap-3 relative select-none ${borderClass}`}
    >
      {/* Linha Superior: Score + Origem + Data + Menu Rápido "Mover" */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Badge Score com ponto colorido sutil */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${currentConfig.bg} ${currentConfig.color} ${currentConfig.border} border`}>
            <span className={`w-1.5 h-1.5 rounded-full ${currentConfig.dot}`}></span>
            <span>{lead.score} pts</span>
          </div>

          {/* Origem */}
          <span 
            className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider max-w-[90px] truncate" 
            title={lead.source}
          >
            {lead.source}
          </span>

          {lead.isClinical && (
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider">
              Clínico
            </span>
          )}

          {category === 'cortesia' && (
            <span className="text-[11px] font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
              Cortesia (R$ 0)
            </span>
          )}
        </div>

        {/* Menu Rápido "Mover de Fase" (1 Clique) */}
        <div className="relative" ref={moveMenuRef} onMouseDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setIsMoveOpen(!isMoveOpen)}
            className="text-xs font-semibold text-slate-700 hover:text-[#310f0e] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1 transition-all"
            title="Mover lead para outra coluna sem precisar arrastar"
          >
            <span>Mover</span>
            <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isMoveOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Mover para etapa:
              </div>
              <div className="max-h-60 overflow-y-auto crm-scrollbar">
                {columnsList.map((col) => {
                  const isCurrent = (lead.status || 'triagem') === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      disabled={isCurrent}
                      onClick={() => {
                        setIsMoveOpen(false);
                        if (onMoveToColumn) {
                          onMoveToColumn(lead.id, col.id);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center justify-between ${
                        isCurrent 
                          ? 'bg-slate-50 text-slate-400 cursor-default' 
                          : 'text-slate-800 hover:bg-[#310f0e]/5 hover:text-[#310f0e] cursor-pointer'
                      }`}
                    >
                      <span className="truncate">{col.title}</span>
                      {isCurrent && <span className="text-[10px] text-slate-400 font-bold">Atual</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dados Principais do Paciente (Tipografia ampliada e legível) */}
      <div>
        <h3 className="font-semibold text-[#1d1d1f] text-[15px] sm:text-base leading-snug">
          {lead.name}
        </h3>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-[13px] text-slate-600 font-medium">
            {lead.phone}
          </p>
          <span className="text-xs text-slate-500 font-normal">
            {new Date(lead.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Procedimento de Interesse e Previsão */}
      <div className="flex flex-col gap-1.5 bg-[#fbfbfd] p-2.5 rounded-xl border border-slate-100">
        <div className="flex items-center gap-2 text-[14px] text-[#1d1d1f]">
          <svg className="w-4 h-4 text-[#310f0e] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="font-semibold tracking-tight truncate">{lead.procedure}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-slate-600">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{lead.timeframe}</span>
        </div>
      </div>

      {/* Alerta de Follow-Up Rápido (Compacto e Escaneável) */}
      <div 
        className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors"
        onClick={() => setIsEditingFup(!isEditingFup)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {!isEditingFup ? (
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 font-medium">
              <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lead.followupDate ? (
                <span className={fupStatus === 'late' ? 'text-red-700 font-bold' : fupStatus === 'today' ? 'text-amber-800 font-bold' : 'text-slate-700'}>
                  {fupStatus === 'late' && 'Atrasado: '}
                  {fupStatus === 'today' && 'Hoje: '}
                  Retorno em {new Date(lead.followupDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </span>
              ) : (
                <span className="text-slate-500 hover:text-slate-800 font-medium">+ Agendar data de retorno</span>
              )}
            </div>
            {lead.followupNote && (
              <span className="text-xs text-slate-500 truncate max-w-[120px] font-normal" title={lead.followupNote}>
                {lead.followupNote}
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 cursor-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Definir Retorno</span>
              <button 
                type="button" 
                onClick={() => setIsEditingFup(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input 
              type="date" 
              value={fupDate}
              onChange={(e) => setFupDate(e.target.value)}
              className="text-xs p-1.5 border border-slate-200 rounded-lg w-full bg-white text-slate-800"
            />
            <input 
              type="text" 
              placeholder="Motivo (Ex: Confirmar exames / Enviar Pix)" 
              value={fupNote}
              onChange={(e) => setFupNote(e.target.value)}
              className="text-xs p-1.5 border border-slate-200 rounded-lg w-full bg-white text-slate-800"
            />
            <div className="flex gap-2 justify-end pt-1">
              <button 
                type="button" 
                onClick={() => setIsEditingFup(false)} 
                className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={handleSaveFup} 
                disabled={isPendingFup} 
                className="text-xs bg-[#310f0e] text-white px-3 py-1 rounded-lg font-medium disabled:opacity-50"
              >
                {isPendingFup ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Botões de Ação Imediata (WhatsApp + Toggle de Detalhes) */}
      <div className="flex items-center gap-2 pt-1" onMouseDown={(e) => e.stopPropagation()}>
        {/* Botão Principal: WhatsApp Direto */}
        <a 
          href={whatsLink} 
          target="_blank" 
          rel="noreferrer"
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2 shadow-xs transition-all hover:shadow cursor-pointer"
          title="Abrir WhatsApp Web com mensagem pronta"
        >
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span>WhatsApp</span>
        </a>

        {/* Botão de Revelação de Detalhes (Scripts / Financeiro) */}
        <button
          type="button"
          onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            isDetailsExpanded 
              ? 'bg-[#310f0e] text-white border-[#310f0e]' 
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
          title="Ver ou ocultar detalhes financeiros e scripts de atendimento"
        >
          <span>{isDetailsExpanded ? 'Recolher' : 'Scripts e Valores'}</span>
          <svg className={`w-3 h-3 transition-transform ${isDetailsExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* ÁREA EXPANSÍVEL: FINANCEIRO, REGRAS DE 50% PIX E SCRIPT IA */}
      {isDetailsExpanded && (
        <div 
          className="flex flex-col gap-3 pt-2 border-t border-slate-100 animate-in fade-in duration-200"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Seletor de Categoria e Origem de Consulta */}
          <div className="bg-[#f8fafc] rounded-xl p-3 border border-slate-200/80 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Origem e Matriz de Valor
              </span>
              {isPendingCategory && <span className="text-[11px] text-slate-400">Salvando...</span>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleCategoryChange('internet')}
                className={`text-xs py-1.5 px-2 rounded-lg font-semibold transition-all text-center truncate ${
                  category === 'internet'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                title="Internet (Meta Ads / Orgânico) - R$ 350 total (50% Pix: R$ 175)"
              >
                Internet (R$ 350)
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('indicacao')}
                className={`text-xs py-1.5 px-2 rounded-lg font-semibold transition-all text-center truncate ${
                  category === 'indicacao'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                title="Indicação de Pacientes - R$ 350 total (50% Pix: R$ 175)"
              >
                Indicação (R$ 350)
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('indicacao_medica')}
                className={`text-xs py-1.5 px-2 rounded-lg font-semibold transition-all text-center truncate ${
                  category === 'indicacao_medica'
                    ? 'bg-[#310f0e] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                title="Indicação Médica ou Linhagem VIP (R$ 850 total | 50% Pix: R$ 425)"
              >
                Médica / VIP (R$ 850)
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('cortesia')}
                className={`text-xs py-1.5 px-2 rounded-lg font-semibold transition-all text-center truncate ${
                  category === 'cortesia'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                title="Consulta Cortesia / Isenta de Honorários (R$ 0)"
              >
                Cortesia (R$ 0)
              </button>
            </div>

            {/* Justificativa / Hipótese da Cortesia (Quando Selecionado) */}
            {category === 'cortesia' && (
              <div className="bg-[#310f0e]/5 border border-[#310f0e]/15 rounded-lg p-2 flex flex-col gap-1 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#310f0e] uppercase tracking-wider">
                    Hipótese da Isenção
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Honorários R$ 0</span>
                </div>
                <select
                  value={courtesyReason}
                  onChange={(e) => handleReasonChange(e.target.value)}
                  className="w-full text-xs bg-white text-slate-800 border border-[#310f0e]/20 rounded-md py-1 px-2 font-medium focus:outline-none focus:ring-1 focus:ring-[#310f0e]/30 cursor-pointer"
                >
                  <option value="voucher_evento">Voucher Evento Reinauguração (Sessão 2027)</option>
                  <option value="convidado_mario">Convidado / Amigo do Dr. Mário</option>
                  <option value="revisao_cirurgica">Retorno / Revisão Cirúrgica</option>
                  <option value="excecao_comercial">Exceção Comercial de Fechamento</option>
                  <option value="inadimplencia_pendencia">Inadimplência / Pendência na Recepção</option>
                </select>
              </div>
            )}

            {/* Badges de Confirmação Financeira por Etapa */}
            {lead.status === 'consulta' && (
              category === 'cortesia' ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-xs flex items-center justify-between text-purple-950 font-semibold">
                  <span>Atendimento Isento: <strong>Cortesia (R$ 0,00)</strong></span>
                  <span className="text-purple-700 font-normal">Sem cobrança de sinal Pix</span>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-xs flex items-center justify-between text-emerald-900 font-semibold">
                  <span>Sinal 50% Pix: <strong>R$ {category === 'indicacao_medica' ? '425,00' : '175,00'}</strong></span>
                  <span className="text-emerald-700 font-normal">Saldo na recepção: R$ {category === 'indicacao_medica' ? '425,00' : '175,00'}</span>
                </div>
              )
            )}

            {lead.status === 'consulta_realizada' && (
              category === 'cortesia' ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-xs flex items-center justify-between text-purple-950 font-semibold">
                  <span>Consulta Cortesia Concluída: <strong>R$ 0,00</strong></span>
                  <span className="text-purple-700 font-normal">Em decisão médica / avaliação</span>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs flex items-center justify-between text-blue-900 font-semibold">
                  <span>Consulta Quitada: <strong>R$ {category === 'indicacao_medica' ? '850,00' : '350,00'}</strong></span>
                  <span className="text-blue-700 font-normal">Em decisão (crédito válido se operar)</span>
                </div>
              )
            )}

            {/* Central de Scripts Rápidos (Preenchidos com Nome e Procedimento, Sem Colchetes) */}
            <div className="pt-1 border-t border-slate-200/80 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Scripts Prontos (Sem Colchetes)
                </span>
                {copiedScript && (
                  <span className="text-[11px] font-bold text-emerald-700">
                    Copiado e aplicado
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectQuickScript('primeiro_contato')}
                  className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold transition-all text-left truncate cursor-pointer ${
                    activeScriptKey === 'primeiro_contato'
                      ? 'bg-[#310f0e] text-white border-[#310f0e]'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                  title="Passo 1: Saudação inicial acolhedora já com nome e procedimento do paciente"
                >
                  1. 1º Contato
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectQuickScript('convite_direto')}
                  className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold transition-all text-left truncate cursor-pointer ${
                    activeScriptKey === 'convite_direto'
                      ? 'bg-[#310f0e] text-white border-[#310f0e]'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                  title="Passo 2: Valida a queixa sem interrogatório e já convida para Presencial ou Telemedicina"
                >
                  2. Convite Direto
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectQuickScript('contorno_preco')}
                  className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold transition-all text-left truncate cursor-pointer ${
                    activeScriptKey === 'contorno_preco'
                      ? 'bg-[#310f0e] text-white border-[#310f0e]'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                  title="Contorno de Preço Cirúrgico (Proibido R$ 32k/35k — Foco no valor da Consulta e hospitais)"
                >
                  3. Contorno Preço
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectQuickScript('reserva_pix')}
                  className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold transition-all text-left truncate cursor-pointer ${
                    activeScriptKey === 'reserva_pix'
                      ? 'bg-[#310f0e] text-white border-[#310f0e]'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                  title="Passo 4: Formalização da Reserva de 50% via Pix + 100% Crédito Cirúrgico"
                >
                  4. Reserva 50% Pix
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleSelectQuickScript('endereco')}
                className={`w-full py-1.5 px-2.5 rounded-lg border text-xs font-semibold transition-all text-center cursor-pointer ${
                  activeScriptKey === 'endereco'
                    ? 'bg-[#310f0e] text-white border-[#310f0e]'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                }`}
                title="Enviar endereço completo da Vila Madalena + Valet + Link clicável do Google Maps"
              >
                5. Endereço Completo + Valet + Google Maps
              </button>
            </div>
          </div>

          {/* Script Concierge & Mensagem WhatsApp */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-slate-700 font-bold">
                  Mensagem de WhatsApp
                </span>
                <button 
                  type="button"
                  onClick={handleGenerateAi} 
                  disabled={isPending}
                  className="hover:bg-slate-100 px-2 py-0.5 rounded-md text-xs text-purple-700 font-semibold transition-colors disabled:opacity-50 cursor-pointer border border-purple-200"
                  title="Gerar ou atualizar sugestão com inteligência artificial"
                >
                  Sugerir IA
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setActionDraft(localNextAction);
                    setIsEditingAction(!isEditingAction);
                  }}
                  className="hover:bg-slate-100 px-2 py-0.5 rounded-md text-xs text-slate-600 hover:text-black transition-colors cursor-pointer border border-slate-200"
                  title="Editar texto da mensagem"
                >
                  Editar
                </button>
              </div>

              {localNextAction && localNextAction !== '-' && (
                <button
                  type="button"
                  onClick={handleCopyAction}
                  className="text-xs text-slate-700 hover:text-black bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-all font-semibold"
                >
                  {copiedAction ? 'Copiado' : 'Copiar'}
                </button>
              )}
            </div>

            {isEditingAction ? (
              <div className="flex flex-col gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <textarea
                  rows={4}
                  value={actionDraft}
                  onChange={(e) => setActionDraft(e.target.value)}
                  className="text-xs sm:text-[13px] p-2.5 border border-slate-300 rounded-lg w-full bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#310f0e] leading-relaxed"
                  placeholder="Digite ou ajuste a mensagem de WhatsApp..."
                />
                <div className="flex gap-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsEditingAction(false)} 
                    className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSaveAction} 
                    disabled={isPendingAction} 
                    className="text-xs bg-[#310f0e] text-white px-3 py-1 rounded-lg font-semibold disabled:opacity-50"
                  >
                    {isPendingAction ? 'Salvando...' : 'Salvar Script'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-xs sm:text-[13px] leading-relaxed">
                {isPending ? (
                  <span className="text-slate-400 italic">Consultando Inteligência Concierge...</span>
                ) : localNextAction ? (
                  <p className="text-slate-800 font-normal whitespace-pre-line">
                    {localNextAction}
                  </p>
                ) : (
                  <span className="text-slate-400 italic">Nenhum script configurado. Clique em Editar para redigir ou Sugerir IA.</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
