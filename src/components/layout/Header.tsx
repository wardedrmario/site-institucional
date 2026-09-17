'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Atualiza a cada 10 segundos para economizar processamento
    return () => clearInterval(interval);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formattedTime = currentTime 
    ? new Intl.DateTimeFormat('pt-BR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }).format(currentTime).replace('.,', ',') // Remove extra dots in some browsers
    : '';

  return (
    <header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-black/5 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[77px]">
          
          {/* Official Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/brand/logo-horizontal-wine.svg" 
                alt="Dr. Mário Warde - Cirurgia Plástica" 
                className="h-8 md:h-9 w-auto object-contain transition-opacity group-hover:opacity-85"
              />
            </Link>
          </div>

          {/* Desktop Navigation & Audio Toggle */}
          <div className="flex items-center space-x-4 md:space-x-8">
            
            <nav className="hidden md:flex items-center space-x-8 text-[13px] font-medium text-wine/80">
              <Link href="#procedimentos" className="hover:text-wine transition-colors tracking-tight">
                Procedimentos
              </Link>
              <Link href="#metodo" className="hover:text-wine transition-colors tracking-tight">
                Na mídia
              </Link>
              <Link href="#blog" className="hover:text-wine transition-colors tracking-tight">
                Blog
              </Link>
              <Link href="#faq" className="hover:text-wine transition-colors tracking-tight">
                Dúvidas
              </Link>
            </nav>

            {/* Audio Toggle Button */}
            <button 
              onClick={toggleAudio}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-wine/5 hover:bg-wine/10 text-wine transition-colors"
              aria-label={isPlaying ? "Pausar música" : "Tocar música"}
              title={isPlaying ? "Pausar música" : "Tocar música"}
            >
              {isPlaying ? (
                // Pause Icon
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                // Music Note Icon
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              )}
            </button>

            {/* Relógio em tempo real - Movido para a direita */}
            {formattedTime && (
              <div className="hidden lg:flex items-center justify-center min-w-[140px] text-[11px] font-medium text-chumbo-light/60 uppercase tracking-widest whitespace-nowrap">
                {formattedTime}
              </div>
            )}

            {/* Background Audio Source (using 5-minute extended music loop) */}
            <audio ref={audioRef} loop src="/videos/background_music_5m.mp3" />
          </div>

        </div>
      </div>
    </header>
  );
}
