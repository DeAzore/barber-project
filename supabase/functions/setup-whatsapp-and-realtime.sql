-- Create a table to log WhatsApp message attempts
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  phone TEXT NOT NULL,
  template_name TEXT NOT NULL,
  message_preview TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB
);

-- Add RLS policies for WhatsApp logs
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admins and staff to view WhatsApp logs"
  ON public.whatsapp_logs
  FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff'));

CREATE POLICY "Allow service role to insert WhatsApp logs"
  ON public.whatsapp_logs
  FOR INSERT
  WITH CHECK (true);

-- Enable realtime for appointments to show new bookings immediately
-- Set the identity to full to allow the client to access all changed fields
ALTER TABLE public.bookings REPLICA IDENTITY FULL;

-- Add the bookings table to the supabase_realtime publication
BEGIN;
  -- Check if the table is already in the publication
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'bookings'
    ) THEN
      -- If not, add it
      PERFORM supabase_functions.extension('pgcrypto');
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings');
    END IF;
  END $$;
COMMIT;
