'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { isMetaRestrictedPath } from '@/lib/metaPrivacy';

// PageView das navegações client-side (o rastreamento automático de pushState do Pixel está desligado).
// O primeiro PageView é disparado pelo script base em layout.tsx.
export function MetaPixelPageView() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isMetaRestrictedPath(pathname)) return;

    const win = window as Window & typeof globalThis & { fbq?: (...args: unknown[]) => void };
    if (typeof win.fbq === 'function') {
      win.fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}
