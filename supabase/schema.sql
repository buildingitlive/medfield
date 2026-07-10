-- ============================================================
-- MedField PWA — Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- ─── 1. Profiles (extends Supabase auth.users) ──────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  member_tier TEXT NOT NULL DEFAULT 'standard'
    CHECK (member_tier IN ('standard', 'premium', 'clinical')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on user signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── 2. Products (public catalog) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  generic_name TEXT NOT NULL DEFAULT '',
  dosage TEXT NOT NULL DEFAULT '',
  form TEXT NOT NULL DEFAULT 'Capsule'
    CHECK (form IN ('Tablet', 'Capsule', 'Tincture', 'Extract', 'Topical')),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  mrp NUMERIC(10, 2) NOT NULL DEFAULT 0,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  requires_prescription BOOLEAN NOT NULL DEFAULT false,
  grower_name TEXT NOT NULL DEFAULT '',
  grower_location TEXT NOT NULL DEFAULT '',
  grower_certification TEXT NOT NULL DEFAULT '',
  grower_purity_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
  batch_number TEXT NOT NULL DEFAULT '',
  harvest_date TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Botanical'
    CHECK (category IN ('Botanical', 'Analgesic', 'Cardiac', 'Immunology', 'Wellness')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read: anyone can browse the catalog (even unauthenticated)
CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT
  USING (true);


-- ─── 3. Addresses ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  recipient_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  street TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  zip TEXT NOT NULL DEFAULT '',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own addresses"
  ON public.addresses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── 4. Cart Items ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own cart"
  ON public.cart_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── 5. Orders ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Order Placed'
    CHECK (status IN (
      'Order Placed',
      'Verified by Pharmacy',
      'Dispatched from Field Warehouse',
      'Out for Delivery',
      'Delivered'
    )),
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  estimated_delivery TEXT NOT NULL DEFAULT '',
  payment_method TEXT NOT NULL DEFAULT 'COD'
    CHECK (payment_method IN ('COD', 'QR')),
  address_snapshot JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ─── 6. Order Items ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_snapshot JSONB NOT NULL DEFAULT '{}',
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );


-- ─── 7. Order Tracking Steps ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_tracking_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  timestamp TEXT NOT NULL DEFAULT '',
  completed BOOLEAN NOT NULL DEFAULT false,
  step_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.order_tracking_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read tracking for their own orders"
  ON public.order_tracking_steps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_tracking_steps.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tracking for their own orders"
  ON public.order_tracking_steps FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_tracking_steps.order_id
      AND orders.user_id = auth.uid()
    )
  );


-- ─── 8. Favorites ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own favorites"
  ON public.favorites FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── 9. Prescriptions ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL DEFAULT '',
  file_name TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'verified', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own prescriptions"
  ON public.prescriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own prescriptions"
  ON public.prescriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ─── Storage Bucket for Prescriptions ───────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('prescriptions', 'prescriptions', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own prescriptions"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'prescriptions'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read their own prescriptions"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'prescriptions'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
