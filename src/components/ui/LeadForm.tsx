'use client';

import { useState } from 'react';

type Step = 1 | 2 | 3;

export function LeadForm() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    procedure: '',
    timeframe: '',
    name: '',
    phone: '',
    email: '',
    city: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep((prev) => (prev + 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Envia para o tracking endpoint se configurado
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(() => null);
      
      const whatsappNumber = "5511999999999"; 
      const text = encodeURIComponent(
        `Olá! Meu nome é ${formData.name}. Gostaria de iniciar meu planejamento cirúrgico com o Dr. Mário Warde para ${formData.procedure} (Previsão: ${formData.timeframe}).`
      );
      window.location.href = `https://wa.me/${whatsappNumber}?text=${text}`;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-2xl border border-black/[0.06] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[32px] w-full max-w-2xl mx-auto transition-all">
      
      {/* Progress Dots */}
      <div className="flex justify-center items-center gap-2 mb-6">
        <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-wine' : 'w-2 bg-black/15'}`} />
        <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-wine' : 'w-2 bg-black/15'}`} />
        <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 3 ? 'w-8 bg-wine' : 'w-2 bg-black/15'}`} />
      </div>

      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-center text-chumbo mb-2">
        {step === 1 && 'Qual procedimento você deseja planejar?'}
        {step === 2 && 'Qual o seu momento ideal?'}
        {step === 3 && 'Acesso Exclusivo ao Concierge'}
      </h3>
      <p className="text-xs md:text-sm text-chumbo-light text-center mb-8 font-normal">
        {step === 1 && 'Selecione a área de foco para atendimento personalizado'}
        {step === 2 && 'Isso nos ajuda a calibrar a disponibilidade de agenda cirúrgica'}
        {step === 3 && 'Converse diretamente com a equipe de atendimento VIP do Dr. Mário'}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* STEP 1: PROCEDURES */}
        {step === 1 && (
          <div className="animate-blur-in-up grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Contorno Corporal', desc: 'Lipo HD & Abdominoplastia' },
              { title: 'Cirurgia Facial', desc: 'Facelift, Rino & Blefaro' },
              { title: 'Cirurgias de Mama', desc: 'Mastopexia & Prótese' },
              { title: 'Plano Combinado', desc: 'Mama + Lipo / Face' }
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={(e) => {
                  setFormData({ ...formData, procedure: item.title });
                  handleNext(e);
                }}
                className={`p-5 rounded-2xl text-left transition-all duration-200 border ${
                  formData.procedure === item.title 
                    ? 'bg-wine text-white border-wine shadow-md' 
                    : 'bg-[#f5f5f7] hover:bg-[#ebebed] text-chumbo border-transparent'
                }`}
              >
                <div className="font-semibold text-sm tracking-tight">{item.title}</div>
                <div className={`text-xs mt-1 ${formData.procedure === item.title ? 'text-white/80' : 'text-chumbo-light'}`}>
                  {item.desc}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2: TIMEFRAME */}
        {step === 2 && (
          <div className="animate-blur-in-up space-y-3">
            {[
              'O mais breve possível (próximos 30-60 dias)',
              'Nos próximos 3 a 6 meses',
              'Planejando para o próximo semestre',
              'Atendimento (Fora de SP / Exterior)'
            ].map((time) => (
              <button
                key={time}
                type="button"
                onClick={(e) => {
                  setFormData({ ...formData, timeframe: time });
                  handleNext(e);
                }}
                className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-200 text-sm font-medium border ${
                  formData.timeframe === time 
                    ? 'bg-wine text-white border-wine shadow-md' 
                    : 'bg-[#f5f5f7] hover:bg-[#ebebed] text-chumbo border-transparent'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        )}

        {/* STEP 3: CONTACT VIP */}
        {step === 3 && (
          <div className="animate-blur-in-up space-y-3">
            <div>
              <input 
                required
                type="text" 
                placeholder="Nome completo" 
                className="w-full px-5 py-3.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl focus:outline-none focus:ring-2 focus:ring-wine focus:bg-white transition-all text-sm text-chumbo placeholder:text-chumbo-light/60"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                required
                type="tel" 
                placeholder="WhatsApp (com DDD)" 
                className="w-full px-5 py-3.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl focus:outline-none focus:ring-2 focus:ring-wine focus:bg-white transition-all text-sm text-chumbo placeholder:text-chumbo-light/60"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Sua cidade / estado" 
                className="w-full px-5 py-3.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl focus:outline-none focus:ring-2 focus:ring-wine focus:bg-white transition-all text-sm text-chumbo placeholder:text-chumbo-light/60"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div>
              <input 
                required
                type="email" 
                placeholder="E-mail principal" 
                className="w-full px-5 py-3.5 bg-[#f5f5f7] border border-black/[0.06] rounded-xl focus:outline-none focus:ring-2 focus:ring-wine focus:bg-white transition-all text-sm text-chumbo placeholder:text-chumbo-light/60"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-wine hover:bg-black text-white font-medium text-sm px-6 py-4 rounded-xl transition-all duration-300 mt-3 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Iniciando...' : 'Falar com o Concierge no WhatsApp ›'}
            </button>

            <div className="flex items-center justify-center gap-2 pt-2">
              <svg className="w-3.5 h-3.5 text-chumbo-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-[11px] text-chumbo-light font-normal">
                Atendimento estritamente confidencial em conformidade com o CFM.
              </p>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
