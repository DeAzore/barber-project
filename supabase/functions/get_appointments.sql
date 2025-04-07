CREATE OR REPLACE FUNCTION public.get_appointments(filter_type TEXT)
RETURNS TABLE (
  id UUID,
  client_name TEXT,
  client_phone TEXT,
  booking_date TEXT,
  booking_time TEXT, 
  status TEXT,
  confirmed BOOLEAN,
  whatsapp_notifications BOOLEAN,
  service JSONB,
  stylist JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH booking_data AS (
    SELECT 
      b.id,
      b.client_name,
      b.client_phone,
      b.booking_date::TEXT,
      b.booking_time,
      b.status,
      b.confirmed,
      b.whatsapp_notifications,
      jsonb_build_object('title', s.title) as service,
      jsonb_build_object('name', st.name) as stylist
    FROM 
      bookings b
    LEFT JOIN
      services s ON b.service_id = s.id
    LEFT JOIN
      stylists st ON b.stylist_id = st.id
  )
  SELECT *
  FROM booking_data
  WHERE 
    CASE 
      WHEN filter_type = 'today' THEN booking_date = CURRENT_DATE::TEXT
      WHEN filter_type = 'upcoming' THEN booking_date >= CURRENT_DATE::TEXT
      WHEN filter_type = 'confirmed' THEN confirmed = TRUE
      WHEN filter_type = 'pending' THEN confirmed = FALSE
      ELSE TRUE
    END
  ORDER BY booking_date, booking_time;
END;
$$;
