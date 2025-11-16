import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Calendar, Home, Shield, Send, Hash, Phone, Mail } from 'lucide-react';
import QuantumLoader from '@/components/QuantumLoader';
import PropertyImageCarousel from '@/components/PropertyImageCarousel';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
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

  const handleContactRequest = async () => {
    if (!user) {
      navigate('/sign-in');
      toast({
        title: 'Sign in required',
        description: 'Please sign in to send contact requests'
      });
      return;
    }

    if (!property) return;

    setIsSubmitting(true);
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, phone')
        .eq('user_id', user.id)
        .single();

      const { error } = await supabase
        .from('contact_requests')
        .insert({
          property_id: property.id,
          property_code: property.property_code || 'N/A',
          property_title: property.title,
          property_location: property.location,
          user_id: user.id,
          user_name: profile?.display_name || user.email?.split('@')[0] || 'User',
          user_email: user.email || '',
          user_phone: profile?.phone || null
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Your contact request has been submitted to our team.'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit contact request',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                images={(property.property_images as any).map((img: any) => ({
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
                {property.property_code && (
                  <div className="flex items-center gap-2 mb-3">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Property Code: {property.property_code}
                    </span>
                  </div>
                )}
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
                  <div className="text-sm text-muted-foreground">{property.area_unit || 'SQFT'}</div>
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
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-muted-foreground">+91 9866123350</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-muted-foreground text-sm">myinfrahub.com@gmail.com</div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleContactRequest}
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Contact Request'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;