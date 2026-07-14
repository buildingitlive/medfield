import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DesktopSidebar } from './components/DesktopSidebar';
import { ToastNotification } from './components/ToastNotification';
import { InstallAppPopup } from './components/InstallAppPopup';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MedicineDetailScreen } from './screens/MedicineDetailScreen';
import { SearchScreen } from './screens/SearchScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { OrderTrackingScreen } from './screens/OrderTrackingScreen';
import { PrescriptionUploadScreen } from './screens/PrescriptionUploadScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ProfileEditScreen } from './screens/ProfileEditScreen';
import { ManageAddressesScreen } from './screens/ManageAddressesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { OrderSuccessScreen } from './screens/OrderSuccessScreen';
import { useCart } from './hooks/useCart';
import { Loader2 } from 'lucide-react';

function getRoute(): string {
  const path = window.location.pathname;
  if (
    [
      '/',
      '/splash',
      '/onboarding',
      '/login',
      '/otp',
      '/register',
      '/search',
      '/cart',
      '/checkout',
      '/orders',
      '/prescription-upload',
      '/profile',
      '/profile/edit',
      '/addresses',
      '/notifications',
      '/settings',
    ].includes(path) ||
    path.startsWith('/medicine/') ||
    path.startsWith('/orders/') ||
    path.startsWith('/order-success/')
  ) {
    return path;
  }
  return '/splash';
}

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { cartCount, addToCart } = useCart();
  
  // App State
  const [route, setRoute] = useState<string>(getRoute);
  const [history, setHistory] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; subtitle?: string } | null>(null);

  // Handle browser / hardware back and forward button
  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auto-skip splash/onboarding if user is logged in
  useEffect(() => {
    if (!authLoading && user && (route === '/splash' || route === '/login' || route === '/onboarding')) {
      setRoute('/');
      window.history.replaceState({}, '', '/');
    }
  }, [user, authLoading, route]);

  // Dark Mode side effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  const showToast = (message: string, subtitle?: string) => {
    setToast({ message, subtitle });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3000);
  };

  const handleNavigate = (newRoute: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (newRoute === 'BACK' || newRoute === '-1' || (typeof newRoute === 'number' && newRoute === -1)) {
      if (window.history.length > 1) {
        window.history.back();
      } else if (history.length > 0) {
        const prev = history[history.length - 1];
        setHistory((curr) => curr.slice(0, -1));
        setRoute(prev || '/');
        window.history.pushState({}, '', prev || '/');
      } else {
        setRoute('/');
        window.history.pushState({}, '', '/');
      }
      return;
    }
    if (newRoute !== route) {
      setHistory((curr) => [...curr, route]);
      window.history.pushState({}, '', newRoute);
      setRoute(newRoute);
    }
  };

  // ─── Auth Guard ──────────────────────────────────────────────────────────
  const protectedRoutes = ['/cart', '/checkout', '/orders', '/profile', '/addresses', '/settings', '/prescription-upload'];
  const isProtectedRoute = protectedRoutes.some((r) => route === r || route.startsWith(`${r}/`));

  if (authLoading && route !== '/splash') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && isProtectedRoute && !authLoading) {
    // Redirect to login if trying to access a protected route
    setTimeout(() => handleNavigate('/login'), 0);
    return null; // prevent render flash
  }

  // ─── Screen Router ───────────────────────────────────────────────────────
  const renderScreen = () => {
    if (route === '/splash') {
      return <SplashScreen onNavigate={handleNavigate} />;
    }
    if (route === '/onboarding') {
      return <OnboardingScreen onComplete={() => handleNavigate('/login')} />;
    }
    if (['/login', '/otp', '/register'].includes(route)) {
      return <AuthScreen onLoginSuccess={() => handleNavigate('/')} />;
    }
    if (route === '/') {
      return (
        <HomeScreen
          onNavigate={handleNavigate}
          onAddToCart={(p, qty = 1) => { addToCart(p.id, qty); showToast('Added to Cart', p.name); }}
        />
      );
    }
    if (route === '/search') {
      return (
        <SearchScreen
          onNavigate={handleNavigate}
          onAddToCart={(p, qty = 1) => { addToCart(p.id, qty); showToast('Added to Cart', p.name); }}
        />
      );
    }
    if (route.startsWith('/medicine/')) {
      const id = route.replace('/medicine/', '');
      return (
        <MedicineDetailScreen
          productId={id}
          onNavigate={handleNavigate}
          onAddToCart={(p, qty = 1) => { addToCart(p.id, qty); showToast('Added to Cart', p.name); }}
        />
      );
    }
    if (route === '/cart') {
      return (
        <CartScreen
          onNavigate={handleNavigate}
        />
      );
    }
    if (route === '/checkout') {
      return (
        <CheckoutScreen
          onNavigate={handleNavigate}
        />
      );
    }
    if (route === '/orders') {
      return <OrdersScreen onNavigate={handleNavigate} />;
    }
    if (route.startsWith('/orders/')) {
      const id = route.replace('/orders/', '');
      return <OrderTrackingScreen orderId={id} onNavigate={handleNavigate} />;
    }
    if (route === '/prescription-upload') {
      return <PrescriptionUploadScreen onNavigate={handleNavigate} />;
    }
    if (route === '/profile') {
      return <ProfileScreen onNavigate={handleNavigate} />;
    }
    if (route === '/profile/edit') {
      return <ProfileEditScreen onNavigate={handleNavigate} />;
    }
    if (route === '/addresses') {
      return <ManageAddressesScreen onNavigate={handleNavigate} />;
    }
    if (route === '/notifications') {
      return <NotificationsScreen onNavigate={handleNavigate} />;
    }
    if (route.startsWith('/order-success/')) {
      const id = route.replace('/order-success/', '');
      return <OrderSuccessScreen orderId={id} onNavigate={handleNavigate} />;
    }
    if (route === '/settings') {
      return (
        <SettingsScreen
          isDarkMode={darkMode}
          onToggleTheme={() => setDarkMode(!darkMode)}
        />
      );
    }

    // 404 Fallback
    return <HomeScreen onNavigate={handleNavigate} onAddToCart={(p, qty = 1) => { addToCart(p.id, qty); showToast('Added to Cart', p.name); }} />;
  };

  const isStandaloneScreen = ['/splash', '/onboarding', '/login', '/otp', '/register'].includes(route);

  return (
    <div className="min-h-screen bg-surface dark:bg-zinc-950 text-on-surface dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {!isStandaloneScreen && (
        <>
          <DesktopSidebar
            currentRoute={route}
            onNavigate={handleNavigate}
            cartCount={cartCount}
          />
          <Navbar
            cartCount={cartCount}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onNavigate={handleNavigate}
            currentRoute={route}
          />
        </>
      )}

      <div className={`flex-1 ${!isStandaloneScreen ? 'lg:pl-72' : ''}`}>
        {renderScreen()}
      </div>

      {!isStandaloneScreen && (
        <BottomNav
          currentRoute={route}
          onNavigate={handleNavigate}
          cartCount={cartCount}
        />
      )}

      <ToastNotification
        message={toast?.message || null}
        subtitle={toast?.subtitle}
        onViewCart={() => handleNavigate('/cart')}
      />

      <InstallAppPopup />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
