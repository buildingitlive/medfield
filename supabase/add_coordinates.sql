-- Add latitude and longitude columns to the addresses table
-- so we can store GPS coordinates from "Use Current Location"

ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
