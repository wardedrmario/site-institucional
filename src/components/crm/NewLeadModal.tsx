'use client';

import React, { useState, useTransition } from 'react';
import { createManualLead, CreateManualLeadInput } from '@/app/actions/crm';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newLead: any) => void;
}

const PROCEDURES_OPTIONS = [
  'Cirurgia Facial (Deep Plane Facelift)',
  'Cirurgia Masculina',
  'Contorno Corporal (Abdominoplastia / Lipo)',
  'Cirurgias de Mama (Mastopexia / Prótese)',
  'Rinoplastia Estruturada',
  'Procedimento Clínico / Injetáveis',
  'Não Definido / Outro',
];

const ORIGIN_OPTIONS = [
  { id: 'conhecido_pessoal', label: 'Conhecido Pessoal / Dr. Mário' },
  { id: 'indicacao', label: 'Indicação de Paciente / Família' },
  { id: 'whatsapp_direto', label: 'WhatsApp Direto (Sem Formulário)' },
  { id: 'instagram_organico', label: 'Instagram Orgânico (@drmariowarde)' },
  { id: 'medico_parceiro', label: 'Indicação Médica / Colega' },
  { id: 'telefone_fixo', label: 'Ligação Telefônica / Consultório' },
  { id: 'outro', label: 'Outra Origem' },
];

export default function NewLeadModal({ isOpen, onClose, onSuccess }: NewLeadModalProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Campos do Formulário
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('São Paulo - SP');
  const [origin, setOrigin] = useState('conhecido_pessoal');
  const [originDetails, setOriginDetails] = useState('');
  const [procedure, setProcedure] = useState(PROCEDURES_OPTIONS[0]);
  const [status, setStatus] = useState('consulta'); // Padrão: Agendado ou Qualificação
  const [consultationCategory, setConsultationCategory] = useState<'internet' | 'indicacao' | 'indicacao_medica'>('internet');
  const [followupDate, setFollowupDate] = useState('');
  const [followupNote, setFollowupNote] = useState('');

  if (!isOpen) return null;

  // Formatação amigável de telefone brasileiro (11) 99999-9999
  const handlePhoneChange = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);
    
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length > 7) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Por favor, informe o nome completo do paciente.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Por favor, informe um telefone/WhatsApp válido com DDD.');
      return;
    }

    startTransition(async () => {
      const payload: CreateManualLeadInput = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        city: city.trim() || undefined,
        origin,
        originDetails: originDetails.trim() || undefined,
        procedure,
        status,
        consultationCategory,
        followupDate: followupDate ? new Date(followupDate).toISOString() : null,
        followupNote: followupNote.trim() || null,
        timeframe: status === 'consulta' ? 'Data Agendada' : 'Em Qualificação',
      };

      const res = await createManualLead(payload);
      if (res.success && res.lead) {
        onSuccess(res.lead);
        onClose();
      } else {
        setErrorMsg(res.error || 'Ocorreu um erro ao salvar o paciente.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-black/10 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#310f0e]"></span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Cadastrar Novo Paciente (Entrada Manual)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Para pacientes de indicação, amigos do Dr. Mário, WhatsApp direto ou consultório
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="Fechar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulário com Scroll Suave */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 crm-scrollbar">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm p-3.5 rounded-2xl flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Linha 1: Nome e WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nome do Paciente *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ricardo Sampaio"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#310f0e]/20 focus:border-[#310f0e] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                WhatsApp / Telefone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(11) 92686-2007"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#310f0e]/20 focus:border-[#310f0e] transition-all"
              />
            </div>
          </div>

          {/* Linha 2: Origem do Paciente e Detalhe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Origem do Paciente *
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#310f0e]/20 focus:border-[#310f0e] transition-all cursor-pointer"
              >
                {ORIGIN_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detalhes da Origem (Opcional)
              </label>
              <input
                type="text"
                value={originDetails}
                onChange={(e) => setOriginDetails(e.target.value)}
                placeholder="Ex: Conhecido pessoal do Dr. Mário / Mãe da Brenda"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#310f0e]/20 focus:border-[#310f0e] transition-all"
              />
            </div>
          </div>

          {/* Linha 3: Procedimento e Etapa Inicial no Kanban */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Procedimento de Interesse
              </label>
              <select
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#310f0e]/20 focus:border-[#310f0e] transition-all cursor-pointer"
              >
                {PROCEDURES_OPTIONS.map((proc) => (
                  <option key={proc} value={proc}>
                    {proc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Coluna Inicial no Kanban
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#310f0e]/20 focus:border-[#310f0e] transition-all cursor-pointer font-semibold"
              >
                <option value="consulta">🟢 Agendado (Sinal 50% Pago)</option>
                <option value="qualificacao">🟡 Qualificação Concierge</option>
                <option value="triagem">⚪ Triagem / Descoberta</option>
                <option value="consulta_realizada">🔵 Consulta Realizada (Presencial)</option>
                <option value="deposito">🟣 Cirurgia Fechada (Depósito)</option>
              </select>
            </div>
          </div>

          {/* Linha 4: Categoria de Consulta e Data de Agendamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Categoria de Honorários
              </label>
              <select
                value={consultationCategory}
                onChange={(e) => setConsultationCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#310f0e]/20 focus:border-[#310f0e] transition-all cursor-pointer"
              >
                <option value="internet">Consulta Geral — R$ 350,00 (Sinal 50%: R$ 175,00)</option>
                <option value="indicacao_medica">Consulta Médica / VIP — R$ 850,00 (Sinal 50%: R$ 425,00)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Data e Hora da Consulta / Retorno
              </label>
              <input
                type="datetime-local"
                value={followupDate}
                onChange={(e) => setFollowupDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#310f0e]/20 focus:border-[#310f0e] transition-all"
              />
            </div>
          </div>

          {/* Linha 5: Notas Iniciais */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Observações & Notas do Paciente
            </label>
            <textarea
              rows={3}
              value={followupNote}
              onChange={(e) => setFollowupNote(e.target.value)}
              placeholder="Ex: Consulta confirmada para 21/10 às 16h; sinal de R$ 100 pago via Pix em 13/10. Conhecido pessoal do Dr. Mário."
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#310f0e]/20 focus:border-[#310f0e] transition-all resize-none"
            />
          </div>

          {/* Rodapé com Botões de Ação */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl bg-[#310f0e] hover:bg-[#4a1715] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Salvando Paciente...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Salvar no CRM</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
