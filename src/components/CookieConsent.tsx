import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { initGA4 } from '../lib/analytics';

const CONSENT_KEY = 'medfield_cookie_consent';

type ConsentStatus = 'accepted' | 'declined' | null;

export const CookieConsent: React.FC = () => {
  const [status, setStatus] = useState<ConsentStatus>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentStatus;
    if (stored === 'accepted') {
      // User previously accepted — initialize GA4 silently
      initGA4();
      setStatus('accepted');
    } else if (stored === 'declined') {
      setStatus('declined');
    } else {
      // No decision yet — show banner after a short delay
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setStatus('accepted');
    setVisible(false);
    initGA4();
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setStatus('declined');
    setVisible(false);
  };

  // Don't render if user already made a choice
  if (status || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 animate-slide-up"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-lg mx-auto bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-700 rounded-2xl shadow-2xl p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-sm text-on-surface dark:text-zinc-100">
                We value your privacy
              </h3>
              <button
                onClick={handleDecline}
                className="text-on-surface-variant hover:text-on-surface transition-colors p-1 -mr-1"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-on-surface-variant dark:text-zinc-400 leading-relaxed mb-3">
              We use cookies to analyze site usage and improve your experience. No personal health data is ever shared with third parties.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAccept}
                className="min-h-[36px] px-4 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-semibold shadow-sm transition-all"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="min-h-[36px] px-4 rounded-lg bg-surface-container-high dark:bg-zinc-800 hover:bg-surface-variant text-on-surface-variant text-xs font-semibold transition-all"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
