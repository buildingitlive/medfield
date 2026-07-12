import React, { useState } from 'react';
import {
  ArrowLeft,
  Home,
  Truck,
  CreditCard,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAddresses } from '../hooks/useAddresses';
import { useOrders } from '../hooks/useOrders';
import type { PaymentMethod } from '../types/database';

interface CheckoutScreenProps {
  onNavigate: (route: string) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  onNavigate,
}) => {
  const { items: cart, subtotal, clearCart } = useCart();
  const { defaultAddress } = useAddresses();
  const { placeOrder } = useOrders();

  const [paymentMethod] = useState<PaymentMethod>('COD');
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const deliveryFee = cart.length > 0 ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (cart.length === 0 || !defaultAddress) return;
    
    setIsPlacingOrder(true);
    setErrorMsg(null);

    const { error, orderId } = await placeOrder({
      cartItems: cart,
      address: defaultAddress,
      paymentMethod,
      deliveryFee,
    });

    setIsPlacingOrder(false);

    if (error) {
      setErrorMsg(error);
    } else {
      await clearCart();
      onNavigate(`/order-success/${orderId}`);
    }
  };

  return (
    <main className="min-h-screen pb-44 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => onNavigate('/cart')}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-heading text-2xl font-bold text-primary dark:text-emerald-400">
          Checkout
        </h1>
      </div>

      {errorMsg && (
        <div className="w-full mb-4 p-3 rounded-md bg-error-container/30 border border-error/20 text-xs text-error font-semibold text-center">
          {errorMsg}
        </div>
      )}

      <div className="space-y-4">
        {/* Delivery Address Card */}
        <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-sm text-on-surface dark:text-zinc-100">
              <Home className="w-4 h-4 text-primary" />
              <h2>Delivery Address</h2>
            </div>
            <button
              onClick={() => onNavigate('/addresses')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Change
            </button>
          </div>
          <div className="pl-6 text-xs text-on-surface-variant leading-relaxed">
            {defaultAddress ? (
              <>
                <p className="font-semibold text-on-surface dark:text-zinc-100 mb-0.5">
                  {defaultAddress.recipient_name} • {defaultAddress.label}
                </p>
                <p>{defaultAddress.street}</p>
                <p>
                  {defaultAddress.city}, {defaultAddress.state} {defaultAddress.zip}
                </p>
                <p className="mt-1">
                  {defaultAddress.phone || 'No phone provided'}
                </p>
              </>
            ) : (
              <p className="text-error font-semibold py-2">Please add a delivery address to continue.</p>
            )}
          </div>
        </section>

        {/* Delivery Time Card */}
        <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-sm text-on-surface dark:text-zinc-100 mb-3">
            <Truck className="w-4 h-4 text-primary" />
            <h2>Delivery Time</h2>
          </div>
          <div className="border border-primary bg-primary/5 rounded-md p-3 flex items-center justify-between text-xs font-semibold text-on-surface dark:text-zinc-100">
            <span>Today by 9 PM</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
        </section>

        {/* Payment Method Section */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-on-surface dark:text-zinc-100">
            <CreditCard className="w-4 h-4 text-primary" />
            <h2>Payment Method</h2>
          </div>

          <button
            type="button"
            className="w-full p-4 rounded-md border text-center flex flex-col items-center gap-2 bg-surface-container-lowest dark:bg-zinc-900 border-primary border-2 shadow-sm"
          >
            <CreditCard className="w-6 h-6 text-primary" />
            <span className="text-xs font-semibold text-on-surface dark:text-zinc-100">
              Cash / Card on Delivery
            </span>
          </button>
        </section>

        {/* Order Summary Collapsible Section */}
        <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 shadow-sm">
          <button
            type="button"
            onClick={() => setSummaryOpen(!summaryOpen)}
            className="w-full flex items-center justify-between font-bold text-sm text-on-surface dark:text-zinc-100"
          >
            <span>Order Summary</span>
            {summaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {summaryOpen && (
            <div className="mt-4 space-y-2.5 text-xs text-on-surface-variant border-t border-surface-variant dark:border-zinc-800 pt-3">
              <div className="flex justify-between">
                <span>Item Total ({cart.reduce((sum, i) => sum + i.quantity, 0)} Items)</span>
                <span className="font-semibold text-on-surface dark:text-zinc-100">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-on-surface dark:text-zinc-100">
                  ₹{deliveryFee.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Sticky Place Order Bottom Bar */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 bg-surface-container-lowest dark:bg-zinc-900 border-t border-surface-variant dark:border-zinc-800 p-4 pb-safe z-40 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-on-surface-variant block">Amount Payable</span>
            <span className="text-2xl font-bold text-on-surface dark:text-zinc-100">
              ₹{total.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={cart.length === 0 || !defaultAddress || isPlacingOrder}
            className="min-h-[48px] px-8 rounded-md bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shadow flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isPlacingOrder ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
};
