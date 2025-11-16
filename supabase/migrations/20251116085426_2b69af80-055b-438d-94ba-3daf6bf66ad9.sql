-- Create contact_requests table
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  property_code TEXT NOT NULL,
  property_title TEXT NOT NULL,
  property_location TEXT NOT NULL,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can create their own contact requests"
ON public.contact_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own contact requests"
ON public.contact_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all contact requests"
ON public.contact_requests
FOR SELECT
USING (is_admin());

CREATE POLICY "Admin can update contact requests"
ON public.contact_requests
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admin can delete contact requests"
ON public.contact_requests
FOR DELETE
USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for performance
CREATE INDEX idx_contact_requests_property_id ON public.contact_requests(property_id);
CREATE INDEX idx_contact_requests_user_id ON public.contact_requests(user_id);
CREATE INDEX idx_contact_requests_status ON public.contact_requests(status);