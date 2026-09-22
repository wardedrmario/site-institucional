'use client';
import Link from "next/link";


import { useState } from 'react';
import { LeadForm } from "@/components/ui/LeadForm";
import { AppleProcedures } from "@/components/ui/AppleProcedures";
import { MediaSection } from "@/components/ui/MediaSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const faqs = [
    {
      q: "COMO FUNCIONA A PRIMEIRA CONSULTA?",
      a: "A primeira consulta é um momento essencial para que eu possa entender suas queixas, expectativas e características individuais. Durante esse encontro, realizo uma análise detalhada da face ou do corpo, avaliando aspectos como flacidez, excesso de pele, gordura localizada e estrutura anatômica para indicar o procedimento mais adequado, como lipoaspiração, Lipo HD, abdominoplastia ou Deep Plane Facelift. Além disso, é nessa etapa que você poderá tirar todas as suas dúvidas com total transparência. Construo o plano cirúrgico de forma personalizada, com foco em segurança, naturalidade e resultado estético de alto padrão, sempre respeitando seus limites e objetivos."
    },
    {
      q: "QUAIS PROCEDIMENTOS PODEM SER REALIZADOS?",
      a: "Atuo com foco em cirurgia plástica facial e corporal, realizando procedimentos como lipoaspiração, Lipo HD, abdominoplastia, mastopexia, mamoplastia de aumento e cirurgias combinadas, além de técnicas avançadas de rejuvenescimento facial como o Deep Plane Facelift. Indico cada procedimento de forma criteriosa, considerando suas necessidades e objetivos. Meu foco está sempre em proporcionar resultados naturais, melhorar o contorno corporal, reduzir flacidez e promover rejuvenescimento facial com harmonia e sofisticação."
    },
    {
      q: "COMO É O SUPORTE PÓS-OPERATÓRIO?",
      a: "O acompanhamento pós-operatório é conduzido de forma próxima e individualizada por mim, com orientações claras em cada fase da recuperação. Desde os primeiros dias, você receberá suporte contínuo para amenizar sintomas pós-cirúrgicos comuns, como inchaço e sensibilidade, além de favorecer a cicatrização e auxiliar na adaptação ao novo contorno corporal ou facial. Meu objetivo é proporcionar uma recuperação segura, confortável e com máxima qualidade no resultado final."
    },
    {
      q: "QUAIS TECNOLOGIAS ESTÃO DISPONÍVEIS PARA A CIRURGIA?",
      a: "Utilizo tecnologias modernas que potencializam os resultados e elevam o padrão dos procedimentos. Entre elas estão o Vaser, que auxilia na emulsificação da gordura para maior precisão, o Renuvion e o Argoplasma, que promovem retração da pele, além do Ignite, que atua na melhora da firmeza e definição dos tecidos. Associo essas tecnologias conforme a necessidade de cada caso, contribuindo para melhorar a qualidade da pele, tratar flacidez e refinar o contorno corporal. O uso é sempre feito com critério, visando segurança e resultados mais sofisticados."
    },
    {
      q: "É POSSÍVEL COMBINAR MAIS DE UM PROCEDIMENTO NA MESMA CIRURGIA?",
      a: "Sim, em muitos casos é possível realizar cirurgias combinadas, como associar lipoaspiração com abdominoplastia, mastopexia com prótese ou até protocolos como Mommy Makeover. Essa estratégia permite tratar diferentes áreas do corpo em uma única abordagem, otimizando tempo e potencializando os resultados.\n\nTomo essa decisão sempre com base em uma avaliação criteriosa, considerando fatores como sua saúde, tempo cirúrgico e, principalmente, a segurança. O planejamento é totalmente personalizado para garantir equilíbrio, harmonia e uma recuperação adequada."
    }
  ];

  return (
    <main className="flex-1 flex flex-col items-center w-full bg-bg-primary">
      
      {/* 1. HERO SECTION (Estilo Apple Keynote / Clean Store) */}
      <section className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col justify-start items-start pt-32 md:pt-48 pb-16 md:pb-24 text-left overflow-hidden">

        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        >
          <source src="/videos/hook.mp4" type="video/mp4" />
        </video>

        {/* Overlay escuro ao invés de claro para garantir legibilidade do texto branco */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-start h-full">
          
          {/* Layout: Textos e Botão Empilhados */}
          <div className="flex flex-col items-start gap-10 w-full">
            
            {/* Esquerda: Textos (Estilo MacBook Pro) */}
            <div className="flex flex-col items-start animate-blur-in-up">
              <span className="text-white/90 font-semibold text-lg md:text-xl tracking-tight mb-1 md:mb-2 drop-shadow-md">
                Dr. Mário Warde
              </span>
              <h1 className="text-[44px] sm:text-[56px] md:text-[64px] lg:text-[72px] font-bold tracking-[-0.035em] text-white leading-[1.04] drop-shadow-lg">
                Cirurgião Plástico.
              </h1>
              <p className="mt-2 md:mt-3 text-base md:text-lg text-white/80 font-medium tracking-tight drop-shadow max-w-2xl">
                A arte da cirurgia plástica elevada à sua forma mais pura. Redesenho contornos com maestria técnica e um olhar clínico refinado, revelando a sua melhor versão sem perder a própria essência.
              </p>
            </div>

            {/* Direita: Botão (Estilo Apple Pill) */}
            {!showLeadForm && (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 backdrop-blur-md rounded-3xl sm:rounded-full p-2 sm:pl-6 border border-white/10 shadow-2xl animate-blur-in-up [animation-delay:200ms]">
                <span className="text-white/80 text-xs sm:text-sm font-medium hidden sm:block">
                  Atendimento em São Paulo
                </span>
                <button 
                  onClick={() => setShowLeadForm(true)}
                  className="bg-[#ccb9b6] hover:bg-[#b8a6a3] text-[#310f0e] text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer"
                >
                  Quero planejar
                </button>
              </div>
            )}
          </div>

          {/* Form Integrado / Configurator */}
          {showLeadForm && (
            <div id="triagem" className="w-full max-w-3xl mt-12 scroll-mt-24 animate-blur-in-up">
              <LeadForm onClose={() => setShowLeadForm(false)} />
            </div>
          )}

        </div>
      </section>



      {/* 2. PROCEDIMENTOS APPLE STYLE */}
      <AppleProcedures />

      {/* 3. SEÇÃO AUTORIDADE (Clean, Tipografia Forte) */}
      <section id="metodo" className="w-full bg-bg-primary py-32 md:py-48 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
          
          <ScrollReveal delay={100} className="w-full md:w-5/12"><div className="w-full bg-bg-secondary rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-subtle flex flex-col group">
            <div className="w-full aspect-[4/5] relative overflow-hidden bg-bg-primary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/dr-mario/about.jpg" 
                alt="Dr. Mário Warde - Cirurgião Plástico" 
                className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="p-8 md:p-10 flex flex-col items-center text-center">
              <h4 className="text-xl font-bold text-text-primary tracking-tight">Dr. Mário Warde</h4>
              <p className="text-xs text-text-secondary uppercase tracking-widest mt-1 font-medium">Cirurgião Plástico</p>
              <div className="mt-8 pt-6 border-t border-black/10 w-full flex justify-center gap-6 text-[11px] text-text-secondary font-medium">
                <span>CREMESP 81.741</span>
                <span>•</span>
                <span>RQE 18.343</span>
              </div>
            </div>
          </div></ScrollReveal>

          <ScrollReveal delay={300} className="w-full md:w-7/12"><div className="w-full flex flex-col items-start">
            <span className="text-xs uppercase tracking-widest font-semibold text-burgundy mb-3">
              Sobre mim
            </span>
            <h2 className="font-serif italic text-[36px] sm:text-[44px] text-balance text-text-primary leading-[1.18] mb-6">
              “A verdadeira excelência cirúrgica não grita. Ela sussurra elegância.”
            </h2>
            <p className="text-base sm:text-lg text-text-secondary leading-[1.8] mb-8 font-light">
              Formado em Medicina pela USP, construí uma trajetória sólida, complementada por Mestrado pela UNIFESP e Doutorado pela USP, consolidando uma base técnica de excelência ao longo de décadas.
            </p>
            <p className="text-base sm:text-lg text-text-secondary leading-[1.8] mb-8 font-light">
              Ao longo da minha carreira, destaquei-me como coordenador da cirurgia plástica no tratamento de lipodistrofia em pacientes com HIV no Hospital Emílio Ribas, onde desenvolvi alta expertise em enxertia de gordura — hoje um dos meus principais diferenciais na busca por resultados naturais e sofisticados.
            </p>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-8 font-normal">
              Minha formação em Direito agrega um nível ainda mais elevado à minha prática médica, com foco em segurança do paciente, responsabilidade e decisões altamente criteriosas, refletindo diretamente na confiança e na qualidade dos resultados que entrego.
            </p>

            <div className="grid grid-cols-2 gap-4 w-full pt-4">
              <div className="p-4 rounded-2xl bg-bg-secondary border border-border-subtle">
                <div className="text-2xl font-bold text-text-accent tracking-tight">USP & UNIFESP</div>
                <div className="text-xs text-text-secondary mt-1">Formação de Excelência</div>
              </div>
              <div className="p-4 rounded-2xl bg-bg-secondary border border-border-subtle">
                <div className="text-2xl font-bold text-text-accent tracking-tight">Direito</div>
                <div className="text-xs text-text-secondary mt-1">Foco na Segurança do Paciente</div>
              </div>
            </div>
          </div></ScrollReveal>

        </div>
      </section>

      {/* 4. SEÇÃO ESCURA IMERSIVA (Blog / Artigos Médicos - Paleta #310f0e) */}
      <section id="blog" className="w-full bg-[#310f0e] py-32 md:py-48 px-4 text-white relative overflow-hidden">
        
        {/* Glow sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-burgundy/30 blur-[120px] pointer-events-none" />

        <ScrollReveal delay={200}><div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#ccb9b6] bg-white/[0.08] px-3.5 py-1.5 rounded-full border border-white/10 mb-6">
            Conhecimento & Medicina
          </div>

          <h2 className="text-[36px] sm:text-[50px] md:text-[60px] text-balance font-bold tracking-[-0.03em] leading-[1.08] mb-6">
            Insights do consultório. <br className="hidden sm:block" />
            Perspectivas reais sobre cirurgia plástica.
          </h2>

          <p className="text-base sm:text-xl text-white/70 max-w-2xl mx-auto font-normal leading-relaxed mb-16">
            Compartilho minha visão técnica, tendências na medicina e esclareço mitos da cirurgia plástica em artigos diretos e embasados.
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
                Como as técnicas modernas de ritidoplastia evitam o aspecto &quot;esticado&quot; reposicionando os tecidos profundos da face.
              </p>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-md p-8 rounded-[28px] border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
              <span className="text-xs font-medium text-[#ccb9b6] uppercase tracking-wider mb-3 block">Mamas</span>
              <h4 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-[#ccb9b6] transition-colors">Mastopexia com alça muscular: Maior sustentação e estabilidade</h4>
              <p className="text-sm text-white/60 leading-relaxed font-normal">
                Descubra como o uso do próprio músculo como &quot;sutiã interno&quot; tem prolongado a longevidade dos resultados nas cirurgias mamárias.
              </p>
            </div>

          </div>

          <div className="mt-16 text-center">
            <Link href="/blog" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-[#310f0e] hover:bg-[#ccb9b6] text-sm font-semibold px-8 py-3.5 rounded-full transition-all shadow-sm">
              Ler todos os artigos
            </Link>
          </div>

        </div></ScrollReveal>
      </section>

      {/* 4.5. NA MÍDIA & CONTORNO */}
      <MediaSection />

      {/* 5. FAQ (Estilo Apple Accordion) */}
      <section id="faq" className="w-full py-32 md:py-48 px-4 bg-[#310f0e] text-white">
        <ScrollReveal delay={100}><div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#ccb9b6] block mb-3">
              Perguntas Frequentes
            </span>
            <h2 className="text-[34px] sm:text-[44px] font-bold tracking-tight text-white">
              Esclarecimentos com transparência.
            </h2>
          </div>

          <div className="divide-y divide-white/10">
            {faqs.map((item, idx) => (
              <div key={item.q} className="py-6">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left flex justify-between items-center gap-4 group"
                >
                  <span className="font-semibold text-base sm:text-lg text-white group-hover:text-[#ccb9b6] transition-colors tracking-tight uppercase">
                    {item.q}
                  </span>
                  <span className={`text-xl text-white/50 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
                {openFaq === idx && (
                  <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed font-normal animate-blur-in-up pr-8 whitespace-pre-wrap">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div></ScrollReveal>
      </section>

    </main>
  );
}
