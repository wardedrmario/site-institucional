'use client';

import { useEffect, useState } from 'react';

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent"
      aria-hidden="true"
    >
      <div 
        className="h-full bg-gradient-to-r from-[#310f0e] via-[#6f0f00] to-[#ccb9b6] transition-[width] duration-150 ease-out shadow-[0_1px_8px_rgba(49,15,14,0.4)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
