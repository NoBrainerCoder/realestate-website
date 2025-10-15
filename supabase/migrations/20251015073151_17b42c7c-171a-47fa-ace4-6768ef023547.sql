-- Add sold_out_date column to properties table
ALTER TABLE public.properties 
ADD COLUMN sold_out_date timestamp with time zone;

-- Add comment to explain the column
COMMENT ON COLUMN public.properties.sold_out_date IS 'Timestamp when property was marked as sold out. Properties are auto-removed after 3 days.';

-- Update status check constraint if it exists, otherwise add it
DO $$ 
BEGIN
  -- Check if constraint exists and drop it
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'properties_status_check' 
    AND table_name = 'properties'
  ) THEN
    ALTER TABLE public.properties DROP CONSTRAINT properties_status_check;
  END IF;
  
  -- Add updated constraint with sold_out status
  ALTER TABLE public.properties 
  ADD CONSTRAINT properties_status_check 
  CHECK (status IN ('pending', 'approved', 'rejected', 'sold_out'));
END $$;