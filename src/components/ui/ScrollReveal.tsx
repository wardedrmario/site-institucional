'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade-up' | 'scale-up' | 'fade-in' | 'fade-left' | 'fade-right';
  direction?: 'up' | 'down' | 'left' | 'right' | string;
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds
  threshold?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = '',
  variant,
  direction,
  delay = 0,
  duration = 900,
  threshold = 0.15,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Normalize variant from either variant or direction prop
  const activeVariant = variant || (
    direction === 'left' ? 'fade-left' :
    direction === 'right' ? 'fade-right' :
    'fade-up'
  );

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTimeout(() => setIsVisible(true), 0);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [once, threshold]);

  const getVariantStyles = () => {
    switch (activeVariant) {
      case 'scale-up':
        return isVisible
          ? 'opacity-100 scale-100 translate-y-0 filter-none'
          : 'opacity-0 scale-[0.96] translate-y-4 blur-[2px]';
      case 'fade-in':
        return isVisible
          ? 'opacity-100 filter-none'
          : 'opacity-0 blur-[2px]';
      case 'fade-left':
        return isVisible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 -translate-x-8';
      case 'fade-right':
        return isVisible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-8';
      case 'fade-up':
      default:
        return isVisible
          ? 'opacity-100 translate-y-0 filter-none'
          : 'opacity-0 translate-y-8 blur-[1px]';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`transform-gpu transition-all ${getVariantStyles()} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </div>
  );
}
