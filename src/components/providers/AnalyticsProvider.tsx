'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  initGA,
  trackPageview,
  trackSessionStart,
  startPageTimer,
  trackTimeOnPage,
} from '@/lib/analytics';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize GA on mount
  useEffect(() => {
    initGA();
    trackSessionStart();

    // Track session end on page unload
    const handleBeforeUnload = () => {
      if (pathname) {
        trackTimeOnPage(pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      // Track time on previous page
      trackTimeOnPage(pathname);
      
      // Start timer for new page
      startPageTimer();
      
      // Track new pageview
      trackPageview(url);
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
