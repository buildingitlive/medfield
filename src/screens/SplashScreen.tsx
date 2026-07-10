import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onNavigate: (route: string) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate }) => {
  return (
    <main className="w-full min-h-screen bg-surface-container-lowest dark:bg-zinc-950 flex flex-col items-center justify-center px-4 sm:px-8 relative overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Subtle organic background radial glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-fixed/30 via-surface-container-lowest dark:via-zinc-950 to-surface-container-lowest dark:to-zinc-950" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center justify-center text-center py-12 animate-fade-up">
        {/* Cropped Horizontal MedField Logo Banner (replacing circular logo + text heading) */}
        <div className="mb-6 flex flex-col items-center">
          <img
            src="/logo.png"
            alt="MedField Logo"
            className="w-64 sm:w-72 h-auto object-contain drop-shadow-sm"
          />
        </div>

        {/* Tagline preserved exactly as requested */}
        <p className="font-body-lg text-lg sm:text-xl text-on-secondary-container dark:text-zinc-300 max-w-xs sm:max-w-sm mb-10 font-medium">
          Your medicines, delivered today.
        </p>

        {/* Verification Pill Badge */}
        <div className="mb-8 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container dark:bg-zinc-900 border border-outline-variant/40 text-xs font-semibold text-on-surface-variant dark:text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-primary-container" />
          <span>Verified Genuine Medicines</span>
        </div>

        {/* Interactive Entry Action (min 48px touch safe zone) */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={() => onNavigate('/onboarding')}
            className="w-full min-h-[48px] bg-primary-container hover:bg-primary text-on-primary font-semibold rounded-md px-6 py-3 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="w-full min-h-[48px] border border-outline hover:border-primary text-on-surface dark:text-zinc-200 font-semibold rounded-md px-6 py-3 flex items-center justify-center transition-colors"
          >
            Enter Catalog
          </button>
        </div>
      </div>
    </main>
  );
};
