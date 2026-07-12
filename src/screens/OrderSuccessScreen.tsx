import React, { useEffect } from 'react';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

interface OrderSuccessScreenProps {
  onNavigate?: (route: string) => void;
  orderId?: string;
}

export const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({ onNavigate, orderId }) => {
  // Auto-scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-[100dvh] px-4 pt-16 md:pt-24 text-center pb-[120px] bg-surface dark:bg-zinc-950">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
        <CheckCircle className="w-12 h-12 text-primary absolute" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin-slow opacity-20"></div>
      </div>
      
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-on-surface dark:text-zinc-100 mb-2 tracking-tight">
        Order Placed Successfully!
      </h1>
      
      <p className="text-on-surface-variant dark:text-zinc-400 text-sm md:text-base max-w-md mx-auto mb-8">
        Thank you for choosing MedField. Your clinical-grade medicines are being prepared for dispatch.
      </p>

      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 w-full max-w-sm mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-surface-variant dark:border-zinc-800">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Order ID</span>
          <span className="font-mono text-sm font-bold text-on-surface dark:text-zinc-100">
            #{orderId?.split('-')[0] || 'ORD-XYZ'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Estimated Delivery</span>
          <span className="text-sm font-bold text-primary">Today by 9 PM</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          onClick={() => onNavigate && onNavigate(orderId ? `/orders/${orderId}` : '/orders')}
          className="flex-1 bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>Track Order</span>
        </button>
        
        <button
          onClick={() => onNavigate && onNavigate('/')}
          className="flex-1 bg-surface hover:bg-surface-container-highest dark:bg-zinc-800 dark:hover:bg-zinc-700 text-on-surface dark:text-zinc-100 border border-outline-variant dark:border-zinc-700 font-bold py-3.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
