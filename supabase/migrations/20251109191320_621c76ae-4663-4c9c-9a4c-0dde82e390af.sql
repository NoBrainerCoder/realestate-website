-- Add property_for column to properties table
ALTER TABLE public.properties 
ADD COLUMN property_for TEXT NOT NULL DEFAULT 'rent' 
CHECK (property_for IN ('rent', 'sell'));

-- Add comment for documentation
COMMENT ON COLUMN public.properties.property_for IS 'Indicates whether property is for rent or sell';

-- Create index for better query performance
CREATE INDEX idx_properties_property_for ON public.properties(property_for);