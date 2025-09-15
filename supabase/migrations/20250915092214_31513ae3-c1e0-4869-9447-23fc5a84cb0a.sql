-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  area INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  bedrooms TEXT NOT NULL,
  bathrooms TEXT NOT NULL,
  furnishing TEXT NOT NULL,
  property_type TEXT NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  age TEXT NOT NULL,
  poster_name TEXT NOT NULL,
  poster_phone TEXT NOT NULL,
  poster_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policies for properties
CREATE POLICY "Users can view approved properties" 
ON public.properties 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Users can view their own properties" 
ON public.properties 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" 
ON public.properties 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create property_images table
CREATE TABLE public.property_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for images
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Create policies for property images
CREATE POLICY "Users can view images of approved properties" 
ON public.property_images 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.properties p 
    WHERE p.id = property_id AND p.status = 'approved'
  )
);

CREATE POLICY "Users can view their own property images" 
ON public.property_images 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.properties p 
    WHERE p.id = property_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert images for their own properties" 
ON public.property_images 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.properties p 
    WHERE p.id = property_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete images from their own properties" 
ON public.property_images 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.properties p 
    WHERE p.id = property_id AND p.user_id = auth.uid()
  )
);

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true);

-- Create storage policies for property images
CREATE POLICY "Property images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own property images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own property images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);