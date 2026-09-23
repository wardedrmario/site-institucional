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
    <main className="min-h-screen bg-white selection:bg-[#ccb9b6]/30 selection:text-[#310f0e]">
      <Suspense fallback={null}>
        <UTMTracker />
      </Suspense>

      {/* 1. HERO SECTION (Full-Bleed Bright Aesthetic) */}
      <section className="relative w-full h-[90vh] min-h-[650px] md:min-h-[800px] flex items-center overflow-hidden bg-white">
        
        {/* Imagem de Fundo Full-Bleed */}
        <div className="absolute inset-0 w-full h-full z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/lifestyle/hero.jpg" 
            alt="Beleza Natural" 
            className="w-full h-full object-cover object-[center_30%] md:object-center"
          />
          {/* Gradiente branco forte da esquerda para garantir leitura perfeita no desktop e mobile */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent w-full md:w-[80%]" />
          
          {/* Gradiente de baixo para unificar com a próxima seção */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90" />
        </div>
        
        {/* Conteúdo sobreposto alinhado à esquerda */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 mt-16 md:mt-0">
          
          <div className="max-w-2xl animate-blur-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-8 bg-[#ccb9b6]" />
              <span className="text-[#86868b] font-medium text-xs md:text-sm uppercase tracking-[0.25em]">
                Alta Cirurgia Plástica
              </span>
            </div>

            <h1 className="text-[44px] sm:text-[56px] md:text-[72px] font-semibold tracking-tighter text-[#1d1d1f] leading-[1.05] mb-6">
              A elegância mora <br />
              <span className="text-[#86868b] italic font-light">na naturalidade.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#1d1d1f]/70 font-normal leading-relaxed max-w-lg mb-10">
              Contornos suaves, harmonia facial e a confiança de se sentir bem na própria pele, esculpidos com mais de 30 anos de rigor técnico.
            </p>

            {!showLeadForm && (
              <button 
                onClick={() => setShowLeadForm(true)}
                className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-[#1d1d1f] px-8 py-4 text-[15px] font-medium text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-[#310f0e] hover:shadow-[0_12px_24px_rgba(49,15,14,0.2)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Solicitar Planejamento
                <svg className="w-4 h-4 text-white/70 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}

            {showLeadForm && (
              <div id="triagem" className="w-full max-w-lg mt-4 animate-blur-in-up shadow-2xl ring-1 ring-black/5 rounded-[32px] overflow-hidden">
                <LeadForm onClose={() => setShowLeadForm(false)} />
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 2. AUTORIDADE ABSOLUTA (White/Clean Layout) */}
      <section className="w-full bg-[#f5f5f7] py-24 md:py-32 px-6">
        <div className="max-w-[1080px] mx-auto bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            
            {/* Foto Dr. Mário - Agora com fundo claro ao redor e respiro */}
            <div className="md:col-span-5 relative">
              <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgb(0,0,0,0.08)] relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/dr-mario/about.jpg" 
                  alt="Dr. Mário Warde" 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
              
              {/* Crachá flutuante */}
              <div className="absolute -bottom-6 -right-6 md:-right-10 bg-white p-5 rounded-2xl shadow-xl ring-1 ring-black/5 animate-blur-in-up [animation-delay:300ms]">
                <p className="text-[#1d1d1f] font-semibold text-lg tracking-tight">Dr. Mário Warde</p>
                <p className="text-[#86868b] text-[11px] font-medium uppercase tracking-[0.15em] mt-1">CRM 81.741 • RQE 18.343</p>
              </div>
            </div>

            {/* Texto Manifesto */}
            <div className="md:col-span-7 flex flex-col justify-center mt-10 md:mt-0">
              <h2 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-8 tracking-tighter leading-[1.1]">
                A verdadeira excelência não grita. <br/>
                <span className="text-[#86868b] italic font-light">Ela se constrói.</span>
              </h2>
              
              <div className="space-y-6 text-[#1d1d1f]/75 text-[17px] leading-[1.7] font-normal">
                <p>
                  Formado pela <strong className="font-semibold text-[#1d1d1f]">Universidade de São Paulo (USP)</strong> em 1994, com residência médica no Hospital das Clínicas. A base da minha carreira não foi construída na estética, mas forjada na altíssima complexidade da reconstrução.
                </p>
                <p>
                  Coordenei o setor de sequela de queimaduras no Hospital do Servidor Público (SP) e a cirurgia plástica para lipodistrofias no Instituto Emílio Ribas. Essa bagagem me ensinou que o corpo humano exige respeito absoluto aos seus limites.
                </p>
                
                {/* Quote Box Clean */}
                <div className="mt-10 p-6 bg-[#FAFAFA] rounded-2xl border border-black/5">
                  <p className="text-[#1d1d1f] font-medium text-lg md:text-xl leading-relaxed tracking-tight italic">
                    "Não busco pacientes que procuram apenas por um preço. Nosso foco é em quem exige qualidade na prestação de serviço, segurança inegociável e dignidade."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PROCEDIMENTOS ASSINATURA (Clean Grid) */}
      <div className="w-full py-24 md:py-32 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16 md:mb-24">
            <span className="text-[#86868b] font-medium text-xs uppercase tracking-[0.2em] mb-4 block">
              Protocolos Cirúrgicos
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tighter">
              Procedimentos com Assinatura
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            
            {/* Facial */}
            <div className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 ring-1 ring-black/5 shadow-sm transition-shadow duration-500 group-hover:shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/procedures/facial.jpg" 
                  alt="Harmonia Facial" 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3 tracking-tight px-2">Harmonia Facial</h3>
              <p className="text-[#1d1d1f]/60 leading-relaxed text-[16px] px-2">
                Lifting Facial e Rinoplastia com foco na preservação da identidade visual e contornos naturais da face.
              </p>
            </div>

            {/* Mamas */}
            <div className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 ring-1 ring-black/5 shadow-sm transition-shadow duration-500 group-hover:shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/procedures/breast.jpg" 
                  alt="Cirurgia Mamária" 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3 tracking-tight px-2">Elegância Mamária</h3>
              <p className="text-[#1d1d1f]/60 leading-relaxed text-[16px] px-2">
                Mamoplastia e Mastopexia desenhadas para proporções que respeitam o biotipo estrutural da paciente.
              </p>
            </div>

            {/* Contorno Corporal */}
            <div className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 ring-1 ring-black/5 shadow-sm transition-shadow duration-500 group-hover:shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/procedures/body.jpg" 
                  alt="Contorno Corporal" 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3 tracking-tight px-2">Contorno Corporal</h3>
              <p className="text-[#1d1d1f]/60 leading-relaxed text-[16px] px-2">
                Lipoaspiração de alta definição e Abdominoplastia esculpidas com rigor técnico e refinamento.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* 4. FINAL CTA (Soft & Elegant) */}
      <section className="w-full bg-[#f5f5f7] py-24 md:py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] mb-6 tracking-tighter leading-tight">
            Pronta para dar <br/> o primeiro passo?
          </h2>
          <p className="text-[#1d1d1f]/60 text-[18px] mb-12 leading-relaxed">
            Nossa equipe de atendimento está preparada para entender suas expectativas e desenhar a jornada da sua primeira consulta.
          </p>
          
          <button 
            onClick={() => {
              setShowLeadForm(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-[#1d1d1f] px-10 py-5 text-[16px] font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] active:scale-[0.98]"
          >
            Falar com Atendimento
          </button>
        </div>
      </section>
    </main>
  );
}
