-- =====================================================
-- MyInfraHub Database Cleanup & Admin Restoration
-- =====================================================

-- 1. Clear all test data (keeping structure intact)
-- =====================================================

-- Delete test properties (adjust conditions as needed for your test data)
DELETE FROM property_images 
WHERE property_id IN (
  SELECT id FROM properties 
  WHERE title LIKE '%test%' 
  OR poster_name LIKE '%test%'
  OR poster_email LIKE '%test%'
);

DELETE FROM properties 
WHERE title LIKE '%test%' 
OR poster_name LIKE '%test%'
OR poster_email LIKE '%test%';

-- Delete test appointments (optional - keeps real appointment structure)
DELETE FROM appointment_requests 
WHERE visitor_email LIKE '%test%';

-- Delete test contact submissions
DELETE FROM contact_submissions 
WHERE email LIKE '%test%';

-- 2. Ensure Admin Access for myinfrahub.com@gmail.com
-- =====================================================

-- First, check if the admin user exists and get their ID
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the admin user ID from auth.users
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'myinfrahub.com@gmail.com'
  LIMIT 1;

  -- If admin user exists, ensure they have admin role
  IF admin_user_id IS NOT NULL THEN
    -- Insert admin role (or update if exists)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role granted to myinfrahub.com@gmail.com';
  ELSE
    RAISE NOTICE 'Admin user myinfrahub.com@gmail.com not found. Please sign up with this email first.';
  END IF;
END $$;

-- 3. Verify RLS policies are correct
-- =====================================================

-- Update the can_view_property_contact function to ensure admin access
CREATE OR REPLACE FUNCTION public.can_view_property_contact(property_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    auth.uid() = property_user_id OR
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'myinfrahub.com@gmail.com'
    );
$$;