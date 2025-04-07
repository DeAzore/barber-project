-- Récupérer tous les stylistes
CREATE OR REPLACE FUNCTION public.get_all_stylists()
RETURNS SETOF stylists
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT * 
  FROM stylists
  ORDER BY name;
$$;

-- Mettre à jour un styliste
CREATE OR REPLACE FUNCTION public.update_stylist(
  stylist_id UUID,
  name_val TEXT,
  role_val TEXT,
  experience_val TEXT,
  specialties_val TEXT[],
  image_url_val TEXT,
  available_val BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE stylists
  SET 
    name = name_val,
    role = role_val,
    experience = experience_val,
    specialties = specialties_val,
    image_url = image_url_val,
    available = available_val
  WHERE 
    id = stylist_id;
  
  RETURN FOUND;
END;
$$;

-- Créer un nouveau styliste
CREATE OR REPLACE FUNCTION public.create_stylist(
  name_val TEXT,
  role_val TEXT,
  experience_val TEXT,
  specialties_val TEXT[],
  image_url_val TEXT,
  available_val BOOLEAN
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO stylists (
    name,
    role,
    experience,
    specialties,
    image_url,
    available
  ) VALUES (
    name_val,
    role_val,
    experience_val,
    specialties_val,
    image_url_val,
    available_val
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Basculer la disponibilité d'un styliste
CREATE OR REPLACE FUNCTION public.toggle_stylist_availability(
  stylist_id UUID,
  available_val BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE stylists
  SET available = available_val
  WHERE id = stylist_id;
  
  RETURN FOUND;
END;
$$;
