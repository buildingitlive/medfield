import React, { useState } from 'react';
import { Package, Truck, RotateCcw, Eye, Loader2, FileImage, XCircle } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { supabase } from '../lib/supabase';

interface OrdersScreenProps {
  onNavigate: (route: string) => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ onNavigate }) => {
  const { ongoingOrders, pastOrders, loading } = useOrders();
  const [activeTab, setActiveTab] = useState<'ONGOING' | 'PAST'>('ONGOING');

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
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest dark:bg-zinc-900 rounded-brand border border-surface-variant">
            <Package className="w-10 h-10 text-outline-variant mx-auto mb-2" />
            <p className="text-sm font-semibold text-on-surface">
              No {activeTab.toLowerCase()} orders found
            </p>
          </div>
        ) : (
          displayedOrders.map((order) => {
            const isOngoing = order.status.toLowerCase() !== 'delivered' && order.status.toLowerCase() !== 'cancelled';
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
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      order.status.toLowerCase() === 'cancelled'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      {order.status.toLowerCase() === 'cancelled'
                        ? <XCircle className="w-3 h-3" />
                        : <span className="w-2 h-2 rounded-full bg-primary" />
                      }
                      <span>{order.status}</span>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-semibold text-on-surface dark:text-zinc-100">
                        {order.items.length > 0 ? `${order.items.length} items` : 'Prescription Order'}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Placed on: {new Date(order.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {isOngoing
                          ? `Estimated arrival: ${order.estimated_delivery || 'Pending'}`
                          : order.status.toLowerCase() === 'cancelled'
                            ? `Cancelled on: ${new Date(order.updated_at || order.created_at).toLocaleDateString()}`
                            : `Delivered on: ${new Date(order.updated_at || order.created_at).toLocaleDateString()}`}
                      </p>

                      {/* Cancellation reason */}
                      {order.status.toLowerCase() === 'cancelled' && (order as any).notes && (order as any).notes.startsWith('[Cancelled]') && (
                        <div className="mt-2 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg">
                          <p className="text-xs text-red-700 dark:text-red-400 font-medium">
                            Reason: {(order as any).notes.replace('[Cancelled] ', '')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="text-right flex flex-col items-end gap-0.5">
                    {order.discount_percent > 0 ? (
                      <>
                        <span className="text-xs text-on-surface-variant line-through">
                          ₹{(order.total / (1 - order.discount_percent / 100)).toFixed(2)}
                        </span>
                        <span className="text-[10px] font-bold text-secondary-container bg-primary/10 px-1.5 py-0.5 rounded-full">
                          {order.discount_percent}% OFF
                        </span>
                        <span className="text-lg font-bold text-primary dark:text-emerald-400">
                          ₹{order.total.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-primary dark:text-emerald-400">
                        {order.total > 0 ? `₹${order.total.toFixed(2)}` : 'Pending'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Prescription Image Preview */}
                {order.prescription_url && (
                  <div className="mt-2 flex items-center gap-3 p-3 bg-surface-container-low dark:bg-zinc-800/50 rounded-xl border border-surface-variant/50">
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-surface-variant bg-white flex-shrink-0">
                      <img
                        src={supabase.storage.from('prescriptions').getPublicUrl(order.prescription_url).data.publicUrl}
                        alt="Prescription"
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => window.open(supabase.storage.from('prescriptions').getPublicUrl(order.prescription_url!).data.publicUrl, '_blank')}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                        <FileImage className="w-3.5 h-3.5 text-primary" />
                        Prescription Uploaded
                      </p>
                      <button
                        onClick={() => window.open(supabase.storage.from('prescriptions').getPublicUrl(order.prescription_url!).data.publicUrl, '_blank')}
                        className="text-[11px] text-primary font-medium mt-0.5 hover:underline"
                      >
                        View full image →
                      </button>
                    </div>
                  </div>
                )}

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
