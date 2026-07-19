-- ============================================
-- MedField Order Flow Schema Migration
-- Run this in the Supabase SQL Editor
-- ============================================

-- STEP 1: Clean up old medicine_catalog
DROP TABLE IF EXISTS medicine_catalog;

-- STEP 2: Add new columns to `orders` table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS prescription_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS prescription_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS medicine_text TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_percent NUMERIC DEFAULT 0;

-- STEP 3: Prescription History (replaces cart)
CREATE TABLE IF NOT EXISTS user_prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL DEFAULT 'Self',
  prescription_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_prescription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID REFERENCES user_prescriptions(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_prescriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own prescriptions" ON user_prescriptions;
CREATE POLICY "Users can manage own prescriptions" ON user_prescriptions FOR ALL USING (auth.uid() = user_id);
GRANT ALL ON TABLE user_prescriptions TO anon, authenticated, service_role;

ALTER TABLE user_prescription_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full access for prescription items" ON user_prescription_items;
CREATE POLICY "Full access for prescription items" ON user_prescription_items FOR ALL USING (true);
GRANT ALL ON TABLE user_prescription_items TO anon, authenticated, service_role;

-- STEP 4: Pharmacist-confirmed line items
CREATE TABLE IF NOT EXISTS order_confirmed_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  company TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  mrp NUMERIC NOT NULL DEFAULT 0,
  price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE order_confirmed_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full access for order_confirmed_items" ON order_confirmed_items;
CREATE POLICY "Full access for order_confirmed_items" ON order_confirmed_items FOR ALL USING (true);
GRANT ALL ON TABLE order_confirmed_items TO anon, authenticated, service_role;

-- STEP 5: Self-growing admin product catalog
CREATE TABLE IF NOT EXISTS admin_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_name TEXT NOT NULL,
  company TEXT,
  mrp NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(medicine_name, company)
);

ALTER TABLE admin_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full access for admin_products" ON admin_products;
CREATE POLICY "Full access for admin_products" ON admin_products FOR ALL USING (true);
GRANT ALL ON TABLE admin_products TO anon, authenticated, service_role;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
