'use client';

import { useEffect, useRef } from 'react';
import { trackConversion } from '@/lib/analytics';

interface ConversionTrackerProps {
  conversionType: string;
  value?: number;
  currency?: string;
  triggerOnMount?: boolean;
  triggerOnUnmount?: boolean;
  children?: React.ReactNode;
}

/**
 * Track conversion events automatically
 */
export default function ConversionTracker({
  conversionType,
  value,
  currency = 'INR',
  triggerOnMount = false,
  triggerOnUnmount = false,
  children,
}: ConversionTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (triggerOnMount && !hasTracked.current) {
      trackConversion(conversionType, value, currency);
      hasTracked.current = true;
    }

    return () => {
      if (triggerOnUnmount && !hasTracked.current) {
        trackConversion(conversionType, value, currency);
        hasTracked.current = true;
      }
    };
  }, [conversionType, value, currency, triggerOnMount, triggerOnUnmount]);

  return <>{children}</>;
}
