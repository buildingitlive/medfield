import React, { useState } from 'react';
import { Package, Truck, RotateCcw, Eye } from 'lucide-react';
import type { Order } from '../types';

interface OrdersScreenProps {
  orders: Order[];
  onNavigate: (route: string) => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ orders, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'ONGOING' | 'PAST'>('ONGOING');

  // Categorize orders into ongoing vs past
  const ongoingOrders = orders.filter((o) => o.status !== 'Delivered');
  const pastOrders = orders.filter((o) => o.status === 'Delivered');

  const displayedOrders = activeTab === 'ONGOING' ? ongoingOrders : pastOrders;

  return (
    <main className="min-h-screen pb-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div className="mb-4">
        <h1 className="font-heading text-3xl font-bold text-on-surface dark:text-zinc-100 mb-1">
          Orders
        </h1>
        <p className="text-xs text-on-surface-variant dark:text-zinc-400">
          Track your current deliveries or review past prescriptions.
        </p>
      </div>

      {/* Ongoing / Past Tabs matching reference design */}
      <div className="flex border-b border-surface-variant dark:border-zinc-800 mb-6">
        <button
          onClick={() => setActiveTab('ONGOING')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'ONGOING'
              ? 'border-primary text-primary dark:text-emerald-400'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Ongoing ({ongoingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('PAST')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'PAST'
              ? 'border-primary text-primary dark:text-emerald-400'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Past ({pastOrders.length})
        </button>
      </div>

      <div className="space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest dark:bg-zinc-900 rounded-brand border border-surface-variant">
            <Package className="w-10 h-10 text-outline-variant mx-auto mb-2" />
            <p className="text-sm font-semibold text-on-surface">
              No {activeTab.toLowerCase()} orders found
            </p>
          </div>
        ) : (
          displayedOrders.map((order) => {
            const isOngoing = order.status !== 'Delivered';
            return (
              <div
                key={order.id}
                className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 p-5 rounded-brand shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-on-surface-variant block mb-1">
                      Order #{order.id}
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary-container text-on-secondary-container">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span>{order.status}</span>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-semibold text-on-surface dark:text-zinc-100">
                        {order.items.length} items
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {isOngoing
                          ? `Estimated arrival: ${order.estimatedDelivery}`
                          : `Delivered on: ${order.date}`}
                      </p>
                    </div>
                  </div>

                  <span className="text-lg font-bold text-primary-container dark:text-emerald-400">
                    ${order.total.toFixed(2)}
                  </span>
                </div>

                {/* Action Buttons matching Reference Design */}
                <div className="pt-3 border-t border-surface-variant dark:border-zinc-800 flex items-center gap-3">
                  {isOngoing ? (
                    <button
                      onClick={() => onNavigate(`/orders/${order.id}`)}
                      className="flex-1 min-h-[44px] bg-primary-container hover:bg-primary text-on-primary font-semibold text-xs rounded-md shadow flex items-center justify-center gap-2 transition-all"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Track Delivery</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => onNavigate('/cart')}
                        className="flex-1 min-h-[44px] border border-outline-variant hover:border-primary text-on-surface dark:text-zinc-100 font-semibold text-xs rounded-md flex items-center justify-center gap-2 transition-all"
                      >
                        <RotateCcw className="w-4 h-4 text-primary" />
                        <span>Reorder</span>
                      </button>
                      <button
                        onClick={() => onNavigate(`/orders/${order.id}`)}
                        className="flex-1 min-h-[44px] border border-outline-variant hover:border-primary text-on-surface dark:text-zinc-100 font-semibold text-xs rounded-md flex items-center justify-center gap-2 transition-all"
                      >
                        <Eye className="w-4 h-4 text-on-surface-variant" />
                        <span>View Details</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
};
