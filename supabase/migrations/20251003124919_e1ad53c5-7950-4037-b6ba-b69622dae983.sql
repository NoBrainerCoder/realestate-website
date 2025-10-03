-- Fix property submission and add missing admin policies

-- Add admin UPDATE policy for properties (approve/reject functionality)
CREATE POLICY "Admin can update all properties"
ON public.properties
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'myinfrahub.com@gmail.com'
  )
);

-- Add admin INSERT policy for contact_submissions viewing
CREATE POLICY "Admin can view all contact submissions"
ON public.contact_submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'myinfrahub.com@gmail.com'
  )
);

-- Add admin UPDATE policy for contact_submissions
CREATE POLICY "Admin can update contact submissions"
ON public.contact_submissions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'myinfrahub.com@gmail.com'
  )
);