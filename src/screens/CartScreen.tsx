import React from 'react';
import { Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface CartScreenProps {
  onNavigate: (route: string) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  onNavigate,
}) => {
  const { items: cart, updateQuantity, removeItem, subtotal } = useCart();
  const visualDeliveryFee = cart.length > 0 ? 50.00 : 0;
  const coldChainShipping = 0;
  const total = subtotal + coldChainShipping;

  return (
    <main className="min-h-screen pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <h1 className="font-heading text-2xl font-bold text-on-surface dark:text-zinc-100 mb-1">
        Your Cart
      </h1>
      <p className="text-xs text-on-surface-variant dark:text-zinc-400 mb-6">
        {cart.reduce((sum, item) => sum + item.quantity, 0)} items ready for delivery
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
            {cart.map(({ id, product, quantity }) => (
              <div
                key={product.id}
                className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-md shadow-sm overflow-hidden"
              >
                <div className="flex gap-3 p-3">
                  {/* Product Image */}
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-[72px] h-[72px] rounded-md object-cover flex-shrink-0 bg-surface-container"
                  />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm text-on-surface dark:text-zinc-100 leading-tight line-clamp-1">
                      {product.name}
                    </h2>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-1">
                      {product.generic_name}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {product.dosage}
                    </p>
                  </div>
                </div>

                {/* Bottom row: Price + Quantity Controls */}
                <div className="flex items-center justify-between px-3 pb-3 pt-0">
                  <span className="font-bold text-sm text-primary-container dark:text-emerald-400">
                    ₹{(product.price * quantity).toFixed(2)}
                    {quantity > 1 && (
                      <span className="text-[10px] font-normal text-on-surface-variant ml-1">
                        (₹{product.price.toFixed(0)} × {quantity})
                      </span>
                    )}
                  </span>

                  <div className="flex items-center border border-outline-variant dark:border-zinc-700 rounded-md overflow-hidden">
                    {/* Delete/Minus button */}
                    <button
                      onClick={() => {
                        if (quantity <= 1) {
                          removeItem(id);
                        } else {
                          updateQuantity(id, quantity - 1);
                        }
                      }}
                      className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
                    >
                      {quantity <= 1 ? (
                        <Trash2 className="w-3.5 h-3.5 text-error" />
                      ) : (
                        <span className="font-bold text-sm">−</span>
                      )}
                    </button>

                    <span className="w-9 text-center text-xs font-bold text-on-surface dark:text-zinc-100 border-x border-outline-variant dark:border-zinc-700 h-9 flex items-center justify-center">
                      {quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(id, quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
                    >
                      <span className="font-bold text-sm">+</span>
                    </button>
                  </div>
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
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <div className="flex items-center gap-2">
                  <span className="text-on-surface-variant line-through text-[10px]">
                    ₹{visualDeliveryFee.toFixed(2)}
                  </span>
                  <span className="font-semibold text-primary">
                    FREE
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-surface-variant dark:border-zinc-800 pt-4 mb-6 flex justify-between items-baseline">
              <span className="font-bold text-sm text-on-surface dark:text-zinc-100">
                Total Due
              </span>
              <span className="font-bold text-xl text-primary-container dark:text-emerald-400">
                ₹{total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => onNavigate('/checkout')}
              className="w-full min-h-[48px] bg-primary hover:bg-primary/90 text-on-primary font-semibold rounded-md flex items-center justify-center gap-2 shadow transition-all"
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
