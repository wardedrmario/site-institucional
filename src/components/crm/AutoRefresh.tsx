'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoRefresh({ intervalMs = 600000, leadsCount }: { intervalMs?: number, leadsCount?: number }) {
  const router = useRouter();
  const prevCount = useRef(leadsCount);

  // Play a soft "ding" notification sound using Web Audio API
  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      // Elegant bell chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime); // C6 note
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.1); // E6 note
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05); // Fade in
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5); // Fade out
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.log('Autoplay prevent or audio error');
    }
  };

  // Check for new leads
  useEffect(() => {
    if (leadsCount !== undefined && prevCount.current !== undefined) {
      if (leadsCount > prevCount.current) {
        playNotificationSound();
      }
    }
    prevCount.current = leadsCount;
  }, [leadsCount]);

  // Interval for refreshing
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [router, intervalMs]);

  return null;
}
