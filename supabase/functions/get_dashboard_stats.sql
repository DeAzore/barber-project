CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE (
  bookings_today INT,
  bookings_week INT,
  total_clients INT,
  total_stylists INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today DATE := CURRENT_DATE;
  start_of_week DATE := date_trunc('week', CURRENT_DATE)::DATE;
  end_of_week DATE := (date_trunc('week', CURRENT_DATE) + interval '6 days')::DATE;
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INT FROM bookings WHERE booking_date::DATE = today) as bookings_today,
    (SELECT COUNT(*)::INT FROM bookings WHERE booking_date::DATE BETWEEN start_of_week AND end_of_week) as bookings_week,
    (SELECT COUNT(*)::INT FROM profiles WHERE role = 'client') as total_clients,
    (SELECT COUNT(*)::INT FROM stylists WHERE available = TRUE) as total_stylists;
END;
$$;
