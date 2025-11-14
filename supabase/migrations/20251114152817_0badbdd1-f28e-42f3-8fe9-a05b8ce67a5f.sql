-- Add area_unit column to properties table
ALTER TABLE public.properties
ADD COLUMN area_unit TEXT NOT NULL DEFAULT 'SQFT' CHECK (area_unit IN ('SQFT', 'SY'));