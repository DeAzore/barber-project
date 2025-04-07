CREATE OR REPLACE FUNCTION public.get_booking_details(booking_id UUID)
RETURNS TABLE (
  booking_id UUID,
  client_name TEXT,
  client_phone TEXT,
  booking_date TEXT,
  booking_time TEXT,
  service_title TEXT,
  stylist_name TEXT,
  status TEXT,
  confirmed BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id as booking_id,
    b.client_name,
    b.client_phone,
    b.booking_date::TEXT,
    b.booking_time,
    s.title as service_title,
    st.name as stylist_name,
    b.status,
    b.confirmed
  FROM 
    bookings b
  LEFT JOIN
    services s ON b.service_id = s.id
  LEFT JOIN
    stylists st ON b.stylist_id = st.id
  WHERE 
    b.id = booking_id;
END;
$$;
