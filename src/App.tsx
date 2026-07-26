import { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DesktopSidebar } from './components/DesktopSidebar';

import { InstallAppPopup } from './components/InstallAppPopup';
import { GoogleAuthOnboardingModal } from './components/GoogleAuthOnboardingModal';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MedicineDetailScreen } from './screens/MedicineDetailScreen';
import { SearchScreen } from './screens/SearchScreen';
import { PlaceOrderScreen } from './screens/PlaceOrderScreen';
import { PrescriptionsScreen } from './screens/PrescriptionsScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { OrderTrackingScreen } from './screens/OrderTrackingScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ProfileEditScreen } from './screens/ProfileEditScreen';
import { ManageAddressesScreen } from './screens/ManageAddressesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { OrderSuccessScreen } from './screens/OrderSuccessScreen';
import { TermsOfServiceScreen } from './screens/TermsOfServiceScreen';
import { PrivacyPolicyScreen } from './screens/PrivacyPolicyScreen';
import { RefundPolicyScreen } from './screens/RefundPolicyScreen';
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
      '/place-order',
      '/prescriptions',
      '/orders',
      '/profile',
      '/profile/edit',
      '/addresses',
      '/notifications',
      '/settings',
      '/terms-of-service',
      '/privacy-policy',
      '/refund-policy',
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
  
  // App State
  const [route, setRoute] = useState<string>(getRoute);
  const [history, setHistory] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Reorder data (passed from PrescriptionsScreen to PlaceOrderScreen)
  const [reorderData, setReorderData] = useState<{
    prescriptionId: string;
    medicines: { name: string; quantity: number }[];
  } | null>(null);

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

  const handleReorder = (data: { prescriptionId: string; medicines: { name: string; quantity: number }[] }) => {
    setReorderData(data);
    handleNavigate('/place-order');
  };

  // ─── Auth Guard ──────────────────────────────────────────────────────────
  const protectedRoutes = ['/place-order', '/prescriptions', '/orders', '/profile', '/addresses', '/settings'];
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
        />
      );
    }
    if (route === '/search') {
      return (
        <SearchScreen
          onNavigate={handleNavigate}
        />
      );
    }
    if (route.startsWith('/medicine/')) {
      const id = route.replace('/medicine/', '');
      return (
        <MedicineDetailScreen
          productId={id}
          onNavigate={handleNavigate}
        />
      );
    }
    if (route === '/place-order') {
      const data = reorderData;
      // Clear reorder data after using it
      if (reorderData) {
        setTimeout(() => setReorderData(null), 0);
      }
      return (
        <PlaceOrderScreen
          onNavigate={handleNavigate}
          reorderData={data}
        />
      );
    }
    if (route === '/prescriptions') {
      return (
        <PrescriptionsScreen
          onNavigate={handleNavigate}
          onReorder={handleReorder}
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
          onNavigate={handleNavigate}
        />
      );
    }
    if (route === '/terms-of-service') {
      return <TermsOfServiceScreen onNavigate={handleNavigate} />;
    }
    if (route === '/privacy-policy') {
      return <PrivacyPolicyScreen onNavigate={handleNavigate} />;
    }
    if (route === '/refund-policy') {
      return <RefundPolicyScreen onNavigate={handleNavigate} />;
    }

    // 404 Fallback
    return <HomeScreen onNavigate={handleNavigate} />;
  };

  const isStandaloneScreen = ['/splash', '/onboarding', '/login', '/otp', '/register'].includes(route);

  return (
    <div className="min-h-screen bg-surface dark:bg-zinc-950 text-on-surface dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {!isStandaloneScreen && (
        <>
          <DesktopSidebar
            currentRoute={route}
            onNavigate={handleNavigate}
          />
          <Navbar
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
        />
      )}



      <InstallAppPopup />
      <GoogleAuthOnboardingModal />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HelmetProvider>
  );
}
