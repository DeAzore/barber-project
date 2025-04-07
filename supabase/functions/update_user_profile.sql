CREATE OR REPLACE FUNCTION public.update_user_profile(
  user_id UUID,
  first_name_val TEXT,
  last_name_val TEXT,
  phone_val TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    first_name = first_name_val,
    last_name = last_name_val,
    phone = phone_val,
    updated_at = now()
  WHERE 
    id = user_id;
END;
$$;
