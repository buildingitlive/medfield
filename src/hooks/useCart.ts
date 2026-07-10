import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { CartItemWithProduct, Product } from '../types/database';

const CACHE_KEY = 'medfield_cached_cart';

function cacheCart(items: CartItemWithProduct[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(items));
  } catch { /* ignore */ }
}

function getCachedCart(): CartItemWithProduct[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const { user, isOnline } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>(getCachedCart);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!user || !isOnline) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('id, product_id, quantity, products(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (!error && data) {
      const mapped: CartItemWithProduct[] = data
        .filter((row: any) => row.products)
        .map((row: any) => ({
          id: row.id,
          product_id: row.product_id,
          quantity: row.quantity,
          product: row.products as Product,
        }));

      setItems(mapped);
      cacheCart(mapped);
    }

    setLoading(false);
  }, [user, isOnline]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      if (!user) return;

      // Check if already in cart
      const existing = items.find((i) => i.product_id === productId);

      if (existing) {
        const newQty = existing.quantity + quantity;
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQty } as any)
          .eq('id', existing.id);

        if (!error) {
          setItems((prev) => {
            const updated = prev.map((i) =>
              i.product_id === productId ? { ...i, quantity: newQty } : i
            );
            cacheCart(updated);
            return updated;
          });
        }
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert({ user_id: user.id, product_id: productId, quantity } as any)
          .select('id, product_id, quantity, products(*)')
          .single();

        if (!error && data) {
          const newItem: CartItemWithProduct = {
            id: (data as any).id,
            product_id: (data as any).product_id,
            quantity: (data as any).quantity,
            product: (data as any).products as Product,
          };
          setItems((prev) => {
            const updated = [...prev, newItem];
            cacheCart(updated);
            return updated;
          });
        }
      }
    },
    [user, items]
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      if (quantity < 1) return;

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity } as any)
        .eq('id', cartItemId);

      if (!error) {
        setItems((prev) => {
          const updated = prev.map((i) =>
            i.id === cartItemId ? { ...i, quantity } : i
          );
          cacheCart(updated);
          return updated;
        });
      }
    },
    []
  );

  const removeItem = useCallback(async (cartItemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (!error) {
      setItems((prev) => {
        const updated = prev.filter((i) => i.id !== cartItemId);
        cacheCart(updated);
        return updated;
      });
    }
  }, []);

  const clearCart = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (!error) {
      setItems([]);
      cacheCart([]);
    }
  }, [user]);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return {
    items,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    cartCount,
    subtotal,
    refetch: fetchCart,
  };
}
