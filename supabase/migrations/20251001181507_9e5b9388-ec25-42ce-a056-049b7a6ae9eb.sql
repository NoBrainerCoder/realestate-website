-- Create a view for public property listings without sensitive contact information
CREATE OR REPLACE VIEW public.properties_public AS
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

-- Create a security definer function to check if user is admin or property owner
CREATE OR REPLACE FUNCTION public.can_view_property_contact(property_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    auth.uid() = property_user_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'myinfrapub.com@gmail.com'
    );
$$;

-- Update the SELECT policies on properties to hide contact info from unauthorized users
-- First, drop the existing SELECT policies
DROP POLICY IF EXISTS "Users can view approved properties" ON public.properties;
DROP POLICY IF EXISTS "Users can view their own properties" ON public.properties;

-- Create new policies with contact info restrictions
-- Users can view their own properties with full details
CREATE POLICY "Users can view their own properties"
ON public.properties
FOR SELECT
USING (auth.uid() = user_id);

-- Admin can view all properties with full details
CREATE POLICY "Admin can view all properties"
ON public.properties
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'myinfrapub.com@gmail.com'
  )
);

-- Comment explaining the security model
COMMENT ON VIEW public.properties_public IS 'Public view of approved properties without sensitive contact information. Use this view for public property listings. Property owners and admins should query the properties table directly for full contact details.';