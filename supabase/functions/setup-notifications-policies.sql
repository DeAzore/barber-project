-- Set up Row Level Security for notifications table
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy that allows admins and staff to read notifications
CREATE POLICY IF NOT EXISTS "Staff can read notifications" 
ON public.notifications 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin' OR role = 'staff'
  )
);

-- Create policy that allows admins to update notifications (mark as read)
CREATE POLICY IF NOT EXISTS "Staff can update notifications" 
ON public.notifications 
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin' OR role = 'staff'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin' OR role = 'staff'
  )
);

-- Create policy that allows admins to insert notifications
CREATE POLICY IF NOT EXISTS "Admins can insert notifications" 
ON public.notifications 
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);

-- Create policy that allows admins to delete notifications
CREATE POLICY IF NOT EXISTS "Admins can delete notifications" 
ON public.notifications 
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);
