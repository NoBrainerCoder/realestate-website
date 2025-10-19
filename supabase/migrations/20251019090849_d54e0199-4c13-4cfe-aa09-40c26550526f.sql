-- Add media_type column to property_images table to support videos
ALTER TABLE public.property_images 
ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image';

-- Add check constraint to ensure valid media types
ALTER TABLE public.property_images 
ADD CONSTRAINT valid_media_type CHECK (media_type IN ('image', 'video'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_property_images_media_type ON public.property_images(media_type);

-- Update storage bucket policies to allow video uploads
-- The property-images bucket will now store both images and videos