import React from 'react';
import { Home, Search, ClipboardList, Receipt, User, ShieldCheck, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

interface DesktopSidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const { user, profile } = useAuth();
  const { unreadCount } = useNotifications();

  // Derive display values — graceful fallback when profile row is missing
  const displayName = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const displayAvatar = profile?.avatar_url || null;
  const displayTier = profile?.member_tier || 'standard';

  const navItems = [
    { label: 'Home', route: '/', icon: Home },
    { label: 'Pharmacy Catalog', route: '/search', icon: Search },
    { label: 'Prescriptions', route: '/prescriptions', icon: ClipboardList },
    { label: 'Order History', route: '/orders', icon: Receipt },
    { label: 'Clinical Profile', route: '/profile', icon: User },
    { label: 'Notifications', route: '/notifications', icon: Bell, highlight: true, count: unreadCount > 0 ? unreadCount : undefined },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-4rem)] fixed left-0 top-16 bg-surface-container-low dark:bg-zinc-900 border-r border-outline-variant dark:border-zinc-800 py-6 z-30 overflow-y-auto">
      {/* Profile Header Block */}
      {user && (
        <div
          onClick={() => onNavigate('/profile')}
          className="mx-4 mb-6 p-3.5 rounded-brand bg-surface-container-lowest dark:bg-zinc-800/80 border border-surface-variant dark:border-zinc-700/60 flex items-center gap-3.5 cursor-pointer hover:border-primary transition-all shadow-sm"
        >
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex-shrink-0 flex items-center justify-center bg-primary-container text-on-primary-container font-bold text-lg overflow-hidden">
            {displayAvatar ? (
              <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h2 className="font-heading text-sm font-bold text-on-surface dark:text-zinc-100 truncate">
                {displayName}
              </h2>
              <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
            </div>
            <p className="text-[11px] text-on-surface-variant capitalize">{displayTier} Member</p>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-1.5 flex-1 pr-4">
        {navItems.map((item) => {
          const isActive = currentRoute === item.route;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.route)}
              className={`flex items-center gap-3 w-full ml-0 mr-4 px-6 py-3 rounded-r-full transition-all duration-200 ease-in-out font-heading text-sm font-semibold
                ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : item.highlight
                    ? 'bg-primary/10 text-primary hover:bg-primary/20'
                    : 'text-on-surface-variant dark:text-zinc-400 hover:bg-surface-container-highest dark:hover:bg-zinc-800'
                }
              `}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? 'text-on-primary-container' : item.highlight ? 'text-primary' : 'text-on-surface-variant dark:text-zinc-400'}`}
              />
              <span className="flex-1 text-left">{item.label}</span>
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
          <span>100% Genuine Medicines Delivered</span>
        </div>
      </div>
    </aside>
  );
};
