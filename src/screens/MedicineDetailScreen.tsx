import React from 'react';
import { ArrowLeft, ShieldCheck, Share2, CheckCircle2, ShoppingCart, Loader2 } from 'lucide-react';
import type { Product } from '../types/database';
import { useProducts } from '../hooks/useProducts';
import { VerifiedMark } from '../components/VerifiedMark';

interface MedicineDetailScreenProps {
  productId: string;
  onNavigate: (route: string) => void;
  onAddToCart: (product: Product) => void;
}

export const MedicineDetailScreen: React.FC<MedicineDetailScreenProps> = ({
  productId,
  onNavigate,
  onAddToCart,
}) => {
  const { products, loading } = useProducts();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-on-surface-variant font-medium mb-4">Medication assay not found</p>
        <button
          onClick={() => onNavigate('/')}
          className="px-4 py-2 bg-primary-container text-on-primary rounded text-xs font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const mrpPrice = (product.mrp || product.price).toFixed(2);

  return (
    <main className="min-h-screen pb-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onNavigate('BACK')}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {product.requires_prescription && (
            <span className="bg-primary text-on-primary text-[11px] font-bold px-3 py-1 rounded-full">
              RX REQUIRED
            </span>
          )}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
              }
            }}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Image Card */}
      <div className="w-full h-72 sm:h-96 bg-surface-container-low dark:bg-zinc-900 rounded-brand overflow-hidden mb-6 flex items-center justify-center border border-surface-variant relative shadow-sm">
        <img
          src={product.image_url || ''}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title & Grower */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-primary-container mb-1">
          <span>By {product.grower_name || 'Verified Supplier'}</span>
          <VerifiedMark size={16} />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface dark:text-zinc-100 mb-1">
          {product.name}
        </h1>
        <p className="text-xs text-on-surface-variant">
          {product.generic_name} • Formulation Batch #{product.batch_number || 'N/A'}
        </p>
      </div>

      {/* Composition & Pack Size Card */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-md p-4 mb-6 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-primary-container mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-xs text-on-surface dark:text-zinc-100">
              Composition
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {product.generic_name} ({product.dosage})
            </p>
          </div>
        </div>
        <div className="border-t border-surface-variant dark:border-zinc-800 pt-3 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary-container mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-xs text-on-surface dark:text-zinc-100">
              Pack Size
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              15 Capsules / Strip • Tamper-evident clinical foil seal
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Info Block */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs line-through text-on-surface-variant">MRP ₹{mrpPrice}</span>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-secondary-container px-2 py-0.5 rounded-full">
            Save ₹{(product.mrp - product.price).toFixed(2)}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-bold text-primary-container dark:text-emerald-400">
              ₹{product.price.toFixed(2)}
            </span>
            <span className="text-xs text-on-surface-variant block mt-0.5">
              INCLUSIVE OF ALL TAXES
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
          </span>
        </div>
      </div>

      {/* Clinical Assay & HPLC Profile Details */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-md p-5 mb-8">
        <h2 className="font-heading text-sm font-bold text-on-surface dark:text-zinc-100 mb-3">
          Pharmacological Profile & Cultivation Metadata
        </h2>
        <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
          {product.description}
        </p>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-surface-container-low dark:bg-zinc-800 p-3 rounded">
            <span className="text-on-surface-variant block">Terpene Profile</span>
            <span className="font-semibold text-on-surface dark:text-zinc-100">Myrcene / Limonene Dominant</span>
          </div>
          <div className="bg-surface-container-low dark:bg-zinc-800 p-3 rounded">
            <span className="text-on-surface-variant block">Extraction Purity</span>
            <span className="font-semibold text-on-surface dark:text-zinc-100">99.4% HPLC Certified</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest dark:bg-zinc-900 border-t border-surface-variant dark:border-zinc-800 p-4 pb-safe z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-lg font-bold text-primary-container dark:text-emerald-400 block">
              ₹{product.price.toFixed(2)}
            </span>
            <button
              onClick={() => onNavigate('/cart')}
              className="text-xs text-primary hover:underline font-semibold"
            >
              View Cart
            </button>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.in_stock}
            className="min-h-[48px] px-6 rounded-md bg-primary-container hover:bg-primary text-on-primary font-semibold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </main>
  );
};
