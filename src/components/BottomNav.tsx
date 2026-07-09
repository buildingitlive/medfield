import React from 'react';
import { Home, Search, ShoppingBag, PackageCheck, User } from 'lucide-react';

interface BottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRoute,
  onNavigate,
  cartCount,
}) => {
  // Suppress bottom bar on splash, onboarding, and auth flows
  const suppressedRoutes = ['/splash', '/onboarding', '/login', '/otp', '/register'];
  if (suppressedRoutes.includes(currentRoute)) {
    return null;
  }

  const navItems = [
    { label: 'Home', route: '/', icon: Home },
    { label: 'Catalog', route: '/search', icon: Search },
    { label: 'Cart', route: '/cart', icon: ShoppingBag, badge: cartCount },
    { label: 'Orders', route: '/orders', icon: PackageCheck },
    { label: 'Profile', route: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-surface-container-lowest/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-surface-variant dark:border-zinc-800">
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
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary px-1">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
