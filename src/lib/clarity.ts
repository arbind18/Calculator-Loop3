// Microsoft Clarity Integration for Heatmaps and Session Recording

export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || '';

/**
 * Initialize Microsoft Clarity
 * Provides heatmaps, session recordings, and user behavior insights
 */
export const initClarity = () => {
  if (typeof window === 'undefined' || !CLARITY_PROJECT_ID) return;

  // Check if already initialized
  if ((window as any).clarity) return;

  (function(c: any, l: any, a: any, r: any, i: any) {
    c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
    const t = l.createElement(r);
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
};

/**
 * Set custom tags for Clarity sessions
 */
export const setClarityTag = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  
  (window as any).clarity?.('set', key, value);
};

/**
 * Identify user in Clarity
 */
export const identifyClarityUser = (userId: string, sessionId?: string, pageId?: string) => {
  if (typeof window === 'undefined') return;
  
  (window as any).clarity?.('identify', userId, sessionId, pageId);
};

/**
 * Track custom events in Clarity
 */
export const trackClarityEvent = (eventName: string) => {
  if (typeof window === 'undefined') return;
  
  (window as any).clarity?.('event', eventName);
};

/**
 * Upgrade Clarity session (marks as important)
 */
export const upgradeClaritySession = () => {
  if (typeof window === 'undefined') return;
  
  (window as any).clarity?.('upgrade', 'session');
};

/**
 * Set Clarity metadata
 */
export const setClarityMetadata = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  
  (window as any).clarity?.('metadata', key, value);
};
