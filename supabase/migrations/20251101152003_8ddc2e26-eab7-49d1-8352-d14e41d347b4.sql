-- Create appointment_requests table
CREATE TABLE public.appointment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  visitor_email TEXT NOT NULL,
  visitor_phone TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.appointment_requests ENABLE ROW LEVEL SECURITY;

-- Admin can view all appointments
CREATE POLICY "Admin can view all appointments"
ON public.appointment_requests
FOR SELECT
USING (is_admin());

-- Admin can update appointments
CREATE POLICY "Admin can update appointments"
ON public.appointment_requests
FOR UPDATE
USING (is_admin());

-- Anyone can create appointment requests
CREATE POLICY "Anyone can create appointment requests"
ON public.appointment_requests
FOR INSERT
WITH CHECK (true);

-- Property owners can view appointments for their properties
CREATE POLICY "Property owners can view their property appointments"
ON public.appointment_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM properties p
    WHERE p.id = appointment_requests.property_id
    AND p.user_id = auth.uid()
  )
);

-- Create updated_at trigger
CREATE TRIGGER update_appointment_requests_updated_at
BEFORE UPDATE ON public.appointment_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();