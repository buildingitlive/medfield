import React, { useState } from 'react';
import {
  Search,
  Mic,
  MapPin,
  Truck,
  FileText,
  Pill,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Zap,
  Tag,
  Percent,
  Phone,
  CheckCircle,
  Package,
} from 'lucide-react';
import { SEO } from '../components/SEO';

import { useAddresses } from '../hooks/useAddresses';
import { supabase } from '../lib/supabase';

interface HomeScreenProps {
  onNavigate: (route: string) => void;
}

function getContrastColor(hexColor: string | null): string {
  if (!hexColor) return '#000000';
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(hexColor)) return '#000000';
  
  let hex = hexColor.slice(1);
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [bannerSlide, setBannerSlide] = useState(0);
  const [banners, setBanners] = useState<any[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  
  const { defaultAddress } = useAddresses();

  // Fetch active banners
  React.useEffect(() => {
    const fetchBanners = async () => {
      setBannersLoading(true);
      const { data } = await supabase.from('banners').select('*').eq('is_active', true).order('position', { ascending: true });
      if (data) {
        setBanners(data);
      }
      setBannersLoading(false);
    };
    fetchBanners();
  }, []);

  const BANNER_COUNT = banners.length > 0 ? banners.length : 2;
  
  React.useEffect(() => {
    if (BANNER_COUNT <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setBannerSlide((prev) => (prev + 1) % BANNER_COUNT);
    }, 4000);
    return () => clearInterval(timer);
  }, [BANNER_COUNT, isPaused]);

  const nextBanner = () => {
    setBannerSlide((prev) => (prev + 1) % BANNER_COUNT);
  };

  const prevBanner = () => {
    setBannerSlide((prev) => (prev - 1 + BANNER_COUNT) % BANNER_COUNT);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) {
      setIsPaused(false);
      return;
    }
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && BANNER_COUNT > 1) {
      nextBanner();
    } if (isRightSwipe && BANNER_COUNT > 1) {
      prevBanner();
    }
    setTouchStartX(null);
    setTouchEndX(null);
    setIsPaused(false);
  };

  return (
    <>
      <SEO 
        title="Genuine Medicine Delivery" 
        description="MedField delivers genuine medicines to your door. Get up to 15% discount, same-day delivery, and no delivery charges on every order."
        keywords="pharmacy, online pharmacy, buy medicine, home delivery pharmacy, genuine medicines, fast delivery"
        schema={{
          "@context": "https://schema.org",
          "@type": "Pharmacy",
          "name": "MedField",
          "image": "https://medfield.in/logo.png",
          "description": "Online pharmacy delivering genuine medicines with up to 15% discount, same-day delivery, and no delivery charges.",
          "url": "https://medfield.in",
          "telephone": "+91 9389407550",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "P86, Shakti Nagar Colony, Bagha Baba Road, Rustampur (south)",
            "addressLocality": "Gorakhpur",
            "postalCode": "273016",
            "addressCountry": "IN"
          },
          "priceRange": "₹10 - ₹2000",
          "openingHours": "Mo-Su 00:00-23:59"
        }}
      />
      <main className="min-h-screen pb-24 lg:pb-12 max-w-7xl mx-auto flex flex-col">
        {/* Address Selector Sub-header */}
      <div
        onClick={() => onNavigate('/addresses')}
        className="bg-surface dark:bg-zinc-900 border-b border-surface-variant dark:border-zinc-800 px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2.5 cursor-pointer hover:bg-surface-container-lowest transition-colors"
      >
        <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
          <span className="text-[11px] font-semibold text-on-surface-variant">
            Delivering to
          </span>
          <span className="text-xs font-bold text-on-surface dark:text-zinc-100 flex items-center gap-1">
            {defaultAddress ? (
              <>{defaultAddress.street}, {defaultAddress.city}</>
            ) : (
              'Select Delivery Address'
            )}
            <ChevronDown className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Banner Slider */}
        {bannersLoading ? (
          <div className="w-full h-24 bg-surface-variant animate-pulse rounded-brand"></div>
        ) : banners.length > 0 ? (
          <div 
            className="relative overflow-hidden rounded-brand group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${bannerSlide * 100}%)` }}
            >
              {banners.map((banner) => (
                <div key={banner.id} className="w-full flex-shrink-0 p-4 flex items-center gap-4" style={{ backgroundColor: banner.bg_color, color: getContrastColor(banner.bg_color) }}>
                  {banner.image_url ? (
                    <img src={banner.image_url} alt="" className="w-12 h-12 object-contain flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 flex-shrink-0 flex justify-center items-center">
                      <Truck className="w-7 h-7" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-bold">{banner.title}</p>
                    <p className="text-xs opacity-90 mt-0.5">{banner.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Left / Right Navigation Arrows (Visible when more than 1 banner) */}
            {BANNER_COUNT > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevBanner(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous Banner"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextBanner(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next Banner"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Bottom Navigation Dots */}
                <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => { e.stopPropagation(); setBannerSlide(index); }}
                      className={`h-1.5 rounded-full transition-all pointer-events-auto ${
                        index === bannerSlide ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null}

        {/* Search Input Bar */}
        <div
          onClick={() => onNavigate('/search')}
          className="relative group cursor-pointer"
        >
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-on-surface-variant pointer-events-none" />
          <input
            type="text"
            readOnly
            placeholder="Search medicines, devices, or symptoms..."
            className="w-full min-h-[48px] bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 text-on-surface dark:text-zinc-100 rounded-md pl-12 pr-12 text-sm shadow-sm cursor-pointer focus:outline-none"
          />
          <Mic className="w-5 h-5 absolute right-4 top-3.5 text-primary pointer-events-none" />
        </div>

        {/* Asymmetric CTA Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('/place-order')}
            className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-6 flex flex-col gap-4 text-left shadow-sm hover:shadow transition-all relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-on-surface dark:text-zinc-100 mb-1">
                Order Now
              </h2>
              <p className="text-xs text-on-surface-variant">
                Upload prescription or list medicines to place an order.
              </p>
            </div>
            <div className="mt-auto pt-2 flex items-center gap-1.5 text-primary text-xs font-bold">
              <span>Start Order</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('/search')}
            className="bg-primary text-on-primary rounded-brand p-6 flex flex-col gap-4 text-left shadow-sm hover:shadow transition-all relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-full bg-on-primary/20 flex items-center justify-center backdrop-blur-sm">
              <Pill className="w-6 h-6 text-on-primary" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-on-primary mb-1">
                Search Medicines
              </h2>
              <p className="text-xs text-on-primary/85">
                Browse our certified pharmaceutical catalog.
              </p>
            </div>
            <div className="mt-auto pt-2 flex items-center gap-1.5 text-on-primary text-xs font-bold">
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* How It Works — Order Flow */}
        <section className="space-y-5 pt-2">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-base font-bold text-on-surface dark:text-zinc-100">
              How It Works
            </h2>
            <div className="flex-1 h-px bg-surface-variant dark:bg-zinc-700" />
          </div>

          <div className="space-y-0">
            {[
              {
                step: 1,
                icon: FileText,
                title: 'Place Your Order',
                desc: 'Upload your prescription or share the list of medicines with quantity.',
                color: 'bg-primary/10 text-primary',
              },
              {
                step: 2,
                icon: Phone,
                title: 'Pharmacist Calls You',
                desc: 'Our pharmacist will call you to verify and confirm your order.',
                color: 'bg-primary/15 text-primary',
              },
              {
                step: 3,
                icon: CheckCircle,
                title: 'Discount & Total Confirmed',
                desc: 'Your applicable discount and the final bill amount will be confirmed.',
                color: 'bg-primary/20 text-primary',
              },
              {
                step: 4,
                icon: Package,
                title: 'Order Dispatched',
                desc: 'The delivery of your order will be initiated right away.',
                color: 'bg-primary/30 text-primary',
              },
              {
                step: 5,
                icon: Truck,
                title: 'Delivered to Your Door',
                desc: 'Your order will be delivered on the same day or the very next day.',
                color: 'bg-primary text-on-primary',
              },
            ].map((item, idx, arr) => (
              <div key={item.step} className="flex gap-4">
                {/* Timeline line + circle */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="w-0.5 flex-1 min-h-[24px] bg-surface-variant dark:bg-zinc-700" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-6">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
                    Step {item.step}
                  </p>
                  <h3 className="font-semibold text-sm text-on-surface dark:text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA after flow */}
          <button
            onClick={() => onNavigate('/place-order')}
            className="w-full min-h-[48px] rounded-brand bg-primary hover:bg-primary/90 text-on-primary font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <FileText className="w-5 h-5" />
            Place Your Order Now
          </button>
        </section>

        {/* Trust Strip */}
        <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-4 flex flex-col sm:flex-row items-center mt-6">
          <div className="flex-1 flex justify-center items-center gap-2 text-on-surface-variant w-full py-2 sm:py-0">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold">Same Day Delivery</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-outline-variant" />
          <div className="flex-1 flex justify-center items-center gap-2 text-on-surface-variant w-full py-2 sm:py-0">
            <Tag className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold">No Delivery Charges</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-outline-variant" />
          <div className="flex-1 flex justify-center items-center gap-2 text-on-surface-variant w-full py-2 sm:py-0">
            <Percent className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold">Upto 15% off</span>
          </div>
        </section>
      </div>
    </main>
    </>
  );
};
