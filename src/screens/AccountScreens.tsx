import React, { useState } from 'react';
import { User, MapPin, Settings, ShieldCheck, Moon, Sun, Plus } from 'lucide-react';
import { mockAddresses } from '../data/mockData';

interface AccountScreensProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const AccountScreens: React.FC<AccountScreensProps> = ({
  currentRoute,
  onNavigate,
  darkMode,
  onToggleDarkMode,
}) => {
  const [addresses, setAddresses] = useState(mockAddresses);

  return (
    <main className="min-h-screen pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Account Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-variant dark:border-zinc-800 pb-4 mb-6 overflow-x-auto">
        {[
          { label: 'Clinical Profile', route: '/profile', icon: User },
          { label: 'Delivery Facilities', route: '/addresses', icon: MapPin },
          { label: 'Preferences & Theme', route: '/settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentRoute === tab.route;
          return (
            <button
              key={tab.route}
              onClick={() => onNavigate(tab.route)}
              className={`min-h-[44px] px-4 rounded-md text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'bg-surface-container dark:bg-zinc-900 text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {currentRoute === '/profile' && (
        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 p-6 rounded-brand shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-secondary-container dark:bg-emerald-950 flex items-center justify-center font-bold text-xl text-primary-container">
              SF
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-heading text-xl font-bold text-on-surface dark:text-zinc-100">
                  Alpine Healthcare Dispensary
                </h1>
                <ShieldCheck className="w-5 h-5 text-primary-container" />
              </div>
              <p className="text-xs text-on-surface-variant">
                Licensed Institutional Purchaser • DEA #PHA-CA-998104
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-surface-container dark:bg-zinc-800 p-3.5 rounded">
              <span className="text-on-surface-variant block mb-1">Primary Email</span>
              <strong className="text-on-surface dark:text-zinc-100">clinician@sfdispensary.org</strong>
            </div>
            <div className="bg-surface-container dark:bg-zinc-800 p-3.5 rounded">
              <span className="text-on-surface-variant block mb-1">Assigned Medical Desk</span>
              <strong className="text-on-surface dark:text-zinc-100">Regional Cold Chain Unit #4</strong>
            </div>
          </div>
        </div>
      )}

      {currentRoute === '/addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-lg font-bold text-on-surface dark:text-zinc-100">
              Registered Dispensary Destinations
            </h1>
            <button
              onClick={() => alert('New destination facility dialog')}
              className="min-h-[44px] px-4 rounded bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Facility</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 p-4 rounded-md shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-sm text-on-surface dark:text-zinc-100">
                      {addr.label}
                    </h2>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold uppercase bg-secondary-container text-primary-container px-2 py-0.5 rounded">
                        Default Route
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {addr.street}, {addr.city}, {addr.state} {addr.zip}
                  </p>
                </div>

                {!addr.isDefault && (
                  <button
                    onClick={() =>
                      setAddresses(
                        addresses.map((a) => ({ ...a, isDefault: a.id === addr.id }))
                      )
                    }
                    className="text-xs font-semibold text-primary-container hover:underline"
                  >
                    Set Default
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {currentRoute === '/settings' && (
        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 p-6 rounded-brand shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-on-surface dark:text-zinc-100">
                Atmospheric Theme
              </h2>
              <p className="text-xs text-on-surface-variant">
                Switch between soft light organic canvas and dark medicinal theme
              </p>
            </div>
            <button
              onClick={onToggleDarkMode}
              className="min-h-[48px] px-4 rounded-md border border-outline-variant flex items-center gap-2 text-xs font-semibold text-on-surface dark:text-zinc-200 hover:border-primary"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              <span>{darkMode ? 'Dark Mode Active' : 'Light Mode Active'}</span>
            </button>
          </div>

          <div className="border-t border-surface-variant dark:border-zinc-800 pt-6 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-on-surface dark:text-zinc-100">
                HPLC Batch Alerts
              </h2>
              <p className="text-xs text-on-surface-variant">
                Receive instant notifications when new verified field assays are published
              </p>
            </div>
            <span className="text-xs font-bold text-primary-container bg-secondary-container px-2.5 py-1 rounded">
              Enabled
            </span>
          </div>
        </div>
      )}
    </main>
  );
};
