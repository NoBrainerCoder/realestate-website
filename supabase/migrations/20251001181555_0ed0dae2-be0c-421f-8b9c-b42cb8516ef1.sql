-- Fix the properties_public view to use SECURITY INVOKER
-- This ensures the view respects RLS policies of the querying user
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
  updated_at,
  -- Exclude poster_email and poster_phone for privacy
  NULL::text as poster_email,
  NULL::text as poster_phone
FROM public.properties
WHERE status = 'approved';

-- Grant access to the view
GRANT SELECT ON public.properties_public TO authenticated, anon;

-- Comment explaining the security model
COMMENT ON VIEW public.properties_public IS 'Public view of approved properties without sensitive contact information. Uses SECURITY INVOKER to respect RLS policies. Use this view for public property listings.';