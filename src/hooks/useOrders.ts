import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { OrderWithItems, Address, CartItemWithProduct, PaymentMethod } from '../types/database';

const CACHE_KEY = 'medfield_cached_orders';

function cacheOrders(orders: OrderWithItems[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(orders));
  } catch { /* ignore */ }
}

function getCachedOrders(): OrderWithItems[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useOrders() {
  const { user, isOnline } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>(getCachedOrders);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user || !isOnline) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*),
        order_tracking_steps(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mapped: OrderWithItems[] = data.map((o: any) => ({
        ...o,
        items: o.order_items || [],
        tracking_steps: (o.order_tracking_steps || []).sort(
          (a: any, b: any) => a.step_order - b.step_order
        ),
      }));

      setOrders(mapped);
      cacheOrders(mapped);
    }

    setLoading(false);
  }, [user, isOnline]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const placeOrder = useCallback(
    async (params: {
      cartItems: CartItemWithProduct[];
      address: Address;
      paymentMethod: PaymentMethod;
      deliveryFee: number;
    }): Promise<{ orderId: string | null; error: string | null }> => {
      if (!user) return { orderId: null, error: 'Not authenticated' };

      const { cartItems, address, paymentMethod, deliveryFee } = params;
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const total = subtotal + deliveryFee;

      // 1. Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'Order Placed',
          total,
          delivery_fee: deliveryFee,
          estimated_delivery: 'Today by 9 PM',
          payment_method: paymentMethod,
          address_snapshot: {
            recipient_name: address.recipient_name,
            phone: address.phone,
            label: address.label,
            street: address.street,
            city: address.city,
            state: address.state,
            zip: address.zip,
          },
        } as any)
        .select()
        .single();

      if (orderError || !order) {
        return { orderId: null, error: orderError?.message || 'Failed to create order' };
      }

      // 2. Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_snapshot: {
          name: item.product.name,
          dosage: item.product.dosage,
          image_url: item.product.image_url,
          grower_name: item.product.grower_name,
        },
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      await supabase.from('order_items').insert(orderItems as any);

      // 3. Create initial tracking step
      await supabase.from('order_tracking_steps').insert({
        order_id: order.id,
        title: 'Order Placed & Prescription Verified',
        description: 'Order confirmed by MedField Clinical Pharmacy Desk',
        timestamp: new Date().toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        completed: true,
        step_order: 1,
      } as any);

      // 4. Emit order placed notifications (for Admin and Customer)
      const shortId = order.id.split('-')[0];
      await supabase.from('notifications').insert([
        {
          recipient_type: 'admin',
          title: `New Order Placed #${shortId} 📦`,
          description: `New order placed by customer for ₹${total.toLocaleString('en-IN')}.`,
          type: 'order_placed',
          link: '/orders',
          is_read: false,
        },
        {
          recipient_type: 'user',
          recipient_id: user.id,
          title: 'Order Placed Successfully! ✅',
          description: `Your order #${shortId} has been received and is undergoing clinical verification.`,
          type: 'order_placed',
          link: '/orders',
          is_read: false,
        },
      ]);

      // 5. Refresh orders list
      await fetchOrders();

      return { orderId: order.id, error: null };
    },
    [user, fetchOrders]
  );

  const cancelOrder = useCallback(
    async (orderId: string): Promise<boolean> => {
      if (!user) return false;
      const { error } = await supabase
        .from('orders')
        .update({ status: 'Cancelled' })
        .eq('id', orderId)
        .eq('user_id', user.id);
      
      if (!error) {
        await fetchOrders();
        return true;
      }
      return false;
    },
    [user, fetchOrders]
  );

  return {
    orders,
    ongoingOrders: orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled'),
    pastOrders: orders.filter((o) => o.status === 'Delivered' || o.status === 'Cancelled'),
    loading,
    refetch: fetchOrders,
    placeOrder,
    cancelOrder,
  };
}
