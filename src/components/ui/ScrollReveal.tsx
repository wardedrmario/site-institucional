'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: string;
}

export function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up',
  distance = '40px'
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          if (currentRef) {
            observer.unobserve(currentRef);
          }
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px' 
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay]);

  let transformInitial = '';
  switch (direction) {
    case 'up': transformInitial = `translateY(${distance})`; break;
    case 'down': transformInitial = `translateY(-${distance})`; break;
    case 'left': transformInitial = `translateX(${distance})`; break;
    case 'right': transformInitial = `translateX(-${distance})`; break;
    case 'none': transformInitial = 'translateY(0)'; break;
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : transformInitial,
        filter: isVisible ? 'blur(0)' : 'blur(4px)',
      }}
    >
      {children}
    </div>
  );
}
