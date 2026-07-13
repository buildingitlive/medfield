import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowUpDown, ChevronDown, Check, Loader2 } from 'lucide-react';
import type { Product } from '../types/database';
import { useProducts } from '../hooks/useProducts';
import { VerifiedMark } from '../components/VerifiedMark';

interface SearchScreenProps {
  onNavigate: (route: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onNavigate, onAddToCart }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC'>('POPULAR');
  const [sortOpen, setSortOpen] = useState(false);

  // Track quantities locally for the inline stepper
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const searchInputRef = useRef<HTMLInputElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Auto-focus the search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = ['ALL', 'Botanical', 'Cardiac', 'Immunology', 'Wellness'];

  const sortOptions: { value: 'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC'; label: string }[] = [
    { value: 'POPULAR', label: 'Featured' },
    { value: 'PRICE_ASC', label: 'Price: Low to High' },
    { value: 'PRICE_DESC', label: 'Price: High to Low' },
  ];

  const getQuantity = (productId: string) => quantities[productId] || 1;

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const { products: filteredProducts, loading } = useProducts({
    search: query,
    category: selectedCategory === 'ALL' ? undefined : selectedCategory,
    sortBy,
  });

  return (
    <main className="min-h-screen pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-on-surface dark:text-zinc-100 mb-1">
          Catalog Search
        </h1>
        <p className="text-xs text-on-surface-variant dark:text-zinc-400">
          Find clinical-grade formulations verified from source to pharmacy.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative mb-4">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-on-surface-variant" />
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medicines, generic names, or formulations..."
          className="w-full min-h-[48px] bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-md pl-12 pr-4 text-sm text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary shadow-sm"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 mb-4">

        {/* Custom Sort Dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-md px-3 py-2 text-xs font-semibold text-on-surface dark:text-zinc-100 hover:border-primary transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-on-surface-variant" />
            <span>Sort: {sortOptions.find((o) => o.value === sortBy)?.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
          </button>

          {sortOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-48 bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-md shadow-lg z-30 overflow-hidden">
              {[...sortOptions].sort((a, b) => (a.value === sortBy ? -1 : b.value === sortBy ? 1 : 0)).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortBy(opt.value);
                    setSortOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-xs font-semibold text-left flex items-center justify-between transition-colors ${
                    sortBy === opt.value
                      ? 'bg-primary/10 text-primary'
                      : 'text-on-surface dark:text-zinc-100 hover:bg-surface-container dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>{opt.label}</span>
                  {sortBy === opt.value && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selectedCategory === cat
                ? 'bg-secondary-container text-on-secondary-container font-bold'
                : 'bg-surface-container dark:bg-zinc-900 text-on-surface-variant border border-outline-variant/60'
            }`}
          >
            {cat === 'ALL' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest dark:bg-zinc-900 rounded-brand border border-surface-variant">
            <p className="text-sm font-semibold text-on-surface">No matching medications found</p>
            <p className="text-xs text-on-surface-variant mt-1">
              Try searching a different keyword or removing active filters.
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const qty = getQuantity(product.id);
            const originalPrice = product.mrp > product.price ? product.mrp : product.price;
            const discountPercent = originalPrice > product.price ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;

            return (
              <div
                key={product.id}
                onClick={() => onNavigate(`/medicine/${product.id}`)}
                className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-4 shadow-sm hover:border-primary transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={product.image_url || ''}
                    alt={product.name}
                    className="w-20 h-20 rounded object-cover flex-shrink-0 bg-surface-container"
                  />

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-on-surface dark:text-zinc-100">
                        {product.name}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant mb-1.5">
                      {product.generic_name} • {product.dosage}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-primary-container">
                      <span className="font-semibold">{product.grower_name || 'Verified Supplier'}</span>
                      <VerifiedMark size={14} />
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-surface-variant">
                  {/* Pricing matching Reference Design */}
                    <div className="flex flex-col items-end">
                      {originalPrice > product.price && (
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] line-through text-on-surface-variant">
                            ₹{originalPrice.toFixed(2)}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-primary text-on-primary rounded text-[10px]">
                            Save {discountPercent}%
                          </span>
                        </div>
                      )}
                      <span className="font-bold text-sm text-primary-container dark:text-emerald-400">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Inline Quantity Stepper + Add Button matching Reference Design */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center border border-outline-variant dark:border-zinc-700 rounded bg-surface dark:bg-zinc-800">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-8 h-8 flex items-center justify-center font-bold text-on-surface hover:bg-surface-container"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-on-surface">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, 1)}
                        className="w-8 h-8 flex items-center justify-center font-bold text-on-surface hover:bg-surface-container"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(product, qty);
                      }}
                      className="min-h-[36px] px-4 rounded bg-primary text-on-primary text-xs font-semibold shadow hover:bg-primary-container transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
};
