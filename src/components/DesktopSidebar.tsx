import React from 'react';
import { Home, Search, ShoppingCart, Receipt, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DesktopSidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  cartCount: number;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentRoute,
  onNavigate,
  cartCount,
}) => {
  const { profile } = useAuth();
  const navItems = [
    { label: 'Home', route: '/', icon: Home },
    { label: 'Pharmacy Catalog', route: '/search', icon: Search },
    { label: 'My Cart', route: '/cart', icon: ShoppingCart, count: cartCount },
    { label: 'Order History', route: '/orders', icon: Receipt },
    { label: 'Clinical Profile', route: '/profile', icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-4rem)] fixed left-0 top-16 bg-surface-container-low dark:bg-zinc-900 border-r border-outline-variant dark:border-zinc-800 py-6 z-30 overflow-y-auto">
      {/* Profile Header Block */}
      {profile && (
        <div
          onClick={() => onNavigate('/profile')}
          className="mx-4 mb-6 p-3.5 rounded-brand bg-surface-container-lowest dark:bg-zinc-800/80 border border-surface-variant dark:border-zinc-700/60 flex items-center gap-3.5 cursor-pointer hover:border-primary transition-all shadow-sm"
        >
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex-shrink-0 flex items-center justify-center bg-primary-container text-on-primary-container font-bold text-lg overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              profile.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h2 className="font-heading text-sm font-bold text-on-surface dark:text-zinc-100 truncate">
                {profile.name}
              </h2>
              <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
            </div>
            <p className="text-[11px] text-on-surface-variant capitalize">{profile.member_tier} Member</p>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-1.5 flex-1 pr-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentRoute === item.route ||
            (item.route !== '/' && currentRoute.startsWith(item.route));

          return (
            <button
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={`w-full py-3 px-6 rounded-r-full flex items-center justify-between text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container dark:hover:bg-zinc-800 hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-on-primary text-primary'
                      : 'bg-primary text-on-primary'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Certification Badge */}
      <div className="px-6 pt-4 border-t border-surface-variant dark:border-zinc-800">
        <div className="bg-surface-container dark:bg-zinc-800/80 p-3 rounded text-[11px] text-on-surface-variant">
          <span className="font-bold block text-on-surface dark:text-zinc-200">
            MedField PWA Clinical v1.4
          </span>
          <span>End-to-End Cold Chain Verified</span>
        </div>
      </div>
    </aside>
  );
};
