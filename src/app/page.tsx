'use client';

import { useState } from 'react';
import { LeadForm } from "@/components/ui/LeadForm";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const faqs = [
    {
      q: "Como funciona o atendimento para quem reside fora da cidade ou no exterior?",
      a: "Disponibilizamos um serviço exclusivo de Concierge para pacientes de fora. Realizamos uma teleconsulta inicial para avaliação anatômica, alinhamento prévio de exames e todo o planejamento do seu período de estadia e recuperação com total discrição."
    },
    {
      q: "Onde são realizados os procedimentos cirúrgicos?",
      a: "O Dr. Mário Warde opera exclusivamente em centros hospitalares de primeira linha, devidamente acreditados e equipados com Unidade de Terapia Intensiva (UTI), corpo clínico de anestesia dedicado e suporte técnico ininterrupto."
    },
    {
      q: "Qual é a filosofia de resultados do Dr. Mário Warde?",
      a: "Buscamos o que chamamos de 'maestria invisível': resultados refinados, elegantes e que respeitam a proporção única de cada biotipo. A intervenção cirúrgica deve realçar a sua beleza natural, sem transformá-la em outra pessoa ou criar estigmas artificiais."
    },
    {
      q: "Quanto tempo antes devo iniciar o planejamento cirúrgico?",
      a: "Recomendamos iniciar a avaliação e os exames laboratoriais entre 30 a 90 dias antes da data desejada, assegurando a realização minuciosa do risco cirúrgico e a reserva de agenda hospitalar com tranquilidade."
    }
  ];

  return (
    <main className="flex-1 flex flex-col items-center w-full bg-[#fbfbfd]">
      
      {/* 1. HERO SECTION (Estilo Apple Keynote / Clean Store) */}
      <section className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col justify-center items-end pt-24 md:pt-32 pb-24 px-4 md:px-12 lg:px-24 text-right overflow-hidden">

        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        >
          <source src="/videos/fundo-hero.mp4" type="video/mp4" />
        </video>

        {/* Overlay escuro ao invés de claro para garantir legibilidade do texto branco */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-end w-full max-w-6xl mx-auto">
          {/* Apple-style Master Headline */}
          <h1 className="text-[44px] sm:text-[64px] md:text-[80px] lg:text-[88px] font-bold tracking-[-0.035em] text-white leading-[1.04] max-w-5xl animate-blur-in-up drop-shadow-md">
            Sua melhor versão. <br />
            <span>
              Aperfeiçoada com arte e rigor.
            </span>
          </h1>

          <p className="mt-6 md:mt-8 text-base md:text-[21px] text-white/90 max-w-2xl font-medium leading-relaxed tracking-tight animate-blur-in-up [animation-delay:200ms] drop-shadow">
          A união entre tecnologias médicas de ponta, segurança hospitalar absoluta e a busca por resultados naturais e harmônicos.
        </p>

        {/* Action Buttons */}
        {!showLeadForm && (
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-blur-in-up">
            <button 
              onClick={() => setShowLeadForm(true)}
              className="bg-wine hover:bg-black text-white text-sm font-medium px-8 py-3.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
            >
              Quero planejar o meu procedimento
            </button>
          </div>
        )}

        {/* Form Integrado / Configurator */}
        {showLeadForm && (
          <div id="triagem" className="w-full max-w-3xl mt-16 md:mt-20 scroll-mt-24 animate-blur-in-up">
            <LeadForm />
          </div>
        )}

        </div>
      </section>

      {/* 2. BENTO GRID DE PROCEDIMENTOS (Estilo Apple Bento Cards) */}
      <section id="procedimentos" className="w-full py-28 md:py-36 px-4 bg-white border-t border-black/[0.04]">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="text-xs uppercase tracking-widest font-semibold text-burgundy block mb-3">
              Áreas de Domínio
            </span>
            <h2 className="text-[36px] sm:text-[48px] md:text-[56px] font-bold tracking-tight text-chumbo leading-[1.08]">
              Projetado para transformar.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-chumbo-light font-normal">
              Três pilares cirúrgicos executados com planejamento milimétrico e respeito às proporções individuais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            
            {/* Card 1: Contorno Corporal com Micro-Vídeo Apple Style */}
            <div className="group bg-[#f5f5f7] hover:bg-[#efeff2] rounded-[32px] p-8 md:p-10 flex flex-col justify-between transition-all duration-500 border border-black/[0.03]">
              <div>
                {/* Ambient Video Viewport */}
                <div className="w-full aspect-[4/3] rounded-[24px] overflow-hidden mb-8 relative bg-black/5 shadow-inner">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="/videos/contorno-corporal.mp4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
                      Lipo HD & Retração
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-chumbo mb-3">
                  Contorno Corporal
                </h3>
                <p className="text-chumbo-light text-sm leading-relaxed font-normal mb-8">
                  Escultura tridimensional com definição atlética elegante, combinada a tecnologias de plasma para máxima retração de pele.
                </p>
              </div>

              <div className="space-y-2 pt-6 border-t border-black/[0.06] text-xs text-chumbo/80 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy"></span>
                  Lipoaspiração de Alta Definição
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy"></span>
                  Abdominoplastia Funcional & Estética
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy"></span>
                  Tecnologias de Firmeza Dérmica
                </div>
              </div>
            </div>

            {/* Card 2: Cirurgia Facial */}
            <div className="group bg-[#f5f5f7] hover:bg-[#efeff2] rounded-[32px] p-8 md:p-10 flex flex-col justify-between transition-all duration-500 border border-black/[0.03]">
              <div>
                <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-wine bg-white px-3 py-1 rounded-full shadow-xs mb-6">
                  Face & Rejuvenescimento
                </div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-chumbo mb-3">
                  A Maestria Invisível
                </h3>
                <p className="text-chumbo-light text-sm leading-relaxed font-normal mb-8">
                  Procedimentos que descansam e rejuvenescem os traços faciais sem estigmas, preservando a sua identidade única.
                </p>
              </div>

              <div className="space-y-2 pt-6 border-t border-black/[0.06] text-xs text-chumbo/80 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-wine"></span>
                  Deep Plane Facelift & Necklift
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-wine"></span>
                  Rinoplastia Estruturada & Funcional
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-wine"></span>
                  Blefaroplastia de Alta Precisão
                </div>
              </div>
            </div>

            {/* Card 3: Mama */}
            <div className="group bg-[#f5f5f7] hover:bg-[#efeff2] rounded-[32px] p-8 md:p-10 flex flex-col justify-between transition-all duration-500 border border-black/[0.03]">
              <div>
                <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-taupe bg-white px-3 py-1 rounded-full shadow-xs mb-6">
                  Cirurgias de Mama
                </div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-chumbo mb-3">
                  Proporção Perfeita
                </h3>
                <p className="text-chumbo-light text-sm leading-relaxed font-normal mb-8">
                  Equilíbrio entre volume, simetria e sustentação duradoura, alinhado à anatomia e aos objetivos de cada paciente.
                </p>
              </div>

              <div className="space-y-2 pt-6 border-t border-black/[0.06] text-xs text-chumbo/80 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-taupe"></span>
                  Mastopexia com ou sem Prótese
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-taupe"></span>
                  Prótese Mamária com Plano Dual Plane
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-taupe"></span>
                  Mamoplastia Redutora Estética
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. A AUTORIDADE / O CIRURGIÃO (Estilo Apple Pro Performance) */}
      <section id="metodo" className="w-full py-28 md:py-36 px-4 bg-[#fbfbfd]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          
          <div className="w-full md:w-5/12 aspect-[4/5] bg-gradient-to-b from-[#f0edea] to-[#e4ded9] rounded-[36px] overflow-hidden flex flex-col items-center justify-center p-8 text-center border border-black/[0.04] relative shadow-inner">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-md mb-6 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/brand/monogram-wine.svg" 
                alt="Dr. Mário Warde" 
                className="w-14 h-auto object-contain"
              />
            </div>
            <h4 className="text-xl font-bold text-chumbo tracking-tight">Dr. Mário Warde</h4>
            <p className="text-xs text-chumbo-light uppercase tracking-widest mt-1 font-medium">Cirurgião Plástico</p>
            <div className="mt-8 pt-6 border-t border-black/10 w-full flex justify-center gap-6 text-[11px] text-chumbo-light font-medium">
              <span>Membro Titular SBCP</span>
              <span>•</span>
              <span>CRM & RQE Registrados</span>
            </div>
          </div>

          <div className="w-full md:w-7/12 flex flex-col items-start">
            <span className="text-xs uppercase tracking-widest font-semibold text-burgundy mb-3">
              Filosofia Cirúrgica
            </span>
            <h2 className="font-serif italic text-[36px] sm:text-[44px] text-chumbo leading-[1.18] mb-6">
              “A verdadeira excelência cirúrgica não grita. Ela sussurra elegância.”
            </h2>
            <p className="text-base sm:text-lg text-chumbo-light leading-relaxed mb-6 font-normal">
              Sob a condução do Dr. Mário Warde, cada planejamento é tratado como uma obra única. Não trabalhamos com padrões pré-fabricados ou procedimentos em série. 
            </p>
            <p className="text-base sm:text-lg text-chumbo-light leading-relaxed mb-8 font-normal">
              Nossa prática clínica é pautada nos mais rigorosos protocolos de biossegurança internacionais, atuando apenas em hospitais credenciados com suporte total de UTI e equipes anestésicas dedicadas.
            </p>

            <div className="grid grid-cols-2 gap-4 w-full pt-4">
              <div className="p-4 rounded-2xl bg-white border border-black/[0.04]">
                <div className="text-2xl font-bold text-wine tracking-tight">100%</div>
                <div className="text-xs text-chumbo-light mt-1">Ambiente Hospitalar de Ponta</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-black/[0.04]">
                <div className="text-2xl font-bold text-wine tracking-tight">CFM</div>
                <div className="text-xs text-chumbo-light mt-1">Conformidade Ética Absoluta</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SEÇÃO ESCURA IMERSIVA (Blog / Artigos Médicos - Paleta #310f0e) */}
      <section id="blog" className="w-full bg-[#310f0e] py-28 md:py-36 px-4 text-white relative overflow-hidden">
        
        {/* Glow sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-burgundy/30 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#ccb9b6] bg-white/[0.08] px-3.5 py-1.5 rounded-full border border-white/10 mb-6">
            Conhecimento & Medicina
          </div>

          <h2 className="text-[36px] sm:text-[50px] md:text-[60px] font-bold tracking-[-0.03em] leading-[1.08] mb-6">
            Insights do consultório. <br className="hidden sm:block" />
            Perspectivas reais sobre cirurgia plástica.
          </h2>

          <p className="text-base sm:text-xl text-white/70 max-w-2xl mx-auto font-normal leading-relaxed mb-16">
            O Dr. Mário Warde compartilha sua visão técnica, tendências na medicina e esclarece mitos da cirurgia plástica em artigos diretos e embasados.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            <div className="bg-white/[0.05] backdrop-blur-md p-8 rounded-[28px] border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
              <span className="text-xs font-medium text-[#ccb9b6] uppercase tracking-wider mb-3 block">Contorno Corporal</span>
              <h4 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-[#ccb9b6] transition-colors">A verdade sobre a Lipo HD e quem é o paciente ideal</h4>
              <p className="text-sm text-white/60 leading-relaxed font-normal">
                Entenda os limites anatômicos da lipoaspiração de alta definição e por que o resultado perfeito nasce da proporção natural.
              </p>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-md p-8 rounded-[28px] border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
              <span className="text-xs font-medium text-[#ccb9b6] uppercase tracking-wider mb-3 block">Face</span>
              <h4 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-[#ccb9b6] transition-colors">Deep Plane Facelift: A evolução do rejuvenescimento</h4>
              <p className="text-sm text-white/60 leading-relaxed font-normal">
                Como as técnicas modernas de ritidoplastia evitam o aspecto "esticado" reposicionando os tecidos profundos da face.
              </p>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-md p-8 rounded-[28px] border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
              <span className="text-xs font-medium text-[#ccb9b6] uppercase tracking-wider mb-3 block">Mamas</span>
              <h4 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-[#ccb9b6] transition-colors">Mastopexia com alça muscular: Maior sustentação e estabilidade</h4>
              <p className="text-sm text-white/60 leading-relaxed font-normal">
                Descubra como o uso do próprio músculo como "sutiã interno" tem prolongado a longevidade dos resultados nas cirurgias mamárias.
              </p>
            </div>

          </div>

          <div className="mt-16 text-center">
            <button className="bg-white text-[#310f0e] hover:bg-[#ccb9b6] text-sm font-semibold px-8 py-3.5 rounded-full transition-all shadow-sm">
              Ler todos os artigos
            </button>
          </div>

        </div>
      </section>

      {/* 5. FAQ (Estilo Apple Accordion) */}
      <section id="faq" className="w-full py-28 md:py-36 px-4 bg-white border-t border-black/[0.04]">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-burgundy block mb-3">
              Perguntas Frequentes
            </span>
            <h2 className="text-[34px] sm:text-[44px] font-bold tracking-tight text-chumbo">
              Esclarecimentos com transparência.
            </h2>
          </div>

          <div className="divide-y divide-black/[0.06]">
            {faqs.map((item, idx) => (
              <div key={idx} className="py-6">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left flex justify-between items-center gap-4 group"
                >
                  <span className="font-semibold text-base sm:text-lg text-chumbo group-hover:text-wine transition-colors tracking-tight">
                    {item.q}
                  </span>
                  <span className={`text-xl text-chumbo-light transition-transform duration-300 ${openFaq === idx ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === idx && (
                  <p className="mt-4 text-sm sm:text-base text-chumbo-light leading-relaxed font-normal animate-blur-in-up pr-8">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}
