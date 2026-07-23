import React from 'react';
import { ArrowLeft, Share2, Pill, Loader2, MessageCircle, Bot } from 'lucide-react';

import { useProducts } from '../hooks/useProducts';
import { VerifiedMark } from '../components/VerifiedMark';

interface MedicineDetailScreenProps {
  productId: string;
  onNavigate: (route: string) => void;
}

export const MedicineDetailScreen: React.FC<MedicineDetailScreenProps> = ({
  productId,
  onNavigate,
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
        <p className="text-on-surface-variant font-medium mb-4">Medication not found</p>
        <button
          onClick={() => onNavigate('/')}
          className="px-4 py-2 bg-primary-container text-on-primary rounded text-xs font-semibold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-44 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onNavigate('BACK')}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
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

      {/* Medicine Info Card */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-6 mb-6">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-primary-container mb-2">
          <span>{product.grower_name || 'Verified Supplier'}</span>
          <VerifiedMark size={16} />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface dark:text-zinc-100 mb-1">
          {product.name}
        </h1>
        {product.generic_name && (
          <p className="text-sm text-on-surface-variant mb-4">
            {product.generic_name}
          </p>
        )}

        <div className="flex items-baseline justify-between pt-4 border-t border-surface-variant dark:border-zinc-800">
          <div>
            <span className="text-3xl font-bold text-primary-container dark:text-emerald-400">
              ₹{product.mrp.toFixed(2)}
            </span>
            <span className="text-xs text-on-surface-variant block mt-0.5">
              MRP • INCLUSIVE OF ALL TAXES
            </span>
          </div>
          {product.category && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10">
              {product.category}
            </span>
          )}
        </div>
      </div>

      {/* MedBuddy AI Chat Placeholder */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-sm font-bold text-on-surface dark:text-zinc-100">
              MedBuddy AI
            </h2>
            <p className="text-[11px] text-on-surface-variant">
              Your personal medicine assistant
            </p>
          </div>
        </div>

        <div className="bg-surface-container-low dark:bg-zinc-800 rounded-lg p-4 mb-4 min-h-[120px] flex flex-col items-center justify-center text-center">
          <MessageCircle className="w-8 h-8 text-on-surface-variant/30 mb-2" />
          <p className="text-sm text-on-surface-variant">
            Have questions about <span className="font-semibold text-on-surface dark:text-zinc-200">{product.name}</span>?
          </p>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Ask about dosage, side effects, interactions, and more.
          </p>
        </div>

        <button
          disabled
          className="w-full min-h-[48px] rounded-lg bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center gap-2 border border-primary/20 cursor-not-allowed opacity-70"
        >
          <Bot className="w-4 h-4" />
          Ask MedBuddy — Coming Soon
        </button>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 bg-surface-container-lowest dark:bg-zinc-900 border-t border-surface-variant dark:border-zinc-800 p-4 pb-safe z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-lg font-bold text-primary-container dark:text-emerald-400 block">
              ₹{product.mrp.toFixed(2)}
            </span>
            <button
              onClick={() => onNavigate('/prescriptions')}
              className="text-xs text-primary hover:underline font-semibold"
            >
              My Prescriptions
            </button>
          </div>
          <button
            onClick={() => onNavigate('/place-order')}
            className="min-h-[48px] px-6 rounded-md bg-primary-container hover:bg-primary text-on-primary font-semibold text-xs shadow-md flex items-center gap-2 transition-all"
          >
            <Pill className="w-4 h-4" />
            <span>Order Now</span>
          </button>
        </div>
      </div>
    </main>
  );
};
