
ALTER TABLE public.properties
  DROP COLUMN IF EXISTS solar_panels,
  DROP COLUMN IF EXISTS rainwater_harvesting,
  DROP COLUMN IF EXISTS energy_efficiency_rating,
  DROP COLUMN IF EXISTS waste_management,
  DROP COLUMN IF EXISTS green_certified,
  DROP COLUMN IF EXISTS eco_rating,
  ADD COLUMN IF NOT EXISTS water_supply boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS power_backup boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS power_backup_type text DEFAULT 'None',
  ADD COLUMN IF NOT EXISTS parking_available boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS lift_available boolean DEFAULT false;
