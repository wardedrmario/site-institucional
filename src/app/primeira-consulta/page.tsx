'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LeadForm } from "@/components/ui/LeadForm";
import { TestimonialsCarousel } from "@/components/ui/TestimonialsCarousel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";

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
      <ScrollProgressBar />
      <Suspense fallback={null}>
        <UTMTracker />
      </Suspense>

      {/* 1. HERO SECTION (Full-Bleed Bright Aesthetic) */}
      <section className="relative w-full h-[90vh] min-h-[650px] md:min-h-[800px] flex items-center overflow-hidden bg-white">
        
        {/* Imagem de Fundo Full-Bleed */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img 
            src="/images/lifestyle/hero5.jpg" 
            alt="Beleza Natural" 
            className="w-full h-full object-cover object-[20%_center] md:object-[20%_center]"
          />
          {/* Removidos os degradês complexos. A imagem fica limpa no fundo. */}
          {/* Gradiente de baixo sutil para a transição */}
          <div 
            className="absolute inset-0 opacity-40 pointer-events-none" 
            style={{ backgroundImage: 'linear-gradient(to top, white 0%, transparent 20%)' }}
          />
        </div>
        
        {/* Conteúdo sobreposto alinhado à direita, agora encapsulado num Card de Vidro */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 mt-16 md:mt-0 flex justify-end">
          
          <div className="max-w-2xl animate-blur-in-up bg-white/30 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] ring-1 ring-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-8 bg-[#ccb9b6]" />
              <span className="text-[#86868b] font-medium text-xs md:text-sm uppercase tracking-[0.25em]">
                Alta Cirurgia Plástica
              </span>
            </div>

            <h1 className="text-[40px] sm:text-[50px] md:text-[64px] font-semibold tracking-tighter text-[#1d1d1f] leading-[1.05] mb-6">
              Sinta-se segura <br />
              <span className="italic font-light">na própria pele.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#1d1d1f]/75 font-normal leading-relaxed max-w-lg mb-10">
              O domínio pleno da Alta Cirurgia Plástica. Há mais de 30 anos aliando rigor técnico, segurança absoluta e contornos naturais para revelar a sua melhor versão.
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

      {/* 2. AUTORIDADE ABSOLUTA (Contrast Layout with Brand Color) */}
      <section 
        className="w-full py-24 md:py-32 px-6 relative overflow-hidden"
        style={{ backgroundImage: "url('/images/bg-charcoal-texture.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#1d1d1f]/40 mix-blend-multiply pointer-events-none"></div>

        <div className="max-w-[1080px] mx-auto relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            
            {/* Foto Dr. Mário - Agora com fundo claro ao redor e respiro */}
            <div className="md:col-span-5 relative">
              <ScrollReveal variant="scale-up" duration={1000}>
                <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgb(0,0,0,0.3)] relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/images/dr-mario/0J4A2251-wine.jpg" 
                    alt="Dr. Mário Warde" 
                    className="w-full h-full object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                </div>
              </ScrollReveal>
              
              {/* Crachá flutuante */}
              <ScrollReveal variant="fade-up" delay={250} duration={800} className="absolute -bottom-6 -right-6 md:-right-10 z-20">
                <div className="bg-[#2d2d2f] p-5 rounded-2xl shadow-xl ring-1 ring-white/10">
                  <p className="text-white font-semibold text-lg tracking-tight">Dr. Mário Warde</p>
                  <p className="text-[#86868b] text-[11px] font-medium uppercase tracking-[0.15em] mt-1">CRM 81.741 • RQE 18.343</p>
                </div>
              </ScrollReveal>
            </div>

            {/* Texto Manifesto */}
            <div className="md:col-span-7 flex flex-col justify-center mt-10 md:mt-0">
              <ScrollReveal variant="fade-up" delay={150}>
                <h2 className="text-3xl md:text-5xl font-semibold text-white mb-8 tracking-tighter leading-[1.1]">
                  Maestria forjada na alta complexidade. <br/>
                  <span className="text-[#86868b] italic font-light">Refinada para a estética.</span>
                </h2>
              </ScrollReveal>
              
              <div className="space-y-6 text-white/80 text-[17px] leading-[1.7] font-normal">
                <ScrollReveal variant="fade-up" delay={250}>
                  <p>
                    Minha assinatura cirúrgica carrega quase três décadas de rigor acadêmico e prático. Como médico formado pela <strong className="font-semibold text-white">Universidade de São Paulo (USP)</strong> e especialista pelo Hospital das Clínicas (1994), construí minha base onde a medicina é mais desafiadora: a reconstrução profunda.
                  </p>
                </ScrollReveal>
                <ScrollReveal variant="fade-up" delay={350}>
                  <p>
                    A experiência à frente de setores cirúrgicos complexos consolidou minha filosofia de trabalho. Hoje, transfiro toda a precisão e o rigor exigidos em cirurgias de reconstrução para o refinamento estético, proporcionando às minhas pacientes um nível de segurança e naturalidade que apenas a verdadeira experiência pode oferecer.
                  </p>
                </ScrollReveal>
                
                {/* Quote Box Clean */}
                <ScrollReveal variant="fade-up" delay={450}>
                  <div className="mt-10 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                    <p className="text-white/90 font-medium text-lg md:text-xl leading-relaxed tracking-tight italic">
                      &quot;Meu consultório é o destino de quem não negocia a própria segurança. Entregamos uma experiência médica pautada na excelência técnica, na previsibilidade e no respeito absoluto à anatomia de cada paciente.&quot;
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PROCEDIMENTOS ASSINATURA (Clean Grid) */}
      <div className="w-full py-24 md:py-32 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-6 relative">
          
          <ScrollReveal variant="fade-up" duration={800}>
            <div className="relative text-center mb-16 md:mb-24 flex flex-col items-center justify-center min-h-[250px]">
              {/* SVG Background - Absolute and centered behind the text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <img 
                  src="/images/mw-background.svg" 
                  alt="MW Logo" 
                  className="w-[800px] max-w-full object-contain"
                />
              </div>
              
              {/* Text Content - Relative to sit on top of SVG */}
              <div className="relative z-10">
                <span className="text-[#86868b] font-medium text-xs uppercase tracking-[0.2em] mb-4 block">
                  Protocolos Cirúrgicos
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1d1d1f] tracking-tighter">
                  Procedimentos com assinatura
                </h2>
              </div>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            
            {/* Facial */}
            <ScrollReveal variant="fade-up" delay={0} duration={850}>
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
            </ScrollReveal>

            {/* Mamas */}
            <ScrollReveal variant="fade-up" delay={160} duration={850}>
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
            </ScrollReveal>

            {/* Contorno Corporal */}
            <ScrollReveal variant="fade-up" delay={320} duration={850}>
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
            </ScrollReveal>

          </div>
        </div>
      </div>

      {/* 3.5. DEPOIMENTOS (SOCIAL PROOF) */}
      <TestimonialsCarousel />

      


      {/* 6. FINAL CTA (Soft & Elegant) */}
      <section 
        className="w-full py-24 md:py-32 px-6 text-center relative overflow-hidden"
        style={{ backgroundImage: "url('/images/bg-wine-texture.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#310f0e]/20 mix-blend-multiply pointer-events-none"></div>

        <div className="max-w-2xl mx-auto flex flex-col items-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tighter leading-tight">
            Pronta para dar <br/> o primeiro passo?
          </h2>
          <p className="text-white/80 text-[18px] mb-12 leading-relaxed">
            Nossa equipe de atendimento está preparada para entender suas expectativas e desenhar a jornada da sua primeira consulta.
          </p>
          
          <button 
            onClick={() => {
              setShowLeadForm(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-white px-10 py-5 text-[16px] font-semibold text-[#310f0e] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(255,255,255,0.15)] active:scale-[0.98]"
          >
            Falar com Atendimento
          </button>
        </div>
      </section>

      {/* 4. INFORMAÇÕES PRÁTICAS & LOGÍSTICA */}
      <section className="w-full bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tighter mb-4">
              Planejamento e Logística
            </h2>
            <p className="text-[#1d1d1f]/60 text-lg max-w-2xl mx-auto">
              Tudo estruturado para oferecer uma jornada fluida, segura e extremamente confortável, desde o agendamento até a alta médica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Endereço */}
            <div className="bg-[#f5f5f7] p-10 rounded-3xl flex flex-col items-start transition-all hover:bg-[#f0f0f2]">
              <div className="w-12 h-12 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center mb-6 shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-[#310f0e] hover:shadow-[0_12px_24px_rgba(49,15,14,0.2)] hover:-translate-y-1 cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-3">Localização Privilegiada</h3>
              <address className="text-[#1d1d1f]/90 not-italic font-medium mb-4 text-sm">
                R. Jericó, 255 - Cj 81<br/>
                Sumarezinho, São Paulo - SP<br/>
                CEP: 05435-040
              </address>
              <div className="w-full h-32 rounded-xl overflow-hidden mb-4 opacity-90 hover:opacity-100 transition-opacity">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.4093950664916!2d-46.69238882467026!3d-23.551416461246187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5795891fcbb5%3A0x7b34292d6f56491!2sDr.%20Mario%20Warde%20%7C%20Cirurgia%20Pl%C3%A1stica%20-%20Vila%20Madalena%2C%20S%C3%A3o%20Paulo!5e0!3m2!1spt-BR!2sbr!4v1714589973215!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <ul className="text-sm text-[#1d1d1f]/60 space-y-2 mt-auto">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#310f0e]"></div> Estacionamento com Valet
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#310f0e]"></div> Próximo ao Metrô V. Madalena
                </li>
              </ul>
            </div>

            {/* Formatos de Atendimento */}
            <div className="bg-[#f5f5f7] p-10 rounded-3xl flex flex-col items-start transition-all hover:bg-[#f0f0f2]">
              <div className="w-12 h-12 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center mb-6 shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-[#310f0e] hover:shadow-[0_12px_24px_rgba(49,15,14,0.2)] hover:-translate-y-1 cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.6 11.6L22 7v10l-6.4-4.5v-1zM4 5h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-3">Formatos de Atendimento</h3>
              <p className="text-[#1d1d1f]/70 leading-relaxed mb-4">
                Atendemos pacientes de todo o Brasil e do exterior com protocolos de triagem rigorosos.
              </p>
              <ul className="text-sm text-[#1d1d1f]/80 space-y-4 mt-auto">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#310f0e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><strong>Presencial:</strong> Avaliação clínica completa e planejamento minucioso.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#310f0e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><strong>Telemedicina:</strong> Triagem e alinhamento prévio para pacientes de fora de São Paulo.</span>
                </li>
              </ul>
            </div>

            {/* Pagamentos */}
            <div className="bg-[#f5f5f7] p-10 rounded-3xl flex flex-col items-start transition-all hover:bg-[#f0f0f2]">
              <div className="w-12 h-12 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center mb-6 shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-[#310f0e] hover:shadow-[0_12px_24px_rgba(49,15,14,0.2)] hover:-translate-y-1 cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-3">Honorários & Reembolsos</h3>
              <p className="text-[#1d1d1f]/70 leading-relaxed mb-4">
                Nossos procedimentos são realizados no modelo particular, garantindo a excelência do começo ao fim.
              </p>
              <ul className="text-sm text-[#1d1d1f]/80 space-y-4 mt-auto">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#310f0e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><strong>Planos de Saúde:</strong> Auxiliamos em todo o processo de documentação para solicitação de <strong>reembolso</strong> perante a sua operadora.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="relative w-full bg-[#310f0e] py-24 px-6 border-t border-gray-200 overflow-hidden">
        
        <div className="relative max-w-3xl mx-auto z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#f5f5f7] tracking-tighter mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { q: "O consultório atende emergências?", a: "Nossos atendimentos são integralmente dedicados a cirurgias eletivas agendadas. Em caso de urgências, recomendamos buscar um pronto-socorro imediatamente." },
              { q: "Como funciona o reembolso pelo plano de saúde?", a: "Se o seu convênio tiver cobertura de reembolso (Livre Escolha), nós fornecemos todos os laudos, relatórios e notas fiscais exigidas para que você possa dar entrada na operadora de saúde." },
              { q: "Pacientes de fora de São Paulo podem realizar a cirurgia?", a: "Sim. Grande parte das nossas pacientes são de outras cidades ou do exterior. O processo começa com uma consulta por telemedicina para alinhamento inicial e indicação. Posteriormente, desenhamos o cronograma logístico para que você venha a SP apenas no período cirúrgico." },
              { q: "Qual é o hospital onde as cirurgias são realizadas?", a: "Operamos exclusivamente em hospitais de altíssimo padrão em São Paulo, equipados com UTI e que seguem protocolos mundiais de segurança (como o Hospital Sírio-Libanês, Vila Nova Star, entre outros, dependendo do procedimento)." }
            ].map((faq, i) => (
              <details key={i} className="group cursor-pointer border-b border-white/10 pb-6 transition-colors last:border-b-0">
                <summary className="text-[15px] md:text-[16px] font-semibold text-[#f5f5f7] uppercase tracking-wide list-none [&::-webkit-details-marker]:hidden flex items-center justify-between">
                  <span className="pr-6">{faq.q}</span>
                  <svg className="w-5 h-5 text-white/40 shrink-0 transform transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </summary>
                <div className="mt-5 pr-8 md:pr-12">
                  <p className="text-white/60 text-[15px] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. RODAPÉ INSTITUCIONAL */}
      <footer className="w-full bg-[#1d1d1f] py-12 px-6 text-center text-white/50 text-xs">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <p className="text-white/80 font-medium text-[13px] uppercase tracking-wider">
            Dr. Mário Jorge Warde Filho
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/60">
            <span>Cirurgião Plástico</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>CRM/SP: 81.741</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>RQE: 18.599</span>
          </div>
          <p className="max-w-xl leading-relaxed mt-4">
            A cirurgia plástica é uma ciência médica e seus resultados variam de acordo com o organismo de cada paciente. As informações desta página têm caráter exclusivamente educativo. Consulta presencial ou telemedicina (em conformidade com o CFM) é indispensável.
          </p>
          <div className="w-full h-px bg-white/10 my-4"></div>
          <p>&copy; {new Date().getFullYear()} Clínica Dr. Mário Warde. Todos os direitos reservados.</p>
          <div className="w-full h-px bg-white/10 my-6"></div>
          
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 text-[12px] text-white/50">
            <div className="flex items-center gap-6">
              <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacidade de Dados</a>
              <a href="/termos" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Termos Médicos</a>
            </div>
            
            <div className="hidden md:block w-px h-4 bg-white/20"></div>

            <div className="flex items-center gap-3">
              <span>Desenvolvido por</span>
              <a href="https://unioo.com.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                <img src="/images/logo-unioo.svg" alt="Unio" className="h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="font-medium tracking-[0.15em] opacity-70 group-hover:opacity-100 transition-opacity mt-0.5">COMUNICAÇÃO E MARKETING</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
