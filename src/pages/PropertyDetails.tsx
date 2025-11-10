import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, Mail, MapPin, Bed, Bath, Maximize, Calendar, Home, Shield } from 'lucide-react';
import AppointmentDialog from '@/components/AppointmentDialog';
import QuantumLoader from '@/components/QuantumLoader';
import PropertyImageCarousel from '@/components/PropertyImageCarousel';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (
            id,
            image_url,
            media_type,
            display_order
          )
        `)
        .eq('id', id)
        .eq('status', 'approved')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <QuantumLoader size="65" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <Link to="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/properties" className="inline-block mb-6">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Media Gallery */}
            {property.property_images && property.property_images.length > 0 ? (
              <PropertyImageCarousel 
                images={property.property_images.map(img => ({
                  ...img,
                  media_type: img.media_type as 'image' | 'video'
                }))}
                autoplay={true}
                autoplayDelay={3000}
              />
            ) : (
              <div className="rounded-2xl overflow-hidden bg-muted flex items-center justify-center h-64 md:h-96">
                <p className="text-muted-foreground">No media available</p>
              </div>
            )}

            {/* Property Info */}
            <div className="bg-background rounded-2xl p-6 shadow-card">
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{property.location}</span>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(property.price)}
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-semibold">{property.bedrooms}</div>
                  <div className="text-sm text-muted-foreground">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-muted-foreground">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Maximize className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-semibold">{property.area}</div>
                  <div className="text-sm text-muted-foreground">Sq Ft</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-semibold">{property.age}</div>
                  <div className="text-sm text-muted-foreground">Age</div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline">
                  <Home className="h-3 w-3 mr-1" />
                  {property.property_type}
                </Badge>
                <Badge variant="outline">{property.furnishing}</Badge>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center p-2 bg-muted/50 rounded-lg">
                      <Shield className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Sidebar */}
          <div className="space-y-6">
            <div className="bg-background rounded-2xl p-6 shadow-card sticky top-8">
              <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-muted-foreground">{property.poster_phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-muted-foreground">{property.poster_email}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <AppointmentDialog 
                  propertyId={property.id} 
                  propertyTitle={property.title}
                />
                <a href={`tel:${property.poster_phone}`} className="block">
                  <Button className="w-full btn-hero">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </a>
                <a href={`mailto:${property.poster_email}`} className="block">
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;