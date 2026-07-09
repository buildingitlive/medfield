import React from 'react';
import { Search, ShoppingBag, Moon, Sun, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  cartCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  cartCount,
  darkMode,
  onToggleDarkMode,
}) => {
  // Suppress header on splash, onboarding, and auth flows
  const suppressedRoutes = ['/splash', '/onboarding', '/login', '/otp', '/register'];
  if (suppressedRoutes.includes(currentRoute)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-surface-variant dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo (Cropped Horizontal Logo Banner) */}
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <img
            src="/logo.png"
            alt="MedField — Field-to-Pharmacy System"
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider bg-secondary-container dark:bg-emerald-950/60 text-on-secondary-container dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-secondary/20">
            <ShieldCheck className="w-3 h-3 text-primary-container" />
            Verified Field Sourcing
          </span>
        </div>

        {/* Action Controls (Min 48px touch targets) */}
        <div className="flex items-center gap-2">
          {/* Search Shortcut */}
          <button
            onClick={() => onNavigate('/search')}
            aria-label="Search pharmaceutical catalog"
            className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:hover:bg-zinc-800 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Shortcut with Badge */}
          <button
            onClick={() => onNavigate('/cart')}
            aria-label="View shopping cart"
            className="relative min-h-[48px] min-w-[48px] flex items-center justify-center rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:hover:bg-zinc-800 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-on-primary shadow">
                {cartCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle light or dark theme"
            className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:hover:bg-zinc-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
