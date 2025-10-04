-- Add rejection_reason column to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;