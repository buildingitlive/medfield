import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const CACHE_KEY = 'medfield_cached_favorites';

function cacheFavorites(ids: string[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(ids));
  } catch { /* ignore */ }
}

function getCachedFavorites(): string[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const { user, isOnline } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getCachedFavorites);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user || !isOnline) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    if (!error && data) {
      const ids = data.map((f) => f.product_id);
      setFavoriteIds(ids);
      cacheFavorites(ids);
    }

    setLoading(false);
  }, [user, isOnline]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.includes(productId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (productId: string) => {
      if (!user) return;

      if (favoriteIds.includes(productId)) {
        // Remove
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        setFavoriteIds((prev) => {
          const updated = prev.filter((id) => id !== productId);
          cacheFavorites(updated);
          return updated;
        });
      } else {
        // Add
        await supabase
        .from('favorites')
        .insert({ user_id: user.id, product_id: productId } as any);

        setFavoriteIds((prev) => {
          const updated = [...prev, productId];
          cacheFavorites(updated);
          return updated;
        });
      }
    },
    [user, favoriteIds]
  );

  return {
    favoriteIds,
    loading,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
  };
}
