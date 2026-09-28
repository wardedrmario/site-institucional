'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const defaultTestimonials = [
  { 
    name: "Michaela E.", 
    date: "5 meses atrás",
    avatar: "https://ui-avatars.com/api/?name=Michaela+E&background=8d6e63&color=fff&size=150",
    text: "Dr Mario é absolutamente THE BEST! Conheço e confio há mais 25 anos. Sua dedicação, seu conhecimento, sua paciência, o carinho e atenção a todos os mínimos detalhes, são excepcionais! Ele trata seus pacientes como se fossem os únicos, passando-lhes uma tranquilidade indescritível e sempre dá tudo mais do que certo! Gratidão e indicações, sempre!! :)" 
  },
  { 
    name: "Camila Montandon", 
    date: "um ano atrás",
    avatar: "https://ui-avatars.com/api/?name=Camila+Montandon&background=e65100&color=fff&size=150",
    text: "Fiz um procedimento facial e fiquei muito satisfeita! Sou uma paciente com muitos medos e ele foi extremamente cuidadoso! Meu limiar de dor é baixíssimo e senti em suas mãos leveza e segurança de quem sabe muito bem o que está fazendo! Olhar minucioso, atendimento perfeito, mãos talentosas!" 
  },
  { 
    name: "Marcelo Weber", 
    date: "um ano atrás",
    avatar: "https://ui-avatars.com/api/?name=Marcelo+Weber&background=0288d1&color=fff&size=150",
    text: "Dr. Mário é um profissional fantástico em todos dos sentidos. Como médico, domínio pleno da Cirurgia Plástica, procedimentos e resultados. Como indivíduo, sempre pronto para explicar tudo nos mínimos detalhes. Dando segurança e tranquilidade ao paciente. Muito obrigado por tudo Meu Amigo🙌" 
  },
  { 
    name: "Bete Villalobos", 
    date: "um ano atrás",
    avatar: "https://ui-avatars.com/api/?name=Bete+Villalobos&background=bf360c&color=fff&size=150",
    text: "O Dr Mario transmite segurança e habilidade ao conhecê-lo e ao vc ser paciente dele, terá apoio e resultados maravilhosos! Um médico completo, responsável, eficiente e carinhoso! Adoro e indico muito!" 
  },
  { 
    name: "João Pedro Warde", 
    date: "um ano atrás",
    avatar: "https://ui-avatars.com/api/?name=Joao+Pedro+Warde&background=c2185b&color=fff&size=150",
    text: "Impecável! Desde o atendimento da equipe até o acompanhamento pós cirúrgico. Atenção aos detalhes e responde as dúvidas antes e depois de operar. Os Resultados foram melhores que os esperados nas conversas pré e a recuperação foi super tranquila! Podem agendar sem medo pois é um profissional ímpar." 
  },
  { 
    name: "João Abrahão", 
    date: "um ano atrás",
    avatar: "https://i.pravatar.cc/150?u=joao_abrahao",
    text: "Profissional fantástico! Mais que excelência técnica, o cuidado com as pessoas que faz toda a diferença!" 
  },
];

export function TestimonialsCarousel({ testimonials = defaultTestimonials }: { testimonials?: typeof defaultTestimonials }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Dragging state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Safe scroll logic
  const scrollTo = useCallback((index: number) => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const cards = container.querySelectorAll('.testimonial-card');
    if (!cards[index]) return;

    const card = cards[index] as HTMLElement;
    const scrollPosition = card.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2);

    container.style.scrollSnapType = 'none';
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });

    setTimeout(() => {
      if (container) {
        container.style.scrollSnapType = 'x mandatory';
      }
    }, 600);
    
    setActiveIndex(index);
  }, []);

  // Intersection Observer to sync active dots during manual scroll
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
            const index = Number(entry.target.getAttribute('data-index'));
            mostVisibleIndex = index;
          }
        });

        if (maxIntersection > 0.5 && mostVisibleIndex !== -1) {
          setActiveIndex((prev) => prev !== mostVisibleIndex ? mostVisibleIndex : prev);
        }
      },
      {
        root: container,
        threshold: [0.4, 0.5, 0.6, 0.9],
      }
    );

    const items = container.querySelectorAll('.testimonial-card');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  // Auto-play interval
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

  // Mouse drag handlers
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
    <section className="w-full bg-[#fbfbfd] py-24 md:py-32 overflow-hidden flex flex-col relative border-t border-black/5">
      
      <div className="text-center mb-16 px-6">
        <span className="text-[#86868b] font-medium text-xs uppercase tracking-[0.2em] mb-4 block">
          Avaliações Reais
        </span>
        <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tighter">
          O que dizem nossas pacientes no Google
        </h2>
      </div>

      {/* Carousel Track */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 md:px-[30vw] pb-12 pt-4 no-scrollbar cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {testimonials.map((item, idx) => (
          <div 
            key={idx}
            data-index={idx}
            className="testimonial-card flex-none w-[85vw] md:w-[500px] snap-center bg-white border border-black/5 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between shadow-sm transition-transform duration-300 select-none"
          >
            <div className="flex items-center gap-4 mb-6">
              {/* Profile Picture */}
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0 ring-2 ring-[#fbfbfd]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.avatar} alt={item.name} className="w-full h-full object-cover pointer-events-none" />
              </div>
              
              {/* Name and Date */}
              <div className="flex-1 min-w-0">
                <h4 className="text-[#1d1d1f] font-semibold text-base truncate">{item.name}</h4>
                <p className="text-[#86868b] text-xs mt-0.5">{item.date}</p>
              </div>
              
              {/* Google Verified Icon */}
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0" title="Verificado no Google">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 text-[#FABB05]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Review Text */}
            <p className="text-[#1d1d1f]/85 text-[16px] leading-[1.7] font-normal italic">
              "{item.text}"
            </p>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-2">
        {/* Pill Container for Dots */}
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
                aria-label={`Go to slide ${idx + 1}`}
              >
                {isActive && (
                  <div 
                    key={activeIndex}
                    className="absolute top-0 left-0 h-full bg-[#1d1d1f]/70 animate-fill-dark"
                    style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Play/Pause Button */}
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-11 h-11 rounded-full bg-[#1d1d1f]/5 border border-black/5 backdrop-blur-md hover:bg-[#1d1d1f]/10 flex items-center justify-center transition-colors text-[#1d1d1f] flex-shrink-0"
          aria-label={isPlaying ? "Pause auto-play" : "Start auto-play"}
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
        @keyframes fillProgressDark {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-fill-dark {
          animation: fillProgressDark 5.5s linear forwards;
        }
      `}} />
    </section>
  );
}
