-- ============================================
-- FIX: Update orders status CHECK constraint & RLS
-- to include new prescription-flow statuses
-- Run this in the Supabase SQL Editor
-- ============================================

-- Step 1: Drop the old CHECK constraint
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Step 2: Add new CHECK constraint with all statuses
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN (
    'Pending Confirmation',
    'Order Confirmed',
    'Order Placed',
    'Verified by Pharmacy',
    'Dispatched from Field Warehouse',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ));

-- Step 3: Also add an updated_at column if missing (for tracking delivery date)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Step 4: Create/update the auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Step 5: Fix 403 Forbidden on order_tracking_steps by allowing all authenticated users (admins) to insert tracking steps
DROP POLICY IF EXISTS "Admins can insert tracking steps" ON public.order_tracking_steps;
CREATE POLICY "Admins can insert tracking steps"
  ON public.order_tracking_steps FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Step 6: Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
