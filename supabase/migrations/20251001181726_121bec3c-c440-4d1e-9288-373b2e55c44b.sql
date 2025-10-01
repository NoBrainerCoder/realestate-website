-- Recreate properties_public view without any contact information columns
-- This completely removes the columns from the schema, not just returning NULL
DROP VIEW IF EXISTS public.properties_public;

CREATE OR REPLACE VIEW public.properties_public
WITH (security_invoker=on)
AS
SELECT 
  id,
  title,
  description,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  furnishing,
  property_type,
  amenities,
  age,
  status,
  user_id,
  poster_name,
  created_at,
  updated_at
  -- Completely exclude poster_email and poster_phone from schema
FROM public.properties
WHERE status = 'approved';

-- Enable RLS on the view for defense in depth
ALTER VIEW public.properties_public SET (security_invoker = on);

-- Grant access to the view
GRANT SELECT ON public.properties_public TO authenticated, anon;

-- Comment explaining the security model
COMMENT ON VIEW public.properties_public IS 'Public view of approved properties without sensitive contact information. Contact fields are completely excluded from schema. Uses SECURITY INVOKER to respect RLS policies.';