'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LeadForm } from "@/components/ui/LeadForm";

// 🧲 COMPONENTE INVISÍVEL PARA RASTREAMENTO (CAPI PREPARATION)
function UTMTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'camp_id', 'adset_id', 'ad_id'];
      const currentUTMs: Record<string, string> = {};
      let hasNewUtms = false;

      utms.forEach(param => {
        const value = searchParams.get(param);
        if (value) {
          currentUTMs[param] = value;
          hasNewUtms = true;
        }
      });

      if (hasNewUtms) {
        currentUTMs.timestamp = new Date().toISOString();
        localStorage.setItem('__mw_utms', JSON.stringify(currentUTMs));
      }
    }
  }, [searchParams]);

  return null;
}

export default function PrimeiraConsulta() {
  const [showLeadForm, setShowLeadForm] = useState(false);

  return (
    <main className="min-h-screen bg-[#f5f5f7] selection:bg-[#ccb9b6]/30 selection:text-[#310f0e]">
      <Suspense fallback={null}>
        <UTMTracker />
      </Suspense>

      {/* 1. HERO SECTION (High-End Visual Design - Linear/Apple Aesthetic) */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-end overflow-hidden">
        {/* Background Video com overlay ultra-suave */}
        <div className="absolute inset-0 w-full h-full">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover scale-105"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          {/* Gradiente complexo para legibilidade perfeita sem escurecer demais */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-[#310f0e]/10 mix-blend-multiply" />
        </div>

        {/* Content Alinhado à Direita com tipografia "Editorial" */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col items-end text-right mt-16">
          
          <div className="flex items-center gap-3 mb-6 animate-blur-in-up">
            <div className="h-[1px] w-8 bg-[#ccb9b6]" />
            <span className="text-[#ccb9b6] font-medium text-xs md:text-sm uppercase tracking-[0.25em]">
              Alta Cirurgia Plástica
            </span>
          </div>

          <h1 className="text-[44px] sm:text-[64px] md:text-[80px] font-semibold tracking-tighter text-white leading-[1.05] drop-shadow-sm mb-8 max-w-3xl animate-blur-in-up [animation-delay:100ms]">
            A elegância mora <br />
            <span className="text-white/80 italic font-light">na naturalidade.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 font-normal leading-relaxed max-w-xl mb-12 animate-blur-in-up [animation-delay:200ms]">
            Contornos suaves, harmonia facial e a confiança de se sentir bem na própria pele, esculpidos com mais de 30 anos de rigor técnico.
          </p>

          {!showLeadForm && (
            <div className="animate-blur-in-up [animation-delay:300ms]">
              <button 
                onClick={() => setShowLeadForm(true)}
                className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-white/95 px-8 py-4 text-[15px] font-semibold text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-white/20 transition-all duration-300 ease-out hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:ring-white/40 active:scale-[0.98]"
              >
                Solicitar Planejamento
                <svg className="w-4 h-4 text-[#1d1d1f]/50 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}

          {showLeadForm && (
            <div id="triagem" className="w-full max-w-lg mt-4 animate-blur-in-up text-left bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl ring-1 ring-white/10">
              <LeadForm onClose={() => setShowLeadForm(false)} />
            </div>
          )}
        </div>
      </section>

      {/* 2. AUTORIDADE ABSOLUTA (Editorial Bento-Style) */}
      <section className="w-full bg-[#f5f5f7] py-32 px-6">
        <div className="max-w-[1080px] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Foto Editorial */}
            <div className="md:col-span-5 h-[600px] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative group ring-1 ring-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/dr-mario/about.jpg" 
                alt="Dr. Mário Warde" 
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-8 left-8">
                <p className="text-white font-semibold text-lg tracking-tight">Dr. Mário Warde</p>
                <p className="text-white/80 text-[11px] uppercase tracking-[0.15em] mt-1">CRM 81.741 • RQE 18.343</p>
              </div>
            </div>

            {/* Texto Manifesto */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <h2 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-8 tracking-tighter leading-[1.1]">
                A verdadeira excelência não grita. <br/>
                <span className="text-[#86868b]">Ela se constrói.</span>
              </h2>
              
              <div className="space-y-6 text-[#1d1d1f]/70 text-[17px] leading-[1.6] font-normal">
                <p>
                  Formado pela <strong className="font-semibold text-[#1d1d1f]">Universidade de São Paulo (USP)</strong> em 1994, com residência médica no Hospital das Clínicas. A base da minha carreira não foi construída na estética, mas forjada na altíssima complexidade da reconstrução.
                </p>
                <p>
                  Coordenei o setor de sequela de queimaduras no Hospital do Servidor Público (SP) e a cirurgia plástica para lipodistrofias no Instituto Emílio Ribas. Essa bagagem me ensinou que o corpo humano exige respeito absoluto aos seus limites.
                </p>
                
                {/* Quote Box Apple Style */}
                <div className="mt-10 relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-[#ccb9b6] before:rounded-full">
                  <p className="text-[#1d1d1f] font-medium text-xl leading-relaxed tracking-tight">
                    &quot;Não busco pacientes que procuram apenas por um preço. Nosso foco é em quem exige qualidade na prestação de serviço, segurança inegociável e dignidade.&quot;
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PROCEDIMENTOS ASSINATURA (Editorial Realist) */}
      <div className="w-full py-32 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-[#86868b] font-medium text-xs uppercase tracking-[0.2em] mb-4 block">
              Protocolos Cirúrgicos
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tighter">
              Procedimentos com Assinatura
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            
            {/* Facial */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 ring-1 ring-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/procedures/facial.jpg" 
                  alt="Harmonia Facial" 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-2 tracking-tight">Harmonia Facial</h3>
              <p className="text-[#1d1d1f]/60 leading-relaxed text-[15px]">
                Lifting Facial e Rinoplastia com foco na preservação da identidade visual e contornos naturais da face.
              </p>
            </div>

            {/* Mamas */}
            <div className="group cursor-pointer md:translate-y-12">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 ring-1 ring-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/procedures/breast.jpg" 
                  alt="Cirurgia Mamária" 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-2 tracking-tight">Elegância Mamária</h3>
              <p className="text-[#1d1d1f]/60 leading-relaxed text-[15px]">
                Mamoplastia e Mastopexia desenhadas para proporções que respeitam o biotipo estrutural da paciente.
              </p>
            </div>

            {/* Contorno Corporal */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 ring-1 ring-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/procedures/body.jpg" 
                  alt="Contorno Corporal" 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-2 tracking-tight">Contorno Corporal</h3>
              <p className="text-[#1d1d1f]/60 leading-relaxed text-[15px]">
                Lipoaspiração de alta definição e Abdominoplastia esculpidas com rigor técnico e refinamento.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* 4. FINAL CTA (Bolder, Minimalist) */}
      <section className="w-full bg-[#1d1d1f] py-32 px-6 text-center relative overflow-hidden">
        {/* Glow sutil no fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#310f0e] rounded-full blur-[120px] opacity-40 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tighter leading-tight">
            Pronta para dar <br/> o primeiro passo?
          </h2>
          <p className="text-white/60 text-[17px] mb-12 leading-relaxed">
            Nossa equipe de concierge está preparada para entender suas expectativas e desenhar a jornada da sua primeira consulta.
          </p>
          
          <button 
            onClick={() => {
              setShowLeadForm(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-white px-10 py-4 text-[15px] font-semibold text-[#1d1d1f] transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            Falar com Atendimento
          </button>
        </div>
      </section>
    </main>
  );
}
