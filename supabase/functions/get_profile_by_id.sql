CREATE OR REPLACE FUNCTION public.get_profile_by_id(user_id UUID)
RETURNS TABLE (
  id UUID,
  role TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    id,
    role::TEXT,
    first_name,
    last_name,
    phone,
    avatar_url,
    created_at,
    updated_at
  FROM 
    profiles
  WHERE 
    id = user_id;
$$;
