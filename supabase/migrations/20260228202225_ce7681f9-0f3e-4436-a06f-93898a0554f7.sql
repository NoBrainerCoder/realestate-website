
-- Add sustainability columns to properties table
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS solar_panels boolean DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS rainwater_harvesting boolean DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS energy_efficiency_rating integer DEFAULT null;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS waste_management boolean DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS green_certified boolean DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS eco_rating numeric DEFAULT null;
