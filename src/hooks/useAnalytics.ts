'use client';

import { useCallback } from 'react';
import {
  trackCalculatorUse,
  trackCalculatorResult,
  trackShare,
  trackDownload,
  trackSearch,
  trackFavorite,
  trackUserJourney,
  trackConversion,
  trackError,
  trackEngagement,
  setUserProperties,
} from '@/lib/analytics';

export interface UseAnalyticsReturn {
  trackCalculator: (name: string, inputs: Record<string, any>) => void;
  trackResult: (name: string, inputs: Record<string, any>, results: Record<string, any>) => void;
  trackShareEvent: (platform: string, contentType: string, contentId?: string) => void;
  trackDownloadEvent: (format: string, fileName: string, category?: string) => void;
  trackSearchEvent: (term: string, resultsCount: number) => void;
  trackFavoriteEvent: (action: 'add' | 'remove', calculatorId: string) => void;
  trackJourneyStep: (step: string, details?: Record<string, any>) => void;
  trackConversionEvent: (type: string, value?: number, currency?: string) => void;
  trackErrorEvent: (message: string, type: string, fatal?: boolean) => void;
  trackEngagementMetric: (metric: string, value: number) => void;
  updateUserProperties: (properties: Record<string, any>) => void;
}

/**
 * Custom hook for easy analytics tracking throughout the app
 */
export function useAnalytics(): UseAnalyticsReturn {
  const trackCalculator = useCallback((name: string, inputs: Record<string, any>) => {
    trackCalculatorUse(name, inputs);
  }, []);

  const trackResult = useCallback(
    (name: string, inputs: Record<string, any>, results: Record<string, any>) => {
      trackCalculatorResult(name, inputs, results);
    },
    []
  );

  const trackShareEvent = useCallback(
    (platform: string, contentType: string, contentId?: string) => {
      trackShare(platform, contentType, contentId);
    },
    []
  );

  const trackDownloadEvent = useCallback(
    (format: string, fileName: string, category?: string) => {
      trackDownload(format, fileName, category);
    },
    []
  );

  const trackSearchEvent = useCallback((term: string, resultsCount: number) => {
    trackSearch(term, resultsCount);
  }, []);

  const trackFavoriteEvent = useCallback(
    (action: 'add' | 'remove', calculatorId: string) => {
      trackFavorite(action, calculatorId);
    },
    []
  );

  const trackJourneyStep = useCallback((step: string, details?: Record<string, any>) => {
    trackUserJourney(step, details);
  }, []);

  const trackConversionEvent = useCallback(
    (type: string, value?: number, currency: string = 'INR') => {
      trackConversion(type, value, currency);
    },
    []
  );

  const trackErrorEvent = useCallback(
    (message: string, type: string, fatal: boolean = false) => {
      trackError(message, type, fatal);
    },
    []
  );

  const trackEngagementMetric = useCallback((metric: string, value: number) => {
    trackEngagement(metric, value);
  }, []);

  const updateUserProperties = useCallback((properties: Record<string, any>) => {
    setUserProperties(properties);
  }, []);

  return {
    trackCalculator,
    trackResult,
    trackShareEvent,
    trackDownloadEvent,
    trackSearchEvent,
    trackFavoriteEvent,
    trackJourneyStep,
    trackConversionEvent,
    trackErrorEvent,
    trackEngagementMetric,
    updateUserProperties,
  };
}
