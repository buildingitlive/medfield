import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Product } from '../types/database';

const CACHE_KEY = 'medfield_cached_products';

function cacheProducts(products: Product[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(products));
  } catch { /* ignore */ }
}

function getCachedProducts(): Product[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

interface UseProductsOptions {
  search?: string;
  category?: string;
  sortBy?: 'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC';
}

export function useProducts(options: UseProductsOptions = {}) {
  const { isOnline } = useAuth();
  const [products, setProducts] = useState<Product[]>(getCachedProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!isOnline) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      if (data) {
        setProducts(data);
        cacheProducts(data);
      }
    } catch {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Apply client-side filtering/sorting
  const filteredProducts = products
    .filter((p) => {
      const { search, category } = options;

      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.generic_name.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      if (category && category !== 'ALL' && p.category !== category) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (options.sortBy === 'PRICE_ASC') return a.price - b.price;
      if (options.sortBy === 'PRICE_DESC') return b.price - a.price;
      return 0;
    });

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id) || null,
    [products]
  );

  return {
    products: filteredProducts,
    allProducts: products,
    loading,
    error,
    refetch: fetchProducts,
    getProductById,
  };
}
