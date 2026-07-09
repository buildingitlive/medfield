import React from 'react';
import { ArrowLeft, Phone, HelpCircle } from 'lucide-react';
import type { Order } from '../types';

interface OrderTrackingScreenProps {
  order?: Order;
  onNavigate: (route: string) => void;
}

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ order, onNavigate }) => {
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-on-surface-variant font-medium mb-4">Order record not found</p>
        <button
          onClick={() => onNavigate('/orders')}
          className="px-4 py-2 bg-primary-container text-on-primary rounded text-xs font-semibold"
        >
          Return to Orders
        </button>
      </div>
    );
  }

  const steps = [
    { label: 'Order Placed', time: '10:45 AM, Oct 24', completed: true },
    { label: 'Prescription Verified', time: '11:15 AM, Oct 24', completed: true },
    { label: 'Out for Delivery', time: 'Driver assigned', completed: true },
    { label: 'Arriving Soon', time: 'Est. 12:30 PM', completed: false },
    { label: 'Delivered', time: 'Pending', completed: false },
  ];

  return (
    <main className="min-h-screen pb-28 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onNavigate('/orders')}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => {}}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface dark:text-zinc-100 mb-1">
          Track Order
        </h1>
        <p className="text-xs text-on-surface-variant">Order #{order.id}</p>
      </div>

      {/* Delivery Status Timeline Card */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-6 mb-6 shadow-sm">
        <h2 className="font-heading text-base font-bold text-on-surface dark:text-zinc-100 mb-6">
          Delivery Status
        </h2>

        <div className="space-y-6 relative before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-outline-variant/40">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4 relative z-10">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  step.completed
                    ? 'bg-primary border-primary'
                    : 'bg-surface-container-high border-outline-variant/60'
                }`}
              />
              <div>
                <h3
                  className={`text-sm font-semibold ${
                    step.completed
                      ? 'text-on-surface dark:text-zinc-100'
                      : 'text-on-surface-variant dark:text-zinc-400'
                  }`}
                >
                  {step.label}
                </h3>
                <p className="text-xs text-on-surface-variant">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courier Profile Card matching Reference Design */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-4 mb-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Alex Mercer"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-sm text-on-surface dark:text-zinc-100">
              Alex Mercer
            </h3>
            <p className="text-xs text-on-surface-variant">MedField Courier</p>
          </div>
        </div>

        <a
          href="tel:+15550001234"
          className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center shadow hover:bg-primary-container transition-colors"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>

      {/* Order Details Itemized Section */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-5 shadow-sm">
        <h2 className="font-heading text-base font-bold text-on-surface dark:text-zinc-100 mb-4">
          Order Details
        </h2>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-xs">
              <div>
                <span className="font-semibold text-on-surface dark:text-zinc-100 block">
                  {item.product.name}
                </span>
                <span className="text-on-surface-variant">Qty: {item.quantity}</span>
              </div>
              <span className="font-bold text-on-surface dark:text-zinc-100">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
