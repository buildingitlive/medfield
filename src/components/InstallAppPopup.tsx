import React from 'react';
import { Download, Share2, Plus, X, ShieldCheck } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export const InstallAppPopup: React.FC = () => {
  const { shouldShowPopup, isIOS, promptInstall, dismiss } = useInstallPrompt();

  if (!shouldShowPopup) return null;

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (!accepted) {
      dismiss();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Center Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-sm pointer-events-auto bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Close Button */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container dark:bg-zinc-800 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Close popup"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Decorative Top Glow */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

          {/* App Icon Banner */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-container dark:bg-zinc-800 flex items-center justify-center p-2.5 shadow-md border border-outline-variant/40">
              <img
                src="/logo.png"
                alt="MedField PWA"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Verified Clinical PWA</span>
            </div>

            <h2 className="font-heading text-xl sm:text-2xl font-bold text-on-surface dark:text-zinc-100 mb-2">
              Install MedField App
            </h2>
            <p className="text-xs text-on-surface-variant dark:text-zinc-400 mb-6 leading-relaxed">
              Install MedField on your device for instant access, offline medication tracking &amp; expedited delivery updates.
            </p>

            {isIOS ? (
              <div className="space-y-4 text-left">
                <div className="bg-surface-container-low dark:bg-zinc-800/80 rounded-2xl p-4 border border-outline-variant/30">
                  <p className="text-xs font-bold text-on-surface dark:text-zinc-100 mb-3 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-primary" />
                    Add to iOS Home Screen
                  </p>
                  <ol className="text-xs text-on-surface-variant space-y-2.5">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        1
                      </span>
                      <span>
                        Tap <Share2 className="w-3.5 h-3.5 inline text-primary mx-0.5" /> <strong>Share</strong> in Safari
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        2
                      </span>
                      <span>
                        Scroll down and tap <Plus className="w-3.5 h-3.5 inline text-primary mx-0.5" /> <strong>Add to Home Screen</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        3
                      </span>
                      <span>Tap <strong>Add</strong> in top right corner</span>
                    </li>
                  </ol>
                </div>

                <button
                  onClick={dismiss}
                  className="w-full min-h-[44px] rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <button
                  onClick={handleInstall}
                  className="w-full min-h-[48px] rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App</span>
                </button>

                <button
                  onClick={dismiss}
                  className="w-full min-h-[44px] rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Not Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
