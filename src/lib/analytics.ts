/**
 * Google Analytics 4 — Consent-First Integration
 * GA4 scripts are injected dynamically only AFTER user consent.
 */

const GA_MEASUREMENT_ID = 'G-26HX1Y0XS8';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/** Dynamically inject GA4 scripts and initialize tracking */
export function initGA4(): void {
  if (typeof window === 'undefined') return;

  // Prevent double-injection
  if (document.getElementById('ga4-script')) return;

  // 1. Inject the gtag.js loader
  const script = document.createElement('script');
  script.id = 'ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // 2. Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
  });
}

/** Track a virtual page view (for SPA route changes) */
export function trackPageView(path: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
}

/** Track a custom event */
export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}
