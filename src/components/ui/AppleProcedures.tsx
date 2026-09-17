'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';

const procedures = [
  { title: "Lipoaspiração", desc: "Redefina suas curvas com uma lipoaspiração que vai além da retirada de gordura, esculpindo o corpo com proporção e elegância.", image: "/images/procedures/lipoaspiracao.jpg", video: "/videos/lipoaspiracao.mp4" },
  { title: "Deep Plane Facelift", desc: "Um lifting facial avançado que atua na origem do envelhecimento, promovendo um rosto mais jovem, firme e elegante.", image: "/images/procedures/facelift.jpg", video: "/videos/facelift.mp4" },
  { title: "Mastopexia", desc: "Recupere a firmeza e o posicionamento das mamas com um resultado natural, proporcional e equilibrado.", image: "/images/procedures/mastopexia.jpg", video: "/videos/mastopexia.mp4" },
  { title: "Abdominoplastia", desc: "Elimine o excesso de pele e redefina o abdômen com um contorno mais firme, liso e proporcional.", image: "/images/procedures/abdominoplastia.jpg", video: "/videos/abdominoplastia.mp4" },
  { title: "Lipo HD", desc: "Tecnologia avançada e técnica precisa combinadas para eliminar a gordura localizada e esculpir um contorno corporal mais definido e atlético.", image: "/images/procedures/lipo_hd.jpg", video: "/videos/lipo_hd.mp4" },
  { title: "Mamoplastia de Aumento", desc: "Conquiste mamas mais proporcionais e elegantes com uma abordagem pensada para valorizar sua silhueta.", image: "/images/procedures/mamoplastia.jpg", video: "/videos/mamoplastia.mp4" },
  { title: "Lipoaspiração Masculina", desc: "Elimine gordura localizada e construa um contorno corporal mais firme, com definição pensada para valorizar o corpo masculino.", image: "/images/procedures/lipo_masculina.jpg", video: "/videos/lipo_masculina.mp4" },
  { title: "Blefaroplastia", desc: "Com técnica cirúrgica refinada, a cirurgia de pálpebras remove o excesso de pele, corrige bolsas e reequilibra a região dos olhos, rejuvenescendo o rosto.", image: "/images/procedures/blefaroplastia.jpg", video: "/videos/blefaroplastia.mp4" },
  { title: "Otoplastia", desc: "Por meio de técnica cirúrgica precisa, o ângulo e o posicionamento das orelhas são corrigidos definitivamente, restaurando a harmonia com o rosto.", image: "/images/procedures/otoplastia.jpg", video: "/videos/otoplastia.mp4" },
  { title: "Cirurgias Combinadas", desc: "A união de procedimentos permite potencializar resultados, sempre com planejamento individualizado e uma avaliação criteriosa.", image: "/images/procedures/combinadas.jpg", video: "/videos/combinadas.mp4" },
];

export function AppleProcedures() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Drag to scroll states
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scrollTo = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    
    const cards = container.querySelectorAll('.carousel-card');
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      const scrollPosition = card.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Intersection Observer to update active dot when user scrolls manually
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxIntersection = 0;
        let mostVisibleIndex = activeIndex;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxIntersection) {
            maxIntersection = entry.intersectionRatio;
            const index = Number(entry.target.getAttribute('data-index'));
            mostVisibleIndex = index;
          }
        });

        if (maxIntersection > 0.5 && mostVisibleIndex !== activeIndex) {
          setActiveIndex(mostVisibleIndex);
        }
      },
      {
        root: container,
        threshold: [0.4, 0.5, 0.6, 0.9],
      }
    );

    const items = container.querySelectorAll('.carousel-card');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [activeIndex]);

  // When the progress bar finishes filling up
  const handleProgressEnd = () => {
    if (isPlaying) {
      const nextIndex = (activeIndex + 1) % procedures.length;
      scrollTo(nextIndex);
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    setIsPlaying(false); // Pause auto-play when user interacts
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
    snapToNearest();
  };

  const handleMouseUp = () => {
    if (!isDragging.current || !scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.scrollSnapType = 'x mandatory';
    scrollRef.current.style.scrollBehavior = 'smooth';
    snapToNearest();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };
  
  const snapToNearest = () => {
    if (!scrollRef.current) return;
    scrollTo(activeIndex);
  };

  return (
    <section id="procedimentos" className="w-full bg-[#310f0e] text-white py-24 overflow-hidden relative">
      
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-12 flex items-end justify-between">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
          Procedimentos.
        </h2>
      </div>

      {/* Horizontal Carousel */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 md:px-[15vw] pb-12 pt-4 no-scrollbar cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {procedures.map((proc, idx) => (
          <div 
            key={idx}
            data-index={idx}
            className="carousel-card flex-none w-[85vw] md:w-[60vw] lg:w-[65vw] h-[60vh] md:h-[70vh] snap-center rounded-[40px] relative overflow-hidden group select-none"
          >
            {proc.video ? (
              <video 
                src={proc.video} 
                autoPlay 
                muted 
                loop 
                playsInline
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 pointer-events-none z-0"
              />
            ) : (
              <img 
                src={proc.image} 
                alt={proc.title}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 animate-ken-burns"
              />
            )}
            
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none z-10" />

            {/* Content inside the card */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between pointer-events-none z-20">
              <div className="mt-auto">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                  {proc.title}
                </h3>
                <p className="text-lg md:text-xl text-white/90 max-w-lg font-light leading-relaxed drop-shadow-md">
                  {proc.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Apple-style Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-2">
        
        {/* Pill Container for Dots */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-full">
          {procedures.map((_, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setIsPlaying(false);
                  scrollTo(idx);
                }}
                className={`h-2 rounded-full transition-all duration-500 ease-out relative overflow-hidden ${
                  isActive ? 'w-10 bg-white/30' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                {isActive && (
                  <div 
                    className="absolute top-0 left-0 h-full bg-white animate-fill"
                    style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                    onAnimationEnd={handleProgressEnd}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Play/Pause Button */}
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center transition-colors text-white flex-shrink-0"
          aria-label={isPlaying ? "Pause auto-play" : "Start auto-play"}
        >
          {isPlaying ? (
            // Pause Icon
            <svg width="12" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="2" y="1" width="3" height="12" rx="1" />
              <rect x="9" y="1" width="3" height="12" rx="1" />
            </svg>
          ) : (
            // Play Icon
            <svg width="12" height="14" viewBox="0 0 14 14" fill="currentColor" className="ml-1">
              <path d="M3 1.5L12 7L3 12.5V1.5Z" />
            </svg>
          )}
        </button>

      </div>
      
      {/* Styles for the progress bar animation, hiding scrollbar & ken burns */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes fillProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-fill {
          animation: fillProgress 4.5s linear forwards;
        }
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.08) translate(-1.5%, -1.5%); }
        }
        .animate-ken-burns {
          animation: kenBurns 25s ease-in-out infinite alternate;
        }
      `}} />
    </section>
  );
}
