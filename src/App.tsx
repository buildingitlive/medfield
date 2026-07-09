import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DesktopSidebar } from './components/DesktopSidebar';
import { ToastNotification } from './components/ToastNotification';
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
import { ManageAddressesScreen } from './screens/ManageAddressesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import type { CartItem, MedicineProduct, DeliveryAddress } from './types';
import { mockProducts, mockOrders, mockAddresses } from './data/mockData';

export default function App() {
  const [route, setRoute] = useState<string>('/splash');
  const [cart, setCart] = useState<CartItem[]>([
    { product: mockProducts[0], quantity: 1 },
  ]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(mockAddresses);
  const [defaultAddressId, setDefaultAddressId] = useState<string>(mockAddresses[0]?.id || '');

  // Toast Notification state
  const [toast, setToast] = useState<{ message: string; subtitle?: string } | null>(null);

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
    setRoute(newRoute);
  };

  const handleAddToCart = (product: MedicineProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast('Added to Cart', product.name);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handlePlaceOrder = () => {
    setCart([]);
    showToast('Order Placed Successfully!', 'Check order status in Tracking');
    handleNavigate('/orders');
  };

  const handleAddAddress = (addr: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setAddresses((prev) => [...prev, newAddr]);
    if (newAddr.isDefault || !defaultAddressId) {
      setDefaultAddressId(newAddr.id);
    }
    showToast('Address Saved', `${newAddr.label} — ${newAddr.street}`);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
      return <HomeScreen onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
    }
    if (route === '/search') {
      return <SearchScreen onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
    }
    if (route.startsWith('/medicine/')) {
      const id = route.replace('/medicine/', '');
      const foundProduct = mockProducts.find((p) => p.id === id) || mockProducts[0];
      return (
        <MedicineDetailScreen
          product={foundProduct}
          onNavigate={handleNavigate}
          onAddToCart={handleAddToCart}
        />
      );
    }
    if (route === '/cart') {
      return (
        <CartScreen
          cart={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onNavigate={handleNavigate}
        />
      );
    }
    if (route === '/checkout') {
      return (
        <CheckoutScreen
          cart={cart}
          onPlaceOrder={handlePlaceOrder}
          onNavigate={handleNavigate}
        />
      );
    }
    if (route === '/orders') {
      return <OrdersScreen orders={mockOrders} onNavigate={handleNavigate} />;
    }
    if (route.startsWith('/orders/')) {
      const id = route.replace('/orders/', '');
      const foundOrder = mockOrders.find((o) => o.id === id) || mockOrders[0];
      return <OrderTrackingScreen order={foundOrder} onNavigate={handleNavigate} />;
    }
    if (route === '/prescription-upload') {
      return <PrescriptionUploadScreen onNavigate={handleNavigate} />;
    }
    if (route === '/profile') {
      return <ProfileScreen onNavigate={handleNavigate} />;
    }
    if (route === '/addresses') {
      return (
        <ManageAddressesScreen
          addresses={addresses}
          defaultAddressId={defaultAddressId}
          onSelectDefault={setDefaultAddressId}
          onAddAddress={handleAddAddress}
        />
      );
    }
    if (route === '/settings') {
      return (
        <SettingsScreen
          isDarkMode={darkMode}
          onToggleTheme={() => setDarkMode(!darkMode)}
        />
      );
    }

    return <HomeScreen onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
  };

  const isStandaloneScreen = ['/splash', '/onboarding', '/login', '/otp', '/register'].includes(
    route
  );

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
    </div>
  );
}
