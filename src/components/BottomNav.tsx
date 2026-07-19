import React from 'react';
import { Home, Search, ClipboardList, PackageCheck, User } from 'lucide-react';

interface BottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRoute,
  onNavigate,
}) => {
  // Suppress bottom bar on splash, onboarding, and auth flows
  const suppressedRoutes = ['/splash', '/onboarding', '/login', '/otp', '/register'];
  if (suppressedRoutes.includes(currentRoute)) {
    return null;
  }

  const navItems = [
    { label: 'Home', route: '/', icon: Home },
    { label: 'Catalog', route: '/search', icon: Search },
    { label: 'Rx History', route: '/prescriptions', icon: ClipboardList },
    { label: 'Orders', route: '/orders', icon: PackageCheck },
    { label: 'Profile', route: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-surface-container-lowest dark:bg-zinc-900 border-t border-surface-variant dark:border-zinc-800">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentRoute === item.route ||
            (item.route === '/orders' && currentRoute.startsWith('/orders/')) ||
            (item.route === '/profile' && ['/profile', '/addresses', '/settings'].includes(currentRoute));

          return (
            <button
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] transition-colors ${
                isActive
                  ? 'text-primary-container dark:text-emerald-400 font-semibold'
                  : 'text-on-surface-variant hover:text-primary dark:text-zinc-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              </div>
              <span className="text-[11px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
