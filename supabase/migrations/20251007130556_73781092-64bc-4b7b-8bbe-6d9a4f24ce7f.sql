-- Drop the problematic RLS policies
DROP POLICY IF EXISTS "Admin can update all properties" ON public.properties;
DROP POLICY IF EXISTS "Admin can view all properties" ON public.properties;
DROP POLICY IF EXISTS "Admin can update properties" ON public.properties;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND email = 'myinfrahub.com@gmail.com'
  );
$$;

-- Create new RLS policies using the security definer function
CREATE POLICY "Admin can view all properties"
ON public.properties
FOR SELECT
USING (
  public.is_admin() OR 
  (auth.uid() = user_id)
);

CREATE POLICY "Admin can update all properties"
ON public.properties
FOR UPDATE
USING (
  public.is_admin() OR 
  (auth.uid() = user_id)
);

-- Update contact_submissions policies to use the same pattern
DROP POLICY IF EXISTS "Admin can view all contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admin can update contact submissions" ON public.contact_submissions;

CREATE POLICY "Admin can view all contact submissions"
ON public.contact_submissions
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admin can update contact submissions"
ON public.contact_submissions
FOR UPDATE
USING (public.is_admin());

-- Update profiles policies to use the same pattern
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;

CREATE POLICY "Admin can view all profiles"
ON public.profiles
FOR SELECT
USING (
  public.is_admin() OR 
  (auth.uid() = user_id)
);