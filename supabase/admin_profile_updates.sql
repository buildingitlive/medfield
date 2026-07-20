-- Add suspended column to profiles for admin suspension feature
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT false;

-- Allow admin (any authenticated user who is in the partners table) to read all profiles
-- The existing RPC get_admin_users_with_email already handles reads via SECURITY DEFINER

-- Allow admin to update any profile (for edit profile + suspend)
-- We create a policy that allows update if the caller is an admin partner
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.partners
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old policy if exists, then create new one
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- Allow admin to read any user's prescriptions
DROP POLICY IF EXISTS "Admins can read all prescriptions" ON user_prescriptions;
CREATE POLICY "Admins can read all prescriptions"
  ON user_prescriptions FOR SELECT
  USING (public.is_admin());
