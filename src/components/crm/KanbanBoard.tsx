'use client';

import React, { useState, startTransition, useRef, useMemo } from 'react';
import LeadCard, { Lead } from './LeadCard';
import { updateLeadStatus } from '@/app/actions/crm';
import NewLeadModal from './NewLeadModal';

const COLUMNS = [
  { id: 'triagem', title: 'Triagem / Descoberta', segment: 'ENTRADA' },
  { id: 'qualificacao', title: 'Qualificação Concierge', segment: 'ENTRADA' },
  { id: 'consulta', title: 'Agendado (Sinal 50% Pago)', segment: 'CONSULTAS' },
  { id: 'consulta_realizada', title: 'Consulta Realizada (Presencial)', segment: 'CONSULTAS' },
  { id: 'pos_consulta', title: 'Pós-Consulta (Decisão)', segment: 'CONSULTAS' },
  { id: 'deposito', title: 'Cirurgia Fechada (Depósito)', segment: 'CIRURGIAS' },
  { id: 'pre_op', title: 'Pré-operatório', segment: 'CIRURGIAS' },
  { id: 'pos_op', title: 'Pós-operatório / Recorrência', segment: 'CIRURGIAS' },
  { id: 'arquivado', title: 'Arquivado / Não Converteu', segment: 'ARQUIVADOS' },
];

const SEGMENTS = [
  { id: 'ALL', label: 'Todas as Fases' },
  { id: 'ENTRADA', label: 'Entrada & Triagem' },
  { id: 'CONSULTAS', label: 'Consultas & Decisão' },
  { id: 'CIRURGIAS', label: 'Cirurgias & Pós' },
  { id: 'ARQUIVADOS', label: 'Arquivados' },
];

export interface DbLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  procedure?: string;
  timeframe?: string;
  utms?: string | Record<string, string>;
  score?: number;
  status?: string;
  ai_suggestion?: string;
  created_at: string;
  followup_date?: string;
  followup_note?: string;
  consultation_category?: string;
  courtesy_reason?: string;
}

export default function KanbanBoard({ initialLeads = [] }: { initialLeads?: DbLead[] }) {
  // Referência do container do Kanban para scroll suave
  const boardRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Estados de Filtro e Busca
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSegment, setActiveSegment] = useState<string>('ALL');
  const [thermalFilter, setThermalFilter] = useState<'ALL' | 'HOT' | 'TODAY' | 'LATE'>('ALL');

  // Estado de Drag & Drop
  const [draggedLead, setDraggedLead] = useState<{ lead: Lead; fromColumnId: string } | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  // Converte e agrupa os leads do banco de dados
  const groupedLeads = useMemo(() => {
    const columns: Record<string, Lead[]> = {
      'triagem': [], 'qualificacao': [], 'consulta': [], 'consulta_realizada': [], 'pos_consulta': [], 'deposito': [], 'pre_op': [], 'pos_op': [], 'arquivado': []
    };
    
    initialLeads.forEach(lead => {
      let source = 'Orgânico';
      try {
        if (lead.utms) {
          const parsed = typeof lead.utms === 'string' ? JSON.parse(lead.utms) : lead.utms;
          source = parsed.utm_campaign || parsed.camp_id || 'Orgânico';
        }
      } catch { /* ignora */ }

      // --- MOTOR DE LEAD SCORING ---
      let calculatedScore = lead.score || 50;
      let isClinical = false;
      
      if (lead.procedure && lead.procedure.trim() !== '') {
        const procLower = lead.procedure.toLowerCase();
        if (
          procLower.includes('botox') || 
          procLower.includes('toxina') || 
          procLower.includes('preenchimento') || 
          procLower.includes('fios') || 
          procLower.includes('bioestimulador') || 
          procLower.includes('dermatologia') || 
          procLower.includes('peeling') || 
          procLower.includes('laser') || 
          procLower.includes('estética') ||
          procLower.includes('consulta')
        ) {
          isClinical = true;
          calculatedScore -= 30;
        } else {
          calculatedScore += 15;
        }
      }
      
      if (lead.timeframe) {
        const timeLower = lead.timeframe.toLowerCase();
        if (timeLower.includes('< 1 mês') || timeLower.includes('menos') || timeLower.includes('imediato') || timeLower.includes('urgente')) {
          calculatedScore += 25;
        } else if (timeLower.includes('1 a 3 meses') || timeLower.includes('este ano') || timeLower.includes('30-60 dias') || timeLower.includes('3 a 6 meses')) {
          calculatedScore += 15;
        }
      }
      
      if (lead.city) {
        const cityLower = lead.city.toLowerCase();
        if (cityLower.includes('alphaville') || cityLower.includes('itaim') || cityLower.includes('jardins') || cityLower.includes('moema') || cityLower.includes('vila mariana') || cityLower.includes('pinheiros')) {
          calculatedScore += 20;
        }
      }
      
      if (lead.status && ['consulta', 'consulta_realizada', 'pos_consulta', 'deposito', 'pre_op', 'pos_op'].includes(lead.status)) {
        calculatedScore += 40;
      }

      const status = lead.status || 'triagem';

      // Gera script padrão limpo (sem colchetes) caso o lead não tenha script salvo
      const rawName = (lead.name || '').trim();
      const nameParts = rawName.split(/\s+/);
      const firstName =
        nameParts.length > 1 && /^(dr\.?|dra\.?|sr\.?|sra\.?|srta\.?|dona|seu)$/i.test(nameParts[0])
          ? `${nameParts[0]} ${nameParts[1]}`
          : nameParts[0] || 'tudo bem';

      const procLower = (lead.procedure || '').toLowerCase();
      let cleanProc = 'seu planejamento cirúrgico';
      if (procLower.includes('deep plane') || procLower.includes('facial') || procLower.includes('lifting') || procLower.includes('blefaro') || procLower.includes('rosto') || procLower.includes('pescoço')) {
        cleanProc = 'rejuvenescimento facial';
      } else if (procLower.includes('combinad') || (procLower.includes('face') && procLower.includes('corpo')) || (procLower.includes('tórax') && procLower.includes('abd'))) {
        cleanProc = 'planejamento cirúrgico combinado';
      } else if (procLower.includes('mama') || procLower.includes('mastopexia') || procLower.includes('prótese') || procLower.includes('silicone')) {
        cleanProc = 'cirurgia mamária';
      } else if (procLower.includes('corporal') || procLower.includes('abd') || procLower.includes('lipo')) {
        cleanProc = 'contorno corporal';
      } else if (lead.procedure && lead.procedure !== '-' && !procLower.includes('não informado')) {
        cleanProc = lead.procedure.replace(/\s*\(.*?\)\s*/g, '').trim();
      }

      const defaultFirstContact = `Olá, ${firstName}! Tudo bem? Aqui é a Ana Paula, Concierge exclusiva do Dr. Mário Warde. Recebemos o seu cadastro sobre ${cleanProc}. Para eu preparar o seu atendimento com todo cuidado, me conta um pouquinho: o que mais tem te incomodado hoje e qual é o seu principal objetivo com a cirurgia?`;

      const hasValidCustomAction =
        lead.ai_suggestion &&
        lead.ai_suggestion.trim() !== '' &&
        lead.ai_suggestion.trim() !== '-' &&
        lead.ai_suggestion.trim() !== 'Qualificar via Whats';

      const mappedLead: Lead = {
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        procedure: lead.procedure || '-',
        timeframe: lead.timeframe || '-',
        source: source,
        score: calculatedScore,
        scoreLabel: calculatedScore > 130 ? 'HOT' : calculatedScore >= 60 ? 'WARM' : 'COLD',
        nextAction: hasValidCustomAction ? (lead.ai_suggestion as string) : defaultFirstContact,
        createdAt: lead.created_at,
        isClinical: isClinical,
        followupDate: lead.followup_date || null,
        followupNote: lead.followup_note || null,
        email: lead.email,
        city: lead.city,
        status: status,
        consultationCategory: (lead.consultation_category as any) || 'internet',
        courtesyReason: lead.courtesy_reason || undefined,
      };

      if (columns[status]) {
        columns[status].push(mappedLead);
      } else {
        columns['triagem'].push(mappedLead);
      }
    });

    // Ordenar as colunas por Status do Follow Up (Atrasados > Hoje > Outros)
    const today = new Date();
    today.setHours(0,0,0,0);
    
    Object.keys(columns).forEach(key => {
      columns[key].sort((a, b) => {
        let weightA = 0;
        let weightB = 0;

        if (a.followupDate) {
          const aDate = new Date(a.followupDate);
          aDate.setHours(0,0,0,0);
          if (aDate < today) weightA = 2; // Late
          else if (aDate.getTime() === today.getTime()) weightA = 1; // Today
        }

        if (b.followupDate) {
          const bDate = new Date(b.followupDate);
          bDate.setHours(0,0,0,0);
          if (bDate < today) weightB = 2; // Late
          else if (bDate.getTime() === today.getTime()) weightB = 1; // Today
        }

        return weightB - weightA;
      });
    });
    
    return columns;
  }, [initialLeads]);

  const [columnsData, setColumnsData] = useState<Record<string, Lead[]>>(groupedLeads);

  React.useEffect(() => {
    setColumnsData(groupedLeads);
  }, [groupedLeads]);

  // Controles de Scroll Horizontal Suave
  const scrollBoard = (offset: number) => {
    if (boardRef.current) {
      boardRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollToColumn = (colId: string) => {
    const el = colRefs.current[colId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  // Auto-scroll durante Drag se aproximar das bordas do board
  const handleBoardDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const threshold = 140;
    if (e.clientX - rect.left < threshold) {
      boardRef.current.scrollLeft -= 16;
    } else if (rect.right - e.clientX < threshold) {
      boardRef.current.scrollLeft += 16;
    }
  };

  // Função Unificada para Mover Lead (Usada tanto por Drag & Drop quanto pelo Menu Rápido de 1 Clique)
  const handleMoveLead = (leadId: string, toColumnId: string) => {
    setColumnsData(prev => {
      let targetLead: Lead | null = null;
      let fromColId: string | null = null;

      // Localiza o lead e a coluna de origem
      for (const [colId, list] of Object.entries(prev)) {
        const found = list.find(l => l.id === leadId);
        if (found) {
          targetLead = { ...found, status: toColumnId };
          fromColId = colId;
          break;
        }
      }

      if (!targetLead || !fromColId || fromColId === toColumnId) return prev;

      const sourceCol = prev[fromColId].filter(l => l.id !== leadId);
      const targetCol = [...(prev[toColumnId] || []), targetLead];

      // Dispara persistência assíncrona no Neon e telemetria CAPI
      startTransition(() => {
        updateLeadStatus(targetLead.id, toColumnId, targetLead);
      });

      return {
        ...prev,
        [fromColId]: sourceCol,
        [toColumnId]: targetCol
      };
    });
  };

  // Callback ao criar um novo paciente manualmente
  const handleLeadCreated = (rawLead: any) => {
    let source = 'Entrada Manual';
    try {
      if (rawLead.utms) {
        const parsed = typeof rawLead.utms === 'string' ? JSON.parse(rawLead.utms) : rawLead.utms;
        source = parsed.utm_campaign || parsed.origin || 'Entrada Manual';
      }
    } catch { /* ignora */ }

    const targetCol = rawLead.status || 'qualificacao';

    const mapped: Lead = {
      id: rawLead.id,
      name: rawLead.name,
      phone: rawLead.phone,
      procedure: rawLead.procedure || '-',
      timeframe: rawLead.timeframe || '-',
      source: source,
      score: 100,
      scoreLabel: 'HOT',
      nextAction: rawLead.ai_suggestion || rawLead.followup_note || 'Qualificar via Whats',
      createdAt: rawLead.created_at || new Date().toISOString(),
      isClinical: false,
      followupDate: rawLead.followup_date || null,
      followupNote: rawLead.followup_note || null,
      email: rawLead.email,
      city: rawLead.city,
      status: targetCol,
      consultationCategory: rawLead.consultation_category || 'internet',
      courtesyReason: rawLead.courtesy_reason || undefined,
    };

    setColumnsData(prev => ({
      ...prev,
      [targetCol]: [mapped, ...(prev[targetCol] || [])]
    }));

    scrollToColumn(targetCol);
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, lead: Lead, fromColumnId: string) => {
    setDraggedLead({ lead, fromColumnId });
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', JSON.stringify({ leadId: lead.id, fromColumnId }));
    } catch { /* fallback */ }

    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.4';
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
    setDraggedLead(null);
    setDragOverColumnId(null);
  };

  const handleDragOverColumn = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumnId !== colId) {
      setDragOverColumnId(colId);
    }
  };

  const handleDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault();
    setDragOverColumnId(null);

    let leadIdToMove = draggedLead?.lead.id;
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const parsed = JSON.parse(dataStr);
        if (parsed.leadId) leadIdToMove = parsed.leadId;
      }
    } catch { /* fallback */ }

    if (leadIdToMove) {
      handleMoveLead(leadIdToMove, toColumnId);
    }
    setDraggedLead(null);
  };

  // Filtragem Dinâmica dos Leads nas Colunas
  const filteredColumnsData = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const query = searchQuery.trim().toLowerCase();

    const result: Record<string, Lead[]> = {};

    Object.entries(columnsData).forEach(([colId, leads]) => {
      result[colId] = leads.filter(lead => {
        // Filtro de Texto (Nome, Telefone, Procedimento, Origem)
        if (query) {
          const matchName = lead.name.toLowerCase().includes(query);
          const matchPhone = lead.phone.replace(/\D/g, '').includes(query.replace(/\D/g, ''));
          const matchProc = lead.procedure.toLowerCase().includes(query);
          const matchSource = lead.source.toLowerCase().includes(query);
          if (!matchName && !matchPhone && !matchProc && !matchSource) {
            return false;
          }
        }

        // Filtro Térmico / Follow-up
        if (thermalFilter === 'HOT') {
          return lead.scoreLabel === 'HOT';
        }
        if (thermalFilter === 'TODAY') {
          if (!lead.followupDate) return false;
          const target = new Date(lead.followupDate);
          target.setHours(0,0,0,0);
          return target.getTime() === today.getTime();
        }
        if (thermalFilter === 'LATE') {
          if (!lead.followupDate) return false;
          const target = new Date(lead.followupDate);
          target.setHours(0,0,0,0);
          return target < today;
        }

        return true;
      });
    });

    return result;
  }, [columnsData, searchQuery, thermalFilter]);

  // Colunas Visíveis de acordo com o Segmento de Funil
  const visibleColumns = useMemo(() => {
    if (activeSegment === 'ALL') return COLUMNS;
    return COLUMNS.filter(c => c.segment === activeSegment);
  }, [activeSegment]);

  // Contagem Total de Leads Ativos visíveis
  const totalVisibleLeads = useMemo(() => {
    return Object.values(filteredColumnsData).reduce((acc, curr) => acc + curr.length, 0);
  }, [filteredColumnsData]);

  const hasActiveFilters = searchQuery !== '' || thermalFilter !== 'ALL' || activeSegment !== 'ALL';

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* BARRA SUPERIOR DE NAVEGAÇÃO, BUSCA E FILTROS */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-black/5 p-3 sm:p-4 shadow-xs flex flex-col gap-3">
        {/* Linha 1: Abas de Segmentação de Funil + Botões de Scroll Horizontal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-black/5 pb-3">
          {/* Abas de Foco de Funil */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 crm-scrollbar">
            {SEGMENTS.map(seg => {
              const isActive = activeSegment === seg.id;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setActiveSegment(seg.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all shrink-0 flex items-center cursor-pointer ${
                    isActive
                      ? 'bg-[#310f0e] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{seg.label}</span>
                </button>
              );
            })}
          </div>

          {/* Controles de Navegação Horizontal Lateral (← e →) + Novo Paciente */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => setIsNewLeadModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#310f0e] hover:bg-[#4a1715] text-white text-xs sm:text-[13px] font-semibold transition-all shadow-xs flex items-center justify-center cursor-pointer shrink-0"
              title="Cadastrar Novo Paciente (Entrada Manual: Indicação, Amigo do Dr. Mário, etc.)"
            >
              <span>Novo Paciente</span>
            </button>

            <span className="text-xs font-semibold text-slate-600 hidden sm:inline ml-1">Rolar colunas:</span>
            <button
              type="button"
              onClick={() => scrollBoard(-360)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer shadow-2xs border border-slate-200 hover:border-slate-300 flex items-center gap-1 text-xs font-semibold"
              title="Rolar para as colunas anteriores à esquerda"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Anterior</span>
            </button>
            <button
              type="button"
              onClick={() => scrollBoard(360)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer shadow-2xs border border-slate-200 hover:border-slate-300 flex items-center gap-1 text-xs font-semibold"
              title="Rolar para as próximas colunas à direita"
            >
              <span className="hidden sm:inline">Próxima</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Linha 2: Campo de Busca Instantânea + Filtros Térmicos */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Campo de Pesquisa em Tempo Real */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por paciente, telefone, cirurgia..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#310f0e]/20 focus:border-[#310f0e] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Limpar busca"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filtros de Temperatura e Retorno (Sem Emojis) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">Filtro:</span>
            
            <button
              type="button"
              onClick={() => setThermalFilter('ALL')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                thermalFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({totalVisibleLeads})
            </button>

            <button
              type="button"
              onClick={() => setThermalFilter('HOT')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                thermalFilter === 'HOT'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span>Leads Quentes</span>
            </button>

            <button
              type="button"
              onClick={() => setThermalFilter('TODAY')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                thermalFilter === 'TODAY'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Retorno Hoje</span>
            </button>

            <button
              type="button"
              onClick={() => setThermalFilter('LATE')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                thermalFilter === 'LATE'
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              <span>Atrasados</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setThermalFilter('ALL');
                  setActiveSegment('ALL');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 underline cursor-pointer"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Linha 3: Pílulas de Salto Rápido para Colunas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 crm-scrollbar text-xs">
          <span className="text-slate-500 font-medium shrink-0">Ir para:</span>
          {visibleColumns.map(col => {
            const count = (filteredColumnsData[col.id] || []).length;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => scrollToColumn(col.id)}
                className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 font-medium transition-colors flex items-center gap-1 border border-slate-200 cursor-pointer"
              >
                <span className="truncate max-w-[130px]">{col.title}</span>
                <span className="font-bold text-slate-900 bg-white px-1.5 py-0.2 rounded-full text-[10px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* O KANBAN BOARD CONTAINER (Scroll suave, sem snap-x travando, com auto-scroll no drag) */}
      <div 
        ref={boardRef}
        onDragOver={handleBoardDragOver}
        className="flex gap-4 overflow-x-auto pb-6 pt-1 h-[calc(100vh-270px)] min-h-[500px] items-stretch crm-scrollbar"
      >
        {visibleColumns.map((col) => {
          const leads = filteredColumnsData[col.id] || [];
          const isArchivedCol = col.id === 'arquivado';
          const isCollapsed = isArchivedCol && !isArchiveOpen && activeSegment === 'ALL';
          const isDragOver = dragOverColumnId === col.id;
          
          return (
            <div 
              key={col.id} 
              ref={(el) => { colRefs.current[col.id] = el; }}
              onDragOver={(e) => handleDragOverColumn(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex-shrink-0 flex flex-col h-full bg-white/80 backdrop-blur-md rounded-2xl border transition-all duration-200 ${
                isDragOver 
                  ? 'border-[#310f0e] ring-2 ring-[#310f0e]/20 bg-amber-50/40 shadow-md' 
                  : 'border-black/5 hover:border-black/10 shadow-xs'
              } ${isCollapsed ? 'w-16 cursor-pointer hover:bg-slate-100' : 'w-[320px]'}`}
              onClick={() => { if (isCollapsed) setIsArchiveOpen(true); }}
              title={isCollapsed ? "Clique para expandir os Arquivados" : ""}
            >
              {isCollapsed ? (
                <div className="flex flex-col items-center justify-start h-full w-full py-4 relative">
                  <div className="w-7 h-7 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <span className="bg-black/10 text-black/70 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mt-3">
                    {leads.length}
                  </span>
                  <div className="flex-1 flex items-center justify-center w-full relative mt-10">
                    <div className="-rotate-90 whitespace-nowrap text-xs font-bold tracking-widest uppercase text-black/40">
                      Arquivados
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header da Coluna com Contagem e Botão Ocultar */}
                  <div className="p-3.5 flex items-center justify-between border-b border-black/5 bg-slate-50/50 rounded-t-2xl shrink-0">
                    <h2 className="font-semibold text-sm sm:text-[14px] text-[#1d1d1f] tracking-tight truncate pr-2">
                      {col.title}
                    </h2>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="bg-[#310f0e]/10 text-[#310f0e] text-xs font-bold px-2 py-0.5 rounded-full">
                        {leads.length}
                      </span>
                      {isArchivedCol && activeSegment === 'ALL' && (
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setIsArchiveOpen(false); }}
                          className="text-black/40 hover:text-black/80 p-1 rounded hover:bg-black/5 transition-colors cursor-pointer"
                          title="Recolher coluna de arquivados"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Indicador Visual de Drop Ativo */}
                  {isDragOver && (
                    <div className="mx-3 my-2 p-2 rounded-xl border-2 border-dashed border-[#310f0e] bg-[#310f0e]/5 text-center text-xs font-bold text-[#310f0e] animate-pulse">
                      Soltar paciente nesta etapa
                    </div>
                  )}

                  {/* CORPO DA COLUNA: Scroll Vertical 100% Fluido com crm-scrollbar */}
                  <div 
                    onDragOver={(e) => handleDragOverColumn(e, col.id)}
                    className="flex-1 overflow-y-auto overscroll-y-auto min-h-0 p-3 space-y-3 crm-scrollbar"
                  >
                    {leads.map(lead => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead, col.id)}
                        onDragEnd={handleDragEnd}
                      >
                        <LeadCard 
                          lead={lead} 
                          onMoveToColumn={handleMoveLead}
                          columnsList={COLUMNS}
                        />
                      </div>
                    ))}
                    
                    {leads.length === 0 && (
                      <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center">
                        <span className="text-sm text-slate-400 font-medium">Nenhum paciente</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">Solte um card aqui</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Cadastro de Novo Paciente (Entrada Manual) */}
      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
        onSuccess={handleLeadCreated}
      />
    </div>
  );
}
