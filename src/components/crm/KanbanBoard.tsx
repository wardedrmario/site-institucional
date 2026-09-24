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

const INITIAL_MOCK_LEADS: Record<string, Lead[]> = {
  'triagem': [
    {
      id: '1',
      name: 'Maria Eduarda Silva',
      phone: '(11) 98765-4321',
      procedure: 'Rinoplastia',
      timeframe: 'O quanto antes (Até 1 mês)',
      source: 'Meta Ads | Lipo',
      score: 145,
      scoreLabel: 'HOT',
      nextAction: 'Ligar para Agendar',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Ana Carolina',
      phone: '(11) 91234-5678',
      procedure: 'Botox / Preenchimento',
      timeframe: 'Pesquisando',
      source: 'Google Ads',
      score: 45,
      scoreLabel: 'COLD',
      nextAction: 'Enviar material educativo',
      createdAt: new Date().toISOString(),
    }
  ],
  'qualificacao': [
    {
      id: '3',
      name: 'Juliana Costa',
      phone: '(21) 99999-8888',
      procedure: 'Prótese de Mama',
      timeframe: 'Próximos 3 meses',
      source: 'Indicação (Fernanda)',
      score: 110,
      scoreLabel: 'WARM',
      nextAction: 'Tirar dúvidas de recuperação',
      createdAt: new Date().toISOString(),
    }
  ],
  'consulta': [
    {
      id: '4',
      name: 'Beatriz Souza',
      phone: '(31) 97777-6666',
      procedure: 'Lipo HD',
      timeframe: 'O quanto antes',
      source: 'Instagram Orgânico',
      score: 160,
      scoreLabel: 'HOT',
      nextAction: 'Preparar ficha médica',
      createdAt: new Date().toISOString(),
    }
  ],
  'pos_consulta': [
    {
      id: '5',
      name: 'Carla Dias',
      phone: '(11) 95555-4444',
      procedure: 'Rinoplastia',
      timeframe: 'O quanto antes',
      source: 'Meta Ads',
      score: 135,
      scoreLabel: 'HOT',
      nextAction: 'Follow-up 24h (Resumo)',
      createdAt: new Date().toISOString(),
    }
  ],
  'deposito': [],
  'pre_op': [],
  'pos_op': [
    {
      id: '6',
      name: 'Fernanda Lima',
      phone: '(11) 94444-3333',
      procedure: 'Botox (Terço Superior)',
      timeframe: 'Feito há 4 meses',
      source: 'Paciente Antiga',
      score: 80,
      scoreLabel: 'WARM',
      nextAction: 'Enviar Lembrete de Retorno',
      createdAt: new Date().toISOString(),
    }
  ]
};

export default function KanbanBoard({ initialLeads = [] }: { initialLeads?: any[] }) {
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

      const mappedLead: Lead = {
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        procedure: lead.procedure || '-',
        timeframe: lead.timeframe || '-',
        source: source,
        score: lead.score || 50,
        scoreLabel: lead.score > 100 ? 'HOT' : lead.score > 60 ? 'WARM' : 'COLD',
        nextAction: lead.status === 'triagem' ? 'Qualificar via Whats' : '-',
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
    <div className="flex gap-4 overflow-x-auto pb-8 pt-4 h-[calc(100vh-140px)] items-start snap-x select-none">
      {COLUMNS.map((col) => {
        const leads = columnsData[col.id] || [];
        
        return (
          <div 
            key={col.id} 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="flex-shrink-0 w-[300px] flex flex-col h-full bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm snap-center transition-colors hover:bg-white/80"
          >
            {/* Header da Coluna */}
            <div className="p-4 flex items-center justify-between border-b border-black/5">
              <h2 className="font-semibold text-sm text-[#1d1d1f]">{col.title}</h2>
              <span className="bg-black/10 text-[#1d1d1f] text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full">
                {leads.length}
              </span>
            </div>
            
            {/* Corpo da Coluna (Lista de Cards) */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
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
