import React, { useState } from 'react';
import { Bell, Palette, Sliders, Info, Lock, ChevronRight, ExternalLink } from 'lucide-react';

interface SettingsScreenProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ isDarkMode, onToggleTheme }) => {
  const [promotionalOffers, setPromotionalOffers] = useState(false);

  return (
    <main className="min-h-screen pb-28 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <h1 className="font-heading text-3xl font-bold text-on-surface dark:text-zinc-100 mb-6">
        Settings
      </h1>

      <div className="space-y-6">
        {/* Notifications Section */}
        <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 shadow-sm">
          <div className="flex items-center gap-2 text-on-surface dark:text-zinc-100 font-bold text-base mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2>Notifications</h2>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-surface-variant dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-sm font-semibold text-on-surface dark:text-zinc-100">
                  Order Updates
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Essential updates on prescription status.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded">
                <Lock className="w-3 h-3" /> Required
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-on-surface dark:text-zinc-100">
                  Promotional Offers
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Receive discounts and pharmacy news.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPromotionalOffers(!promotionalOffers)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  promotionalOffers ? 'bg-primary' : 'bg-surface-container-high dark:bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-on-primary transition-transform ${
                    promotionalOffers ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 shadow-sm">
          <div className="flex items-center gap-2 text-on-surface dark:text-zinc-100 font-bold text-base mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h2>Appearance</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-on-surface dark:text-zinc-100">
                Dark Theme
              </h3>
              <p className="text-xs text-on-surface-variant">
                Switch between light and dark modes.
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleTheme}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                isDarkMode ? 'bg-primary' : 'bg-surface-container-high dark:bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-on-primary transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 shadow-sm">
          <div className="flex items-center gap-2 text-on-surface dark:text-zinc-100 font-bold text-base mb-4">
            <Sliders className="w-5 h-5 text-primary" />
            <h2>Preferences</h2>
          </div>

          <button className="w-full flex items-center justify-between text-left">
            <div>
              <h3 className="text-sm font-semibold text-on-surface dark:text-zinc-100">
                Language
              </h3>
              <p className="text-xs text-primary font-semibold mt-0.5">English (US)</p>
            </div>
            <ChevronRight className="w-4 h-4 text-on-surface-variant" />
          </button>
        </section>

        {/* About Section */}
        <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 shadow-sm">
          <div className="flex items-center gap-2 text-on-surface dark:text-zinc-100 font-bold text-base mb-4">
            <Info className="w-5 h-5 text-primary" />
            <h2>About</h2>
          </div>

          <button className="w-full flex items-center justify-between text-left">
            <span className="text-sm font-semibold text-on-surface dark:text-zinc-100">
              Privacy Policy
            </span>
            <ExternalLink className="w-4 h-4 text-on-surface-variant" />
          </button>
        </section>
      </div>
    </main>
  );
};
