-- Fix security warning by setting search_path on property code functions
-- Drop trigger first, then functions, then recreate
DROP TRIGGER IF EXISTS trigger_set_property_code ON public.properties;
DROP FUNCTION IF EXISTS set_property_code();
DROP FUNCTION IF EXISTS generate_property_code();

-- Recreate functions with proper security settings
CREATE OR REPLACE FUNCTION generate_property_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number integer;
  new_code text;
BEGIN
  -- Get the highest number from existing property codes
  SELECT COALESCE(MAX(CAST(SUBSTRING(property_code FROM 'MIH-(\d+)') AS integer)), 0) + 1
  INTO next_number
  FROM properties
  WHERE property_code LIKE 'MIH-%';
  
  -- Generate the new code with leading zeros
  new_code := 'MIH-' || LPAD(next_number::text, 4, '0');
  
  RETURN new_code;
END;
$$;

CREATE OR REPLACE FUNCTION set_property_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.property_code IS NULL THEN
    NEW.property_code := generate_property_code();
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER trigger_set_property_code
BEFORE INSERT ON public.properties
FOR EACH ROW
EXECUTE FUNCTION set_property_code();