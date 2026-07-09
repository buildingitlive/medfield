import React, { useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import type { MedicineProduct } from '../types';
import { mockProducts } from '../data/mockData';
import { VerifiedMark } from '../components/VerifiedMark';

interface SearchScreenProps {
  onNavigate: (route: string) => void;
  onAddToCart: (product: MedicineProduct) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onNavigate, onAddToCart }) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'OTC' | 'RX'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC'>('POPULAR');

  // Track quantities locally for the inline stepper
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const categories = ['ALL', 'Botanical', 'Cardiac', 'Immunology', 'Wellness'];

  const getQuantity = (productId: string) => quantities[productId] || 1;

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const filteredProducts = mockProducts
    .filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.genericName.toLowerCase().includes(query.toLowerCase());
      const matchesType =
        filterType === 'ALL' ||
        (filterType === 'RX' && product.requiresPrescription) ||
        (filterType === 'OTC' && !product.requiresPrescription);
      const matchesCategory =
        selectedCategory === 'ALL' || product.category === selectedCategory;

      return matchesQuery && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.price - b.price;
      if (sortBy === 'PRICE_DESC') return b.price - a.price;
      return 0;
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
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medicines, generic names, or formulations..."
          className="w-full min-h-[48px] bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-md pl-12 pr-4 text-sm text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary shadow-sm"
        />
      </div>

      {/* Type Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {(['ALL', 'OTC', 'RX'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`min-h-[36px] px-3.5 rounded text-xs font-semibold transition-colors ${
                filterType === type
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container dark:bg-zinc-800 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {type === 'ALL' ? 'All Items' : type === 'OTC' ? 'OTC Only' : 'Prescription (Rx)'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-on-surface-variant" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded text-xs font-semibold text-on-surface dark:text-zinc-100 px-3 py-1.5 focus:outline-none"
          >
            <option value="POPULAR">Sort: Featured</option>
            <option value="PRICE_ASC">Price: Low to High</option>
            <option value="PRICE_DESC">Price: High to Low</option>
          </select>
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
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest dark:bg-zinc-900 rounded-brand border border-surface-variant">
            <p className="text-sm font-semibold text-on-surface">No matching medications found</p>
            <p className="text-xs text-on-surface-variant mt-1">
              Try searching a different keyword or removing active filters.
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const qty = getQuantity(product.id);
            const originalPrice = product.price * 1.2;

            return (
              <div
                key={product.id}
                onClick={() => onNavigate(`/medicine/${product.id}`)}
                className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-4 shadow-sm hover:border-primary transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-20 h-20 rounded object-cover flex-shrink-0 bg-surface-container"
                  />

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-on-surface dark:text-zinc-100">
                        {product.name}
                      </span>
                      {product.requiresPrescription && (
                        <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Rx Required
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-on-surface-variant mb-1.5">
                      {product.genericName} • {product.dosage}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-primary-container">
                      <span className="font-semibold">{product.grower.name}</span>
                      <VerifiedMark size={14} />
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-surface-variant">
                  {/* Pricing matching Reference Design */}
                  <div className="text-left sm:text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-on-surface-variant line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                      <span className="text-[11px] font-bold text-on-primary bg-primary px-1.5 py-0.5 rounded">
                        Save 20%
                      </span>
                    </div>
                    <span className="text-lg font-bold text-primary-container dark:text-emerald-400">
                      ${product.price.toFixed(2)}
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
                        for (let i = 0; i < qty; i++) {
                          onAddToCart(product);
                        }
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
