-- Allow public users to view approved and recently sold out properties
CREATE POLICY "Public can view approved properties"
ON public.properties
FOR SELECT
USING (
  status = 'approved' 
  OR (status = 'sold_out' AND sold_out_date >= (now() - interval '7 days'))
);

-- Allow public users to view images of approved properties
CREATE POLICY "Public can view images of approved properties"
ON public.property_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM properties p
    WHERE p.id = property_images.property_id
    AND (p.status = 'approved' OR (p.status = 'sold_out' AND p.sold_out_date >= (now() - interval '7 days')))
  )
);

-- Allow admin to delete property images
CREATE POLICY "Admin can delete property images"
ON public.property_images
FOR DELETE
USING (is_admin());

-- Allow admin to update property images
CREATE POLICY "Admin can update property images"
ON public.property_images
FOR UPDATE
USING (is_admin());

-- Allow admin to delete properties
CREATE POLICY "Admin can delete properties"
ON public.properties
FOR DELETE
USING (is_admin());