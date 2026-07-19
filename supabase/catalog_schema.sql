ALTER TABLE public.medicine_catalog ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users on catalog" ON public.medicine_catalog;
CREATE POLICY "Enable read access for all users on catalog" ON public.medicine_catalog FOR SELECT USING (true);
GRANT SELECT ON TABLE public.medicine_catalog TO anon, authenticated, service_role;
NOTIFY pgrst, 'reload schema';
