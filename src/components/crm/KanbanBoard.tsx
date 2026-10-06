'use client';

import React, { useState, startTransition } from 'react';
import LeadCard, { Lead } from './LeadCard';
import { updateLeadStatus } from '@/app/actions/crm';

const COLUMNS = [
  { id: 'triagem', title: 'Triagem / Descoberta' },
  { id: 'qualificacao', title: 'Qualificação' },
  { id: 'consulta', title: 'Consulta Presencial' },
  { id: 'pos_consulta', title: 'Pós-Consulta (Decisão)' },
  { id: 'deposito', title: 'Depósito / Confirmação' },
  { id: 'pre_op', title: 'Pré-operatório' },
  { id: 'pos_op', title: 'Pós-operatório / Recorrência' },
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
}

export default function KanbanBoard({ initialLeads = [] }: { initialLeads?: DbLead[] }) {
  // Converte a lista plana de leads do BD para o formato de colunas do Kanban
  const groupedLeads = React.useMemo(() => {
    const columns: Record<string, Lead[]> = {
      'triagem': [], 'qualificacao': [], 'consulta': [], 'pos_consulta': [], 'deposito': [], 'pre_op': [], 'pos_op': []
    };
    
    initialLeads.forEach(lead => {
      let source = 'Orgânico';
      try {
        if (lead.utms) {
          const parsed = typeof lead.utms === 'string' ? JSON.parse(lead.utms) : lead.utms;
          source = parsed.utm_campaign || parsed.camp_id || 'Orgânico';
        }
      } catch { /* ignora */ }

      // --- MOTOR DE LEAD SCORING (Cálculo Térmico) ---
      let calculatedScore = lead.score || 50; // Pontuação base
      
      // 1. Procedimento (Demonstra interesse ativo): +15
      if (lead.procedure && lead.procedure.trim() !== '') {
        calculatedScore += 15;
      }
      
      // 2. Urgência / Timeframe:
      if (lead.timeframe) {
        const timeLower = lead.timeframe.toLowerCase();
        if (timeLower.includes('< 1 mês') || timeLower.includes('menos') || timeLower.includes('imediato') || timeLower.includes('urgente')) {
          calculatedScore += 25;
        } else if (timeLower.includes('1 a 3 meses') || timeLower.includes('este ano') || timeLower.includes('30-60 dias') || timeLower.includes('3 a 6 meses')) {
          calculatedScore += 15;
        }
      }
      
      // 3. CEP de Alta Renda (Bairros focais de SP): +20
      if (lead.city) {
        const cityLower = lead.city.toLowerCase();
        if (cityLower.includes('alphaville') || cityLower.includes('itaim') || cityLower.includes('jardins') || cityLower.includes('moema') || cityLower.includes('vila mariana') || cityLower.includes('pinheiros')) {
          calculatedScore += 20;
        }
      }
      
      // 4. Orçamento Alinhado & Status Avançado:
      if (lead.status && ['consulta', 'pos_consulta', 'deposito', 'pre_op', 'pos_op'].includes(lead.status)) {
        calculatedScore += 40; // Ganha pontos pesados por já estar avançado no funil
      }
      // ------------------------------------------------

      const mappedLead: Lead = {
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        procedure: lead.procedure || '-',
        timeframe: lead.timeframe || '-',
        source: source,
        score: calculatedScore,
        scoreLabel: calculatedScore > 130 ? 'HOT' : calculatedScore >= 60 ? 'WARM' : 'COLD',
        nextAction: lead.ai_suggestion || (lead.status === 'triagem' ? 'Qualificar via Whats' : '-'),
        createdAt: lead.created_at,
      };

      const status = lead.status || 'triagem';
      if (columns[status]) {
        columns[status].push(mappedLead);
      } else {
        columns['triagem'].push(mappedLead);
      }
    });
    
    return columns;
  }, [initialLeads]);

  const [columnsData, setColumnsData] = useState<Record<string, Lead[]>>(groupedLeads);
  
  // Atualiza as colunas se os leads do banco mudarem (ex: refresh da página)
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColumnsData(groupedLeads);
  }, [groupedLeads]);

  const [draggedLead, setDraggedLead] = useState<{ lead: Lead, fromColumnId: string } | null>(null);

  const handleDragStart = (e: React.DragEvent, lead: Lead, fromColumnId: string) => {
    setDraggedLead({ lead, fromColumnId });
    // Estética durante o drag
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
    setDraggedLead(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault();
    if (!draggedLead) return;

    const { lead, fromColumnId } = draggedLead;

    // Se soltou na mesma coluna, não faz nada
    if (fromColumnId === toColumnId) return;

    setColumnsData(prev => {
      const sourceCol = prev[fromColumnId].filter(l => l.id !== lead.id);
      const targetCol = [...(prev[toColumnId] || []), lead];

      // Dispara a chamada assíncrona pro Back-end de forma transparente na UI
      startTransition(() => {
        updateLeadStatus(lead.id, toColumnId, lead);
      });

      return {
        ...prev,
        [fromColumnId]: sourceCol,
        [toColumnId]: targetCol
      };
    });
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-8 pt-4 h-[calc(100vh-140px)] items-stretch snap-x select-none">
      {COLUMNS.map((col) => {
        const leads = columnsData[col.id] || [];
        
        return (
          <div 
            key={col.id} 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="flex-shrink-0 w-[300px] flex flex-col overflow-hidden bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm snap-center transition-colors hover:bg-white/80"
          >
            {/* Header da Coluna */}
            <div className="p-4 flex items-center justify-between border-b border-black/5">
              <h2 className="font-semibold text-sm text-[#1d1d1f]">{col.title}</h2>
              <span className="bg-black/10 text-[#1d1d1f] text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full">
                {leads.length}
              </span>
            </div>
            
            {/* Corpo da Coluna (Lista de Cards) */}
            <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain p-3 space-y-3">
              {leads.map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead, col.id)}
                  onDragEnd={handleDragEnd}
                >
                  <LeadCard lead={lead} />
                </div>
              ))}
              
              {leads.length === 0 && (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-black/10 rounded-xl">
                  <span className="text-xs text-black/40 font-medium">Solte aqui</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
