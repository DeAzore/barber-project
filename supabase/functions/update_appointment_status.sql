CREATE OR REPLACE FUNCTION public.update_appointment_status(
  appointment_id UUID,
  status_value TEXT,
  confirmed_value BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE bookings
  SET 
    status = status_value,
    confirmed = confirmed_value
  WHERE 
    id = appointment_id;
  
  RETURN FOUND;
END;
$$;
