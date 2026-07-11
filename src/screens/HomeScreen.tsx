import React, { useState } from 'react';
import {
  Search,
  Mic,
  MapPin,
  Truck,
  FileText,
  Pill,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Lock,
  Headphones,
  Plus,
  Loader2,
} from 'lucide-react';
import type { Product } from '../types/database';
import { useProducts } from '../hooks/useProducts';
import { useAddresses } from '../hooks/useAddresses';
import { VerifiedMark } from '../components/VerifiedMark';

interface HomeScreenProps {
  onNavigate: (route: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
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

  return (
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
        {/* Delivery Banner */}
        <div className="bg-primary-container text-on-primary-container rounded-brand p-4 flex items-start sm:items-center gap-3.5 shadow-sm border border-primary/20">
          <Truck className="w-7 h-7 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-bold mb-0.5">
              Order before 6:00 PM for delivery today
            </p>
            <p className="text-xs opacity-90">
              Available for select clinical prescriptions in your area.
            </p>
          </div>
        </div>

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
            onClick={() => onNavigate('/prescription-upload')}
            className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-6 flex flex-col gap-4 text-left shadow-sm hover:shadow transition-all relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-on-surface dark:text-zinc-100 mb-1">
                Upload Prescription
              </h2>
              <p className="text-xs text-on-surface-variant">
                Fast tracking for verified clinical orders.
              </p>
            </div>
            <div className="mt-auto pt-2 flex items-center gap-1.5 text-primary text-xs font-bold">
              <span>Upload Now</span>
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
                      <div className="w-full aspect-square bg-surface-container-low dark:bg-zinc-800 rounded mb-2.5 overflow-hidden flex items-center justify-center p-2">
                        <img
                          src={product.image_url || ''}
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <h3 className="font-semibold text-xs text-on-surface dark:text-zinc-100 truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-on-surface-variant mb-3">
                        <span>{product.dosage}</span>
                        <VerifiedMark size={13} />
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-bold text-xs text-on-surface dark:text-zinc-100">
                          ₹{product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                          }}
                          className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
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
                      <div className="w-full h-36 bg-surface-container-low dark:bg-zinc-800 rounded overflow-hidden mb-3">
                        <img
                          src={product.image_url || ''}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-primary-container mb-0.5">
                        <span>{product.grower_name || 'Verified Supplier'}</span>
                        <VerifiedMark size={14} />
                      </div>
                      <h3 className="font-semibold text-sm text-on-surface dark:text-zinc-100 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant line-clamp-1">
                        {product.generic_name} • {product.dosage}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-surface-variant dark:border-zinc-800 flex items-center justify-between">
                      <span className="font-bold text-sm text-primary-container dark:text-emerald-400">
                        ₹{product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="min-h-[36px] px-3.5 rounded bg-primary hover:bg-primary/90 text-on-primary text-xs font-semibold shadow transition-all"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Trust Strip */}
        <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-4 flex flex-col sm:flex-row justify-around items-center gap-4 mt-6">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold">FDA Certified</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-outline-variant" />
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Lock className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold">Secure Checkout</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-outline-variant" />
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Headphones className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold">24/7 Support (9389407550)</span>
          </div>
        </section>
      </div>
    </main>
  );
};
