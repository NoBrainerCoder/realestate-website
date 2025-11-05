-- Add admin role for the admin user
-- This ensures the admin user has the proper role in the system
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'myinfrahub.com@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;