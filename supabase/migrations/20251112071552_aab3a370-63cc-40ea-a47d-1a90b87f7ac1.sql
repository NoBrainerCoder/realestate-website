-- Add missing foreign keys to establish proper relationships

-- Add foreign key from property_images to properties
ALTER TABLE public.property_images
DROP CONSTRAINT IF EXISTS property_images_property_id_fkey,
ADD CONSTRAINT property_images_property_id_fkey 
  FOREIGN KEY (property_id) 
  REFERENCES public.properties(id) 
  ON DELETE CASCADE;

-- Add foreign key from appointment_requests to properties
ALTER TABLE public.appointment_requests
DROP CONSTRAINT IF EXISTS appointment_requests_property_id_fkey,
ADD CONSTRAINT appointment_requests_property_id_fkey 
  FOREIGN KEY (property_id) 
  REFERENCES public.properties(id) 
  ON DELETE CASCADE;