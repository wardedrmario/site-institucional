'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppleProcedures } from "@/components/ui/AppleProcedures";
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

export default function PrimeiraConsultaLP() {
  const [showLeadForm, setShowLeadForm] = useState(false);

  return (
    <main className="flex flex-col items-center w-full bg-[#fbfbfd]">
      <Suspense fallback={null}>
        <UTMTracker />
      </Suspense>
      
      {/* 1. HERO SECTION (Foco Total) */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center py-20 text-center overflow-hidden bg-black">
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-black to-[#0a0a0a] z-0" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col items-center">
          <span className="text-[#ccb9b6] font-semibold text-sm uppercase tracking-[0.2em] mb-6 animate-blur-in-up">
            Dr. Mário Warde • Cirurgia Plástica
          </span>
          <h1 className="text-[40px] sm:text-[56px] md:text-[64px] font-bold tracking-tight text-white leading-[1.1] drop-shadow-lg mb-8 animate-blur-in-up [animation-delay:100ms]">
            Experiência, Segurança e Resultados Naturais.
          </h1>
          <p className="text-lg md:text-xl text-white/70 font-medium leading-relaxed max-w-2xl mb-12 animate-blur-in-up [animation-delay:200ms]">
            Um atendimento fundamentado na ética, no rigor técnico e na dignidade do paciente. Planeje a sua transformação com quem tem mais de 30 anos de medicina de excelência.
          </p>

          {!showLeadForm && (
            <button 
              onClick={() => setShowLeadForm(true)}
              className="bg-[#ccb9b6] hover:bg-[#b8a6a3] text-[#310f0e] text-lg font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-xl hover:scale-105 animate-blur-in-up [animation-delay:300ms]"
            >
              Agendar Primeira Consulta
            </button>
          )}

          {showLeadForm && (
            <div id="triagem" className="w-full max-w-2xl mt-8 animate-blur-in-up text-left">
              <LeadForm onClose={() => setShowLeadForm(false)} />
            </div>
          )}
        </div>
      </section>

      {/* 2. AUTORIDADE ABSOLUTA (O Texto do Doutor) */}
      <section className="w-full bg-white py-24 px-4 border-t border-black/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-start">
          
          <div className="w-full md:w-5/12 bg-[#fbfbfd] rounded-3xl overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-500 z-10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/dr-mario/about.jpg" 
              alt="Dr. Mário Warde" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent z-20">
              <p className="text-white font-bold text-lg">Dr. Mário Warde</p>
              <p className="text-white/80 text-xs uppercase tracking-widest">CRM 81.741 • RQE 18.343</p>
            </div>
          </div>

          <div className="w-full md:w-7/12 flex flex-col">
            <span className="text-[#7a2f2c] font-bold uppercase tracking-widest text-xs mb-4">A Trajetória</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
              A verdadeira excelência não grita. <br className="hidden md:block"/> Ela se constrói com dedicação.
            </h2>
            
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Sou <strong>Mario Warde</strong>, 55 anos. Formado pela Faculdade de Medicina da Universidade de São Paulo (USP) em 1994, onde também concluí minha residência médica (2 anos de Cirurgia Geral e 3 anos de Cirurgia Plástica no Hospital das Clínicas).
              </p>
              <p>
                A base da minha carreira foi forjada na alta complexidade. Entre 2004 e 2011, fui coordenador do setor de sequela de queimaduras e tratamentos cosmiátricos no paciente queimado no Hospital do Servidor Público Estadual (SP). De 2011 a 2019, atuei como coordenador da Cirurgia Plástica para tratamento de lipodistrofias em pacientes HIV positivos no Instituto Emílio Ribas.
              </p>
              <p>
                A minha busca pela segurança inegociável do paciente me levou a formar-me em <strong>Direito</strong> em 2021, mesmo ano em que defendi meu <strong>Doutorado pelo Hospital das Clínicas da USP</strong>.
              </p>
              <div className="p-6 bg-[#fbfbfd] border-t-4 border-[#310f0e] rounded-b-2xl mt-8 shadow-sm">
                <p className="text-gray-900 font-medium italic text-xl leading-relaxed">
                  "Não busco pacientes que procuram apenas por um preço. Nosso foco é em quem exige qualidade na prestação de serviço, dignidade, segurança cirúrgica e um excelente atendimento."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROCEDIMENTOS ASSINATURA (Componente Reutilizado) */}
      <div className="w-full pt-12 pb-24 bg-[#fbfbfd]">
        <div className="max-w-4xl mx-auto text-center px-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Procedimentos com Assinatura</h2>
          <p className="text-gray-600 mt-4 text-lg">Técnicas modernas alinhadas à harmonia natural do corpo e da face.</p>
        </div>
        <AppleProcedures />
      </div>

      {/* 3.5 SEÇÃO ASPIRACIONAL (Imagens de Lifestyle/Resultados) */}
      <section className="w-full bg-white py-24 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16">
            <span className="text-[#7a2f2c] font-bold uppercase tracking-widest text-xs mb-4 block">A Visão</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              A elegância mora na naturalidade.
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Nosso objetivo não é transformar quem você é, mas revelar a sua melhor versão. Contornos suaves, harmonia facial e a confiança de se sentir bem na própria pele.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-lg group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/lifestyle/beauty_1.jpg" alt="Beleza Natural" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-lg group md:-translate-y-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/lifestyle/beauty_2.jpg" alt="Harmonia Facial" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-lg group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/lifestyle/beauty_3.jpg" alt="Contorno Corporal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="w-full bg-[#310f0e] py-24 px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Dê o primeiro passo com segurança.</h2>
        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
          Fale com a nossa equipe de atendimento para alinhar expectativas e reservar o seu horário para a Primeira Consulta.
        </p>
        <button 
          onClick={() => {
            setShowLeadForm(true);
            setTimeout(() => {
              document.getElementById('triagem')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="bg-white text-[#310f0e] hover:bg-[#ccb9b6] text-lg font-bold px-12 py-4 rounded-full transition-all duration-300 shadow-xl"
        >
          Falar com Atendimento
        </button>
      </section>
    </main>
  );
}
