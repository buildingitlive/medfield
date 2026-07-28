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
  Loader2,
} from 'lucide-react';
import { SEO } from '../components/SEO';

import { useProducts } from '../hooks/useProducts';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [bannerSlide, setBannerSlide] = useState(0);
  const [banners, setBanners] = useState<any[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  
  const { products, loading } = useProducts({
    category: selectedCategory === 'ALL' ? undefined : selectedCategory,
  });
  
  const { defaultAddress } = useAddresses();

  const categories = [
    'ALL',
    'Vitamins',
    'First Aid',
    'Heart Health',
    'Allergy',
    'Diabetes Care',
  ];

  const reorderItems = products.slice(0, 4);
  const displayedProducts = products;

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
        title="Pharmacy Delivery & Health Products" 
        description="Shop for medicines, healthcare products, and upload prescriptions for lightning-fast delivery to your doorstep."
        keywords="pharmacy, online pharmacy, buy medicine, home delivery pharmacy, health products"
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

        {/* Category Chips */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Categories
          </h3>
          <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap min-h-[40px] px-4 rounded-full text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-secondary-container text-on-secondary-container font-bold'
                    : 'bg-surface-container dark:bg-zinc-800 text-on-surface border border-outline-variant dark:border-zinc-700 hover:bg-surface-container-high'
                }`}
              >
                {cat === 'ALL' ? 'All Catalog' : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Reorder Routine Horizontal Carousel */}
            {reorderItems.length > 0 && (
              <section className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-base font-bold text-on-surface dark:text-zinc-100">
                    Reorder Routine
                  </h2>
                  <button
                    onClick={() => onNavigate('/orders')}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2">
                  {reorderItems.map((product) => (
                    <div
                      key={`reorder-${product.id}`}
                      onClick={() => onNavigate(`/medicine/${product.id}`)}
                      className="min-w-[165px] w-[165px] sm:min-w-[190px] sm:w-[190px] bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-3 flex flex-col shadow-sm cursor-pointer hover:border-primary transition-all relative"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                          Verified
                        </span>
                      </div>
                      <div className="mb-2.5">
                        <h3 className="font-semibold text-sm text-on-surface dark:text-zinc-100 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">
                          {product.grower_name || 'Unknown Company'}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-bold text-xs text-on-surface dark:text-zinc-100">
                          ₹{product.mrp.toFixed(2)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(`/medicine/${product.id}`);
                          }}
                          className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Featured Botanical Catalog Grid */}
            <section className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-base font-bold text-on-surface dark:text-zinc-100">
                  {selectedCategory === 'ALL'
                    ? 'Popular Medicines'
                    : `${selectedCategory} Formulations`}
                </h2>
                <span className="text-xs text-on-surface-variant">
                  {displayedProducts.length} verified items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onNavigate(`/medicine/${product.id}`)}
                    className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-4 shadow-sm hover:shadow flex flex-col justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <h3 className="font-semibold text-sm text-on-surface dark:text-zinc-100 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                        {product.grower_name || 'Unknown Company'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-surface-variant dark:border-zinc-800 flex items-center justify-between">
                      <span className="font-bold text-sm text-primary-container dark:text-emerald-400">
                        ₹{product.mrp.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(`/medicine/${product.id}`);
                        }}
                        className="min-h-[36px] px-3.5 rounded bg-primary hover:bg-primary/90 text-on-primary text-xs font-semibold shadow transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

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
