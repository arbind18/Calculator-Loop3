'use client';

import { useEffect, useRef } from 'react';
import { trackEngagement } from '@/lib/analytics';

interface EventTrackerProps {
  children: React.ReactNode;
  eventName?: string;
  trackScroll?: boolean;
  trackClicks?: boolean;
  trackTime?: boolean;
}

/**
 * Component wrapper that automatically tracks user engagement events
 */
export default function EventTracker({
  children,
  eventName = 'section_view',
  trackScroll = true,
  trackClicks = false,
  trackTime = true,
}: EventTrackerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const hasTrackedView = useRef<boolean>(false);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    // Track scroll into view
    if (trackScroll) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasTrackedView.current) {
              trackEngagement('scroll_to_view', 1);
              hasTrackedView.current = true;
              
              if (trackTime) {
                startTimeRef.current = Date.now();
              }
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(element);

      return () => observer.disconnect();
    }
  }, [trackScroll, trackTime]);

  useEffect(() => {
    if (!ref.current || !trackClicks) return;

    const handleClick = () => {
      trackEngagement('element_click', 1);
    };

    const element = ref.current;
    element.addEventListener('click', handleClick);

    return () => element.removeEventListener('click', handleClick);
  }, [trackClicks]);

  useEffect(() => {
    // Track time spent when component unmounts
    return () => {
      if (trackTime && startTimeRef.current > 0) {
        const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
        if (timeSpent > 0) {
          trackEngagement('time_in_view', timeSpent);
        }
      }
    };
  }, [trackTime]);

  return <div ref={ref}>{children}</div>;
}
