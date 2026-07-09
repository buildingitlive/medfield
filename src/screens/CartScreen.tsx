import React from 'react';
import { Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import type { CartItem } from '../types';

interface CartScreenProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onNavigate: (route: string) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
}) => {
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const coldChainShipping = cart.length > 0 ? 12.00 : 0;
  const total = subtotal + coldChainShipping;

  const requiresPrescription = cart.some((i) => i.product.requiresPrescription);

  return (
    <main className="min-h-screen pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <h1 className="font-heading text-2xl font-bold text-on-surface dark:text-zinc-100 mb-1">
        Your Cart
      </h1>
      <p className="text-xs text-on-surface-variant dark:text-zinc-400 mb-6">
        {cart.reduce((sum, item) => sum + item.quantity, 0)} items selected for cold chain dispatch
      </p>

      {cart.length === 0 ? (
        <div className="bg-surface-container-lowest dark:bg-zinc-900 p-12 rounded-brand border border-surface-variant text-center my-8">
          <ShoppingBag className="w-12 h-12 text-outline-variant mx-auto mb-3" />
          <p className="font-semibold text-on-surface mb-2">Your MedField cart is empty</p>
          <button
            onClick={() => onNavigate('/')}
            className="min-h-[48px] px-6 rounded-md bg-primary-container text-on-primary font-semibold text-xs shadow mt-2 inline-flex items-center gap-1.5"
          >
            Explore Verified Field Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 p-4 rounded-md shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 rounded object-cover flex-shrink-0"
                  />
                  <div>
                    <h2 className="font-semibold text-sm text-on-surface dark:text-zinc-100">
                      {product.name}
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      {product.dosage} • ${product.price.toFixed(2)} unit
                    </p>
                    {product.requiresPrescription && (
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary">
                        Prescription Required
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-outline-variant rounded">
                    <button
                      onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center font-bold text-on-surface-variant"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-semibold">{quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-on-surface-variant"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => onRemoveItem(product.id)}
                    aria-label="Remove item"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-error hover:bg-error-container/20 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Reference Design: Delivery Time Banner */}
            <div className="bg-secondary-container/40 dark:bg-emerald-950/40 border border-secondary/30 rounded-md p-4 flex items-center gap-3">
              <Truck className="w-5 h-5 text-primary-container flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-on-surface dark:text-zinc-200">
                Arrives today by 9 PM
              </span>
            </div>
          </div>

          {/* Order Summary with Asymmetric Bottom-Left Radius */}
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 p-6 rounded-brand shadow-sm h-fit">
            <h2 className="font-heading text-lg font-bold text-on-surface dark:text-zinc-100 mb-4">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs text-on-surface-variant mb-4">
              <div className="flex justify-between">
                <span>Formulation Subtotal</span>
                <span className="font-semibold text-on-surface dark:text-zinc-100">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cold Chain Logistics</span>
                <span className="font-semibold text-on-surface dark:text-zinc-100">
                  ${coldChainShipping.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="border-t border-surface-variant dark:border-zinc-800 pt-4 mb-6 flex justify-between items-baseline">
              <span className="font-bold text-sm text-on-surface dark:text-zinc-100">
                Total Due
              </span>
              <span className="font-bold text-xl text-primary-container dark:text-emerald-400">
                ${total.toFixed(2)}
              </span>
            </div>

            {requiresPrescription && (
              <div className="bg-tertiary-container/30 border border-tertiary/20 p-3 rounded text-xs mb-4">
                <span className="font-semibold block text-tertiary">Prescription Check Required</span>
                Prescriptions must be verified prior to courier dispatch.
              </div>
            )}

            <button
              onClick={() => onNavigate('/checkout')}
              className="w-full min-h-[48px] bg-primary-container hover:bg-primary text-on-primary font-semibold rounded-md flex items-center justify-center gap-2 shadow transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
