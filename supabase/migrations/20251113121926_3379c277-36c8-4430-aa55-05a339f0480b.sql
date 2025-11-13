-- Add poster_type column to properties table
ALTER TABLE public.properties 
ADD COLUMN poster_type TEXT NOT NULL DEFAULT 'owner' CHECK (poster_type IN ('owner', 'agent', 'builder'));