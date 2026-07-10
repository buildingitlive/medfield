import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Address } from '../types/database';

const CACHE_KEY = 'medfield_cached_addresses';

function cacheAddresses(addresses: Address[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(addresses));
  } catch { /* ignore */ }
}

function getCachedAddresses(): Address[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useAddresses() {
  const { user, isOnline } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>(getCachedAddresses);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = useCallback(async () => {
    if (!user || !isOnline) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAddresses(data);
      cacheAddresses(data);
    }

    setLoading(false);
  }, [user, isOnline]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const defaultAddress = addresses.find((a) => a.is_default) || addresses[0] || null;

  const addAddress = useCallback(
    async (addr: Omit<Address, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) return { error: 'Not authenticated' };

      const { data, error } = await supabase
        .from('addresses')
        .insert({ ...addr, user_id: user.id } as any)
        .select()
        .single();

      if (!error && data) {
        setAddresses((prev) => {
          const updated = [data, ...prev];
          cacheAddresses(updated);
          return updated;
        });
      }

      return { error: error?.message || null };
    },
    [user]
  );

  const updateAddress = useCallback(
    async (id: string, updates: Partial<Omit<Address, 'id' | 'user_id' | 'created_at'>>) => {
      const { error } = await supabase
        .from('addresses')
        .update(updates as any)
        .eq('id', id);

      if (!error) {
        setAddresses((prev) => {
          const updated = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
          cacheAddresses(updated);
          return updated;
        });
      }

      return { error: error?.message || null };
    },
    []
  );

  const deleteAddress = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id);

    if (!error) {
      setAddresses((prev) => {
        const updated = prev.filter((a) => a.id !== id);
        cacheAddresses(updated);
        return updated;
      });
    }

    return { error: error?.message || null };
  }, []);

  const setDefault = useCallback(
    async (id: string) => {
      if (!user) return;

      // Unset all defaults, then set the selected one
      await supabase
        .from('addresses')
        .update({ is_default: false } as any)
        .eq('user_id', user.id);

      await supabase
        .from('addresses')
        .update({ is_default: true } as any)
        .eq('id', id);

      setAddresses((prev) => {
        const updated = prev.map((a) => ({
          ...a,
          is_default: a.id === id,
        }));
        cacheAddresses(updated);
        return updated;
      });
    },
    [user]
  );

  return {
    addresses,
    defaultAddress,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
    refetch: fetchAddresses,
  };
}
