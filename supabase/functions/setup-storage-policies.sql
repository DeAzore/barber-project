-- Create business_assets bucket if it doesn't exist
BEGIN
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('business_assets', 'business_assets', true)
  ON CONFLICT (id) DO NOTHING;
END;

-- Set up Storage policies for business_assets bucket
-- Allow public read access to files in the business_assets bucket
CREATE POLICY "Public can view business assets" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'business_assets');

-- Allow authenticated users to upload to business_assets bucket
CREATE POLICY "Authenticated users can upload business assets" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'business_assets' 
  AND auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update their business assets" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'business_assets'
  AND auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete their business assets" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'business_assets'
  AND auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);
