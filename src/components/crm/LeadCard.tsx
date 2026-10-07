'use client';
import React, { useState, useTransition } from 'react';
import { generateAiForLead, updateLeadFollowup } from '@/app/actions/crm';

type LeadScore = 'HOT' | 'WARM' | 'COLD';

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
}

interface LeadCardProps {
  lead: Lead;
}

export default function LeadCard({ lead }: LeadCardProps) {
  const [isPending, startTransition] = useTransition();
  const [localNextAction, setLocalNextAction] = useState(lead.nextAction);

  // Follow-Up states
  const [isEditingFup, setIsEditingFup] = useState(false);
  const [fupDate, setFupDate] = useState(lead.followupDate ? new Date(lead.followupDate).toISOString().split('T')[0] : '');
  const [fupNote, setFupNote] = useState(lead.followupNote || '');
  const [isPendingFup, startFupTransition] = useTransition();

  const handleGenerateAi = () => {
    startTransition(async () => {
      const res = await generateAiForLead(lead.id, {
        procedure: lead.procedure,
        timeframe: lead.timeframe,
      });
      if (res?.success && res.suggestion) {
        setLocalNextAction(res.suggestion);
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

  // Configuração visual baseada no Score
  const scoreConfig = {
    HOT: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: '🔴' },
    WARM: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: '🟡' },
    COLD: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: '🔵' },
  };

  const currentConfig = scoreConfig[lead.scoreLabel];
  const cleanPhone = lead.phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(localNextAction || '');
  const whatsLink = `https://wa.me/${cleanPhone.length <= 11 ? '55'+cleanPhone : cleanPhone}?text=${encodedMessage}`;

  // Logica de Alerta de Follow-Up
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

  const borderClass = fupStatus === 'late' ? 'border-red-500 ring-2 ring-red-200' :
                      fupStatus === 'today' ? 'border-orange-500 ring-2 ring-orange-200' :
                      'border-black/5';

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing mb-3 group flex flex-col gap-3 relative overflow-hidden ${borderClass}`}>
      {/* Top Header: Score & Source & Tag */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${currentConfig.bg} ${currentConfig.color} ${currentConfig.border} border`}>
            <span>{currentConfig.icon}</span>
            <span>{lead.score} pts</span>
          </div>
          {lead.isClinical && (
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider">
              Clínico
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium text-black/40 bg-black/5 px-2 py-1 rounded-md uppercase tracking-wider max-w-[80px] truncate text-right">
          {lead.source}
        </span>
      </div>

      {/* Main Info */}
      <div>
        <h3 className="font-semibold text-[#1d1d1f] text-base">{lead.name}</h3>
        <p className="text-xs text-[#86868b] mt-0.5">{lead.phone}</p>
      </div>

      {/* Procedure & Timeframe */}
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex items-center gap-2 text-xs text-[#1d1d1f]">
          <svg className="w-3.5 h-3.5 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="font-medium">{lead.procedure}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#86868b]">
          <svg className="w-3.5 h-3.5 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{lead.timeframe}</span>
        </div>
      </div>

      {/* Follow Up Section */}
      <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
        {!isEditingFup ? (
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsEditingFup(true)}>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-sm">⏰</span>
              {lead.followupDate ? (
                <span className={`font-medium ${fupStatus === 'late' ? 'text-red-600' : fupStatus === 'today' ? 'text-orange-600' : 'text-slate-600'}`}>
                  Retorno: {new Date(lead.followupDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                </span>
              ) : (
                <span className="text-slate-400 font-medium hover:text-slate-600 transition-colors">Agendar retorno...</span>
              )}
            </div>
            {lead.followupNote && (
              <span className="text-[10px] text-slate-500 truncate max-w-[120px]">- {lead.followupNote}</span>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 cursor-auto">
            <input 
              type="date" 
              value={fupDate}
              onChange={(e) => setFupDate(e.target.value)}
              className="text-xs p-1 border rounded w-full bg-white"
            />
            <input 
              type="text" 
              placeholder="Motivo (Ex: Confirmar exames)" 
              value={fupNote}
              onChange={(e) => setFupNote(e.target.value)}
              className="text-xs p-1 border rounded w-full bg-white"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setIsEditingFup(false)} className="text-[10px] text-slate-500 hover:text-slate-800">Cancelar</button>
              <button onClick={handleSaveFup} disabled={isPendingFup} className="text-[10px] bg-black text-white px-2 py-1 rounded font-medium disabled:opacity-50">
                {isPendingFup ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Next Action & WhatsApp */}
      <div className="mt-1 pt-2 border-t border-black/5 flex items-center justify-between">
        <div className="text-[11px] text-[#86868b]">
          <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-black/40 font-semibold mb-0.5">
            Sugestão (IA)
            <button 
              onClick={handleGenerateAi} 
              disabled={isPending}
              className="hover:bg-black/5 p-0.5 rounded transition-colors disabled:opacity-50 cursor-pointer"
              title="Gerar/Atualizar sugestão com IA"
            >
              ✨
            </button>
          </span>
          <span className="font-medium text-[#1d1d1f]">{isPending ? 'Analisando...' : localNextAction}</span>
        </div>
        <a 
          href={whatsLink} 
          target="_blank" 
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors"
          title="Falar no WhatsApp"
        >
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
