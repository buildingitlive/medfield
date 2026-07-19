-- ============================================
-- FIX: Make prescriptions storage bucket public
-- so images can be viewed by users and admins
-- Run this in the Supabase SQL Editor
-- ============================================

-- Create bucket if it doesn't exist, or update it to be public
INSERT INTO storage.buckets (id, name, public)
VALUES ('prescriptions', 'prescriptions', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anyone to read prescription files (needed for image display)
DROP POLICY IF EXISTS "Public read prescriptions" ON storage.objects;
CREATE POLICY "Public read prescriptions"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'prescriptions');

-- Allow authenticated users to upload their own prescriptions
DROP POLICY IF EXISTS "Users can upload their own prescriptions" ON storage.objects;
CREATE POLICY "Users can upload their own prescriptions"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'prescriptions'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to delete their own prescriptions
DROP POLICY IF EXISTS "Users can delete their own prescriptions" ON storage.objects;
CREATE POLICY "Users can delete their own prescriptions"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'prescriptions'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
