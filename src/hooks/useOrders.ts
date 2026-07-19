import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { OrderWithItems, Address, PaymentMethod } from '../types/database';

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

    // Try full query first; fall back to simpler query if order_confirmed_items
    // relation isn't available in the PostgREST schema cache yet.
    let data: any[] | null = null;
    let usedFallback = false;

    const fullResult = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*),
        order_confirmed_items(*),
        order_tracking_steps(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fullResult.error) {
      // Fallback: query without order_confirmed_items
      const fallbackResult = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*),
          order_tracking_steps(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      data = fallbackResult.data;
      usedFallback = true;
    } else {
      data = fullResult.data;
    }

    if (data) {
      const mapped: OrderWithItems[] = data.map((o: any) => ({
        ...o,
        items: o.order_items || [],
        confirmed_items: usedFallback ? [] : (o.order_confirmed_items || []),
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

  /**
   * Place a new order request (Pending Confirmation).
   * The pharmacist will confirm and set pricing later.
   */
  const placeOrderRequest = useCallback(
    async (params: {
      address: Address;
      prescriptionId?: string | null;
      prescriptionUrl?: string | null;
      medicineText?: string | null;
      notes?: string | null;
      paymentMethod?: PaymentMethod;
    }): Promise<{ orderId: string | null; error: string | null }> => {
      if (!user) return { orderId: null, error: 'Not authenticated' };

      const { address, prescriptionId, prescriptionUrl, medicineText, notes, paymentMethod } = params;

      // 1. Create order with Pending Confirmation status
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'Pending Confirmation',
          total: 0, // pharmacist will set this
          delivery_fee: 0,
          estimated_delivery: 'Pending',
          payment_method: paymentMethod || 'COD',
          prescription_id: prescriptionId || null,
          prescription_url: prescriptionUrl || null,
          medicine_text: medicineText || null,
          notes: notes || null,
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

      // 2. Create initial tracking step
      await supabase.from('order_tracking_steps').insert({
        order_id: order.id,
        title: 'Order Request Submitted',
        description: 'Your request has been sent to our pharmacist for review.',
        timestamp: new Date().toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        completed: true,
        step_order: 1,
      } as any);

      // 3. Emit notifications
      const shortId = order.id.split('-')[0];
      await supabase.from('notifications').insert([
        {
          recipient_type: 'admin',
          title: `New Order Request #${shortId} 📋`,
          description: `A customer has submitted a new order request. Please review and confirm pricing.`,
          type: 'order_placed',
          link: '/orders',
          is_read: false,
        },
        {
          recipient_type: 'user',
          recipient_id: user.id,
          title: 'Order Request Submitted! 📋',
          description: `Your order #${shortId} has been sent to our pharmacist. We'll confirm your order shortly.`,
          type: 'order_placed',
          link: '/orders',
          is_read: false,
        },
      ]);

      // 4. Refresh orders list
      await fetchOrders();

      return { orderId: order.id, error: null };
    },
    [user, fetchOrders]
  );

  /**
   * Quick reorder from an existing prescription.
   * Skips the prescription upload and medicine listing steps.
   */
  const reorderFromPrescription = useCallback(
    async (params: {
      prescriptionId: string;
      selectedMedicines: { name: string; quantity: number }[];
      address: Address;
      paymentMethod?: PaymentMethod;
    }): Promise<{ orderId: string | null; error: string | null }> => {
      if (!user) return { orderId: null, error: 'Not authenticated' };

      const medicineText = params.selectedMedicines
        .map((m) => `${m.name} × ${m.quantity}`)
        .join('\n');

      return placeOrderRequest({
        address: params.address,
        prescriptionId: params.prescriptionId,
        medicineText,
        notes: 'Reorder from saved prescription',
        paymentMethod: params.paymentMethod,
      });
    },
    [user, placeOrderRequest]
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

  const ongoingStatuses = ['Pending Confirmation', 'Order Confirmed', 'Order Placed', 'Verified by Pharmacy', 'Dispatched from Field Warehouse', 'Out for Delivery'];

  return {
    orders,
    ongoingOrders: orders.filter((o) => ongoingStatuses.includes(o.status) && o.status.toLowerCase() !== 'delivered' && o.status.toLowerCase() !== 'cancelled'),
    pastOrders: orders.filter((o) => o.status.toLowerCase() === 'delivered' || o.status.toLowerCase() === 'cancelled'),
    loading,
    refetch: fetchOrders,
    placeOrderRequest,
    reorderFromPrescription,
    cancelOrder,
  };
}
