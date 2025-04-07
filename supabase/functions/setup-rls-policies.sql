-- Set up Row Level Security for business_settings table
ALTER TABLE IF EXISTS public.business_settings ENABLE ROW LEVEL SECURITY;

-- Create policy that allows admins to update business_settings
CREATE POLICY IF NOT EXISTS "Admins can update business settings" 
ON public.business_settings 
FOR ALL 
TO authenticated
USING (auth.uid() IN (
  SELECT id FROM public.profiles WHERE role = 'admin'
));

-- Create policy that allows anyone to read business_settings
CREATE POLICY IF NOT EXISTS "Anyone can read business settings" 
ON public.business_settings 
FOR SELECT 
TO authenticated
USING (true);

-- Create policy that allows public access to business_settings
CREATE POLICY IF NOT EXISTS "Public can read business settings" 
ON public.business_settings 
FOR SELECT 
TO anon
USING (true);
