-- Update admin email from myinfrapub.com@gmail.com to myinfrahub.com@gmail.com
-- This affects all RLS policies and functions that check for admin access

-- Drop existing admin policies that use the old email
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all properties" ON public.properties;

-- Recreate admin policies with correct email
CREATE POLICY "Admin can view all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'myinfrahub.com@gmail.com'
  )
);

CREATE POLICY "Admin can view all properties"
ON public.properties
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'myinfrahub.com@gmail.com'
  )
);

-- Update the can_view_property_contact function to use correct admin email
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
      AND auth.users.email = 'myinfrahub.com@gmail.com'
    );
$$;

COMMENT ON FUNCTION public.can_view_property_contact IS 'Checks if user can view property contact info. Returns true if user is property owner or admin (myinfrahub.com@gmail.com).';