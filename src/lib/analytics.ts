// Google Analytics 4 Configuration and Event Tracking

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // Load gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      page_path: window.location.pathname,
      send_page_view: false
    });
  `;
  document.head.appendChild(script2);
};

// Pageview tracking
export const trackPageview = (url: string) => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  (window as any).gtag?.('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
  
  // Also track as custom event
  (window as any).gtag?.('event', 'page_view', {
    page_location: url,
    page_title: document.title,
  });
};

// Event tracking with categories
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export const trackEvent = ({ action, category, label, value, ...params }: AnalyticsEvent) => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  (window as any).gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...params,
  });
};

// Calculator-specific events
export const trackCalculatorUse = (calculatorName: string, inputs: Record<string, any>) => {
  trackEvent({
    action: 'calculator_use',
    category: 'Calculator',
    label: calculatorName,
    calculator_name: calculatorName,
    ...inputs,
  });
};

export const trackCalculatorResult = (
  calculatorName: string,
  inputs: Record<string, any>,
  results: Record<string, any>
) => {
  trackEvent({
    action: 'calculator_result',
    category: 'Calculator',
    label: calculatorName,
    calculator_name: calculatorName,
    inputs: JSON.stringify(inputs),
    results: JSON.stringify(results),
  });
};

// User interaction events
export const trackShare = (platform: string, contentType: string, contentId?: string) => {
  trackEvent({
    action: 'share',
    category: 'Social',
    label: platform,
    platform,
    content_type: contentType,
    content_id: contentId,
  });
};

export const trackDownload = (format: string, fileName: string, category?: string) => {
  trackEvent({
    action: 'download',
    category: 'Export',
    label: format,
    file_format: format,
    file_name: fileName,
    download_category: category,
  });
};

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent({
    action: 'search',
    category: 'Search',
    label: searchTerm,
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

export const trackFavorite = (action: 'add' | 'remove', calculatorId: string) => {
  trackEvent({
    action: `favorite_${action}`,
    category: 'User Engagement',
    label: calculatorId,
    calculator_id: calculatorId,
  });
};

// User journey tracking
export const trackUserJourney = (step: string, details?: Record<string, any>) => {
  trackEvent({
    action: 'user_journey',
    category: 'Journey',
    label: step,
    journey_step: step,
    ...details,
  });
};

// Conversion tracking
export const trackConversion = (conversionType: string, value?: number, currency: string = 'INR') => {
  trackEvent({
    action: 'conversion',
    category: 'Conversion',
    label: conversionType,
    conversion_type: conversionType,
    value,
    currency,
  });
};

// Error tracking
export const trackError = (errorMessage: string, errorType: string, fatal: boolean = false) => {
  trackEvent({
    action: 'error',
    category: 'Error',
    label: errorMessage,
    error_message: errorMessage,
    error_type: errorType,
    fatal,
  });
};

// Engagement metrics
export const trackEngagement = (metric: string, value: number) => {
  trackEvent({
    action: 'engagement',
    category: 'Engagement',
    label: metric,
    metric_name: metric,
    metric_value: value,
  });
};

// Custom dimension tracking
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  (window as any).gtag?.('set', 'user_properties', properties);
};

// E-commerce tracking (for future monetization)
export const trackPurchase = (
  transactionId: string,
  value: number,
  items: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>
) => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  (window as any).gtag?.('event', 'purchase', {
    transaction_id: transactionId,
    value,
    currency: 'INR',
    items,
  });
};

// Session tracking
export const trackSessionStart = () => {
  trackEvent({
    action: 'session_start',
    category: 'Session',
    label: 'User Session Start',
  });
};

export const trackSessionEnd = () => {
  trackEvent({
    action: 'session_end',
    category: 'Session',
    label: 'User Session End',
  });
};

// Time on page tracking
let pageStartTime = 0;

export const startPageTimer = () => {
  pageStartTime = Date.now();
};

export const trackTimeOnPage = (pagePath: string) => {
  if (pageStartTime === 0) return;
  
  const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
  
  trackEvent({
    action: 'time_on_page',
    category: 'Engagement',
    label: pagePath,
    value: timeSpent,
    page_path: pagePath,
    time_spent_seconds: timeSpent,
  });
  
  pageStartTime = 0;
};
