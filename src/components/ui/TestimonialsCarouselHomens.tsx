'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const defaultTestimonials = [
  { 
    name: "João Pedro Warde", 
    subtitle: "2 avaliações",
    date: "um ano atrás",
    avatar: "https://ui-avatars.com/api/?name=Joao+Pedro&background=c2185b&color=fff&size=150",
    text: "\"Impecável! Desde o atendimento da equipe até o acompanhamento pós cirúrgico. Atenção aos detalhes e responde as dúvidas antes e depois de operar. Os Resultados foram melhores que os esperados nas conversas pré e a recuperação foi super tranquila! Podem agendar sem medo pois é um profissional ímpar.\"" 
  },
  { 
    name: "robson carrasco", 
    subtitle: "7 avaliações",
    date: "um ano atrás",
    avatar: "https://ui-avatars.com/api/?name=robson+carrasco&background=8d6e63&color=fff&size=150",
    text: "\"Tive a honra de fazer uma lipo com o Dr Mário em 2014. Hoje, eu com 52 anos, ainda vejo nitidamente o resultado da cirurgia, fazendo com que eu me sinta melhor fisicamente e psicologicamente.\n\nDr Mário não é apenas um excelente cirurgião plástico, além de, um baita de um homem HUMANISTA.\n\n<3 gratidão SEMPRE\"" 
  },
  { 
    name: "Rafael Bonucci", 
    subtitle: "16 avaliações",
    date: "um ano atrás",
    avatar: "https://ui-avatars.com/api/?name=Rafael+Bonucci&background=212121&color=fff&size=150",
    text: "\"Um excelente médico! Muito profissional e atencioso. Adorei ser atendido pelo Dr. Mário, me tranquilizou durante toda a consulta. Super recomendo.\"" 
  },
  { 
    name: "PAULO RICARDO BARRETO FERREIRA", 
    subtitle: "1 avaliação",
    date: "um ano atrás",
    avatar: "https://ui-avatars.com/api/?name=PAULO+RICARDO&background=512da8&color=fff&size=150",
    text: "\"Excelente profissional. Avaliação minuciosa do paciente, com a solicitação de vários exames antes de estabelecer o protocolo de tratamento, realizado de forma precisa e eficiente. Recomendo muito !!\"" 
  },
  { 
    name: "Marcelo paiao", 
    subtitle: "6 avaliações",
    date: "um ano atrás",
    avatar: "https://ui-avatars.com/api/?name=Marcelo+paiao&background=f57c00&color=fff&size=150",
    text: "\"Um profissional de altíssima qualidade. Atencioso. Responsável. Ajuda o paciente a decidir pelo melhor e adequado procedimento. Excelente, recomendo demais.\"" 
  }
];

export function TestimonialsCarouselHomens({ testimonials = defaultTestimonials }: { testimonials?: typeof defaultTestimonials }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  
  // Dragging state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const toggleExpand = (idx: number) => {
    setExpandedCards(prev => ({...prev, [idx]: !prev[idx]}));
  };

  const scrollTo = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cards = container.querySelectorAll('.testimonial-card');
    if (!cards[index]) return;
    const card = cards[index] as HTMLElement;
    const scrollPosition = card.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2);
    container.style.scrollSnapType = 'none';
    container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    setTimeout(() => {
      if (container) container.style.scrollSnapType = 'x mandatory';
    }, 600);
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        let maxIntersection = 0;
        let mostVisibleIndex = -1;
        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxIntersection) {
            maxIntersection = entry.intersectionRatio;
            mostVisibleIndex = Number(entry.target.getAttribute('data-index'));
          }
        });
        if (maxIntersection > 0.5 && mostVisibleIndex !== -1) {
          setActiveIndex((prev) => prev !== mostVisibleIndex ? mostVisibleIndex : prev);
        }
      },
      { root: container, threshold: [0.4, 0.5, 0.6, 0.9] }
    );
    const items = container.querySelectorAll('.testimonial-card');
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % testimonials.length;
        scrollTo(nextIndex);
        return nextIndex;
      });
    }, 5500); 
    return () => clearInterval(timer);
  }, [isPlaying, scrollTo, testimonials.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    setIsPlaying(false);
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.scrollSnapType = 'none';
    scrollRef.current.style.scrollBehavior = 'auto';
  };

  const handleMouseLeave = () => {
    if (!isDragging.current || !scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.scrollSnapType = 'x mandatory';
    scrollRef.current.style.scrollBehavior = 'smooth';
    scrollTo(activeIndex);
  };

  const handleMouseUp = () => {
    if (!isDragging.current || !scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.scrollSnapType = 'x mandatory';
    scrollRef.current.style.scrollBehavior = 'smooth';
    scrollTo(activeIndex);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section className="w-full bg-[#f0eae9] py-24 md:py-32 overflow-hidden flex flex-col relative border-t border-black/5">
      
      <div className="text-center mb-16 px-6">
        <span className="text-[#86868b] font-medium text-xs uppercase tracking-[0.2em] mb-4 block">
          Avaliações Reais
        </span>
        <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tighter">
          O que dizem nossos pacientes
        </h2>
      </div>

      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex items-stretch overflow-x-auto snap-x snap-mandatory gap-6 px-6 md:px-[30vw] pb-12 pt-4 no-scrollbar cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {testimonials.map((item, idx) => {
          const isExpanded = expandedCards[idx];
          return (
            <div 
              key={idx}
              data-index={idx}
              className="testimonial-card flex-none w-[340px] md:w-[420px] h-auto snap-center bg-white border border-[#e0e0e0] rounded-xl p-5 md:p-6 flex flex-col shadow-sm transition-all duration-300 select-none"
            >
              {/* HEADER (Google Maps Style) */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover pointer-events-none" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-[#202124] font-medium text-[15px] leading-tight">{item.name}</h4>
                    <p className="text-[#70757a] text-[13px] leading-tight mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                {/* 3 dots */}
                <button className="text-[#70757a] hover:bg-gray-100 rounded-full p-2 -mr-2 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              </div>

              {/* STARS AND DATE */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-[15px] h-[15px] text-[#f4b400]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[#70757a] text-[13px]">{item.date}</span>
              </div>

              {/* TEXT */}
              <div className="mb-4">
                <p 
                  className={`text-[#202124] text-[15px] leading-[1.4] whitespace-pre-line ${!isExpanded ? 'line-clamp-4' : ''}`}
                >
                  {item.text}
                </p>
                {!isExpanded && item.text.length > 150 && (
                  <button 
                    onClick={() => toggleExpand(idx)}
                    className="text-[#1a73e8] font-medium text-[15px] mt-1 hover:underline"
                  >
                    Mais
                  </button>
                )}
              </div>

              {/* FOOTER BUTTONS */}
              <div className="flex items-center gap-6 pt-1 mt-auto">
                <button className="flex items-center gap-2 text-[#3c4043] font-medium text-[14px] hover:bg-gray-50 px-2 py-1.5 -ml-2 rounded-md transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  Gostei
                </button>
                <button className="flex items-center gap-2 text-[#3c4043] font-medium text-[14px] hover:bg-gray-50 px-2 py-1.5 rounded-md transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Compartilhar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-2 bg-[#1d1d1f]/5 backdrop-blur-md px-4 py-3 rounded-full border border-black/5">
          {testimonials.map((_, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setIsPlaying(false);
                  scrollTo(idx);
                }}
                className={`h-2 rounded-full transition-all duration-500 ease-out relative overflow-hidden ${
                  isActive ? 'w-10 bg-[#1d1d1f]/30' : 'w-2 bg-[#1d1d1f]/15 hover:bg-[#1d1d1f]/30'
                }`}
              >
                {isActive && (
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#1d1d1f]/70 animate-fill-dark"
                    style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-11 h-11 rounded-full bg-[#1d1d1f]/5 border border-black/5 backdrop-blur-md hover:bg-[#1d1d1f]/10 flex items-center justify-center transition-colors text-[#1d1d1f] flex-shrink-0"
        >
          {isPlaying ? (
            <svg width="12" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="2" y="1" width="3" height="12" rx="1" />
              <rect x="9" y="1" width="3" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="14" viewBox="0 0 14 14" fill="currentColor" className="ml-1">
              <path d="M3 1.5L12 7L3 12.5V1.5Z" />
            </svg>
          )}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fillProgressDark { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-fill-dark { animation: fillProgressDark 5.5s linear forwards; }
      `}} />
    </section>
  );
}
