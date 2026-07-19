import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { PrescriptionWithItems } from '../types/database';

const CACHE_KEY = 'medfield_cached_prescriptions';

function cachePrescriptions(prescriptions: PrescriptionWithItems[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(prescriptions));
  } catch { /* ignore */ }
}

function getCachedPrescriptions(): PrescriptionWithItems[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function usePrescriptions() {
  const { user, isOnline } = useAuth();
  const [prescriptions, setPrescriptions] = useState<PrescriptionWithItems[]>(getCachedPrescriptions);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = useCallback(async () => {
    if (!user || !isOnline) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_prescriptions')
      .select('*, items:user_prescription_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mapped: PrescriptionWithItems[] = data.map((p: any) => ({
        ...p,
        items: p.items || [],
      }));
      setPrescriptions(mapped);
      cachePrescriptions(mapped);
    }

    setLoading(false);
  }, [user, isOnline]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const createPrescription = useCallback(
    async (params: {
      patientName: string;
      prescriptionUrl?: string | null;
      notes?: string | null;
      medicines: { name: string; quantity: number }[];
    }): Promise<{ prescriptionId: string | null; error: string | null }> => {
      if (!user) return { prescriptionId: null, error: 'Not authenticated' };

      // 1. Create prescription record
      const { data: rx, error: rxError } = await supabase
        .from('user_prescriptions')
        .insert({
          user_id: user.id,
          patient_name: params.patientName || 'Self',
          prescription_url: params.prescriptionUrl || null,
          notes: params.notes || null,
        } as any)
        .select()
        .single();

      if (rxError || !rx) {
        return { prescriptionId: null, error: rxError?.message || 'Failed to create prescription' };
      }

      // 2. Create prescription items
      if (params.medicines.length > 0) {
        const items = params.medicines.map((m) => ({
          prescription_id: rx.id,
          medicine_name: m.name,
          quantity: m.quantity,
        }));
        await supabase.from('user_prescription_items').insert(items as any);
      }

      // 3. Refresh
      await fetchPrescriptions();

      return { prescriptionId: rx.id, error: null };
    },
    [user, fetchPrescriptions]
  );

  const deletePrescription = useCallback(
    async (prescriptionId: string, prescriptionUrl?: string | null): Promise<{ error: string | null }> => {
      if (!user) return { error: 'Not authenticated' };

      // 1. Delete prescription items first (cascade should handle, but be safe)
      await supabase
        .from('user_prescription_items')
        .delete()
        .eq('prescription_id', prescriptionId);

      // 2. Delete the prescription record
      const { error } = await supabase
        .from('user_prescriptions')
        .delete()
        .eq('id', prescriptionId)
        .eq('user_id', user.id);

      if (error) return { error: error.message };

      // 3. Delete stored file if exists
      if (prescriptionUrl) {
        await supabase.storage.from('prescriptions').remove([prescriptionUrl]);
      }

      // 4. Refresh list
      await fetchPrescriptions();
      return { error: null };
    },
    [user, fetchPrescriptions]
  );

  return {
    prescriptions,
    loading,
    refetch: fetchPrescriptions,
    createPrescription,
    deletePrescription,
  };
}
