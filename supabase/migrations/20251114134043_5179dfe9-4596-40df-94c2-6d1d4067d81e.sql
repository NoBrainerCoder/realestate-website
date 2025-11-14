-- Add property_code column to properties table
ALTER TABLE public.properties 
ADD COLUMN property_code text UNIQUE;

-- Create a function to generate the next property code
CREATE OR REPLACE FUNCTION generate_property_code()
RETURNS text
LANGUAGE plpgsql
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

-- Create a trigger to auto-generate property code on insert
CREATE OR REPLACE FUNCTION set_property_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.property_code IS NULL THEN
    NEW.property_code := generate_property_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_property_code
BEFORE INSERT ON public.properties
FOR EACH ROW
EXECUTE FUNCTION set_property_code();