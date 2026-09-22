'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

export function Header() {
  const pathname = usePathname();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  if (pathname === '/primeira-consulta' || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="w-full bg-bg-header backdrop-blur-xl sticky top-0 z-50 border-b border-border-subtle transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[77px]">
          
          {/* Official Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center">
              
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/brand/logo-horizontal-wine.svg" 
                alt="Dr. Mário Warde - Cirurgia Plástica" 
                className="h-8 md:h-9 w-auto object-contain transition-opacity group-hover:opacity-85 logo-light"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/brand/logo-horizontal-white.svg" 
                alt="Dr. Mário Warde - Cirurgia Plástica" 
                className="h-8 md:h-9 w-auto object-contain transition-opacity group-hover:opacity-85 logo-dark"
              />

            </Link>
          </div>

          {/* Desktop Navigation & Audio Toggle */}
          <div className="flex items-center space-x-4 md:space-x-8">
            
            <nav className="hidden md:flex items-center space-x-8 text-[13px] font-medium text-text-accent/80">
              <Link href="#procedimentos" className="hover:text-text-accent transition-colors tracking-tight">
                Procedimentos
              </Link>
              <Link href="#metodo" className="hover:text-text-accent transition-colors tracking-tight">
                Na mídia
              </Link>
              <Link href="#blog" className="hover:text-text-accent transition-colors tracking-tight">
                Blog
              </Link>
              <Link href="#faq" className="hover:text-text-accent transition-colors tracking-tight">
                Dúvidas
              </Link>
            </nav>

            
            {/* Theme Toggle Button */}
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-text-accent/5 hover:bg-text-accent/10 text-text-accent transition-colors"
                aria-label="Alternar tema"
                title="Alternar tema"
              >
                {theme === 'dark' ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}

            {/* Audio Toggle Button */}

            <button 
              onClick={toggleAudio}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-text-accent/5 hover:bg-text-accent/10 text-text-accent transition-colors"
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

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-8 h-8 flex md:hidden items-center justify-center rounded-full bg-text-accent/5 hover:bg-text-accent/10 text-text-accent transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                // Close Icon
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Menu Icon
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Relógio em tempo real - Movido para a direita */}
            {formattedTime && (
              <div className="hidden lg:flex items-center justify-center min-w-[140px] text-[11px] font-medium text-text-secondary/60 uppercase tracking-widest whitespace-nowrap">
                {formattedTime}
              </div>
            )}

            {/* Background Audio Source (using 5-minute extended music loop) */}
            <audio ref={audioRef} loop src="/videos/background_music_5m.mp3" />
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[77px] left-0 w-full bg-bg-secondary border-b border-border-subtle shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col px-6 py-6 space-y-6 text-[15px] font-medium text-text-accent/80">
            <Link href="#procedimentos" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-text-accent transition-colors">
              Procedimentos
            </Link>
            <Link href="#metodo" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-text-accent transition-colors">
              Na mídia
            </Link>
            <Link href="#blog" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-text-accent transition-colors">
              Blog
            </Link>
            <Link href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-text-accent transition-colors">
              Dúvidas
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
