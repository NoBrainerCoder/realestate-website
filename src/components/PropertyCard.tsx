import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Maximize, MapPin, Send, Hash } from 'lucide-react';
import ImageLightbox from './ImageLightbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    area: number;
    bedrooms: string | number;
    bathrooms: string | number;
    type: string;
    furnishing: string;
    image: string;
    isNew?: boolean;
    status?: string;
    property_code?: string;
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCardClick = () => {
    navigate(`/property/${property.id}`);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxOpen(true);
  };

  const handleContactRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      navigate('/sign-in');
      toast({
        title: 'Sign in required',
        description: 'Please sign in to send contact requests'
      });
      return;
    }

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
    <div 
      onClick={handleCardClick}
      className="property-card-animate bg-card border border-border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-smooth hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(255,165,0,0.25)] hover:border-[#FFA500]/30 group"
    >
      {/* Image */}
      <div className="relative overflow-hidden cursor-pointer" onClick={handleImageClick}>
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Click to view
            </span>
          </div>
        </div>
        {property.status === 'sold_out' && (
          <Badge className="absolute top-3 right-3 bg-destructive hover:bg-destructive text-destructive-foreground text-lg px-6 py-2 shadow-elegant animate-pulse z-10">
            SOLD OUT
          </Badge>
        )}
        {property.isNew && property.status !== 'sold_out' && (
          <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600 animate-bounce-in">
            New
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Title and Location */}
          <div className="text-slide-up">
            <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2 transition-all duration-300 ease-smooth group-hover:-translate-y-1 hover:text-primary">
              {property.title}
            </h3>
            <div className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300">
              <MapPin className="h-4 w-4 mr-1 animate-float" />
              <span className="text-sm">{property.location}</span>
            </div>
          </div>

          {/* Property Code */}
          {property.property_code && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span className="font-mono">{property.property_code}</span>
            </div>
          )}

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground stagger-children">
            <div className="flex items-center gap-1 hover:text-primary transition-colors duration-300 cursor-pointer hover-scale">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-primary transition-colors duration-300 cursor-pointer hover-scale">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-primary transition-colors duration-300 cursor-pointer hover-scale">
              <Maximize className="h-4 w-4" />
              <span>{property.area} sq ft</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 stagger-children">
            <Badge variant="outline" className="hover-scale cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-300">{property.type}</Badge>
            <Badge variant="outline" className="hover-scale cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-300">{property.furnishing}</Badge>
          </div>

          {/* Price with better visibility */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary transition-all duration-300 ease-smooth group-hover:-translate-y-1" style={{ textShadow: '0 2px 8px rgba(59, 130, 246, 0.3)' }}>
              {formatPrice(property.price)}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4">
            <Button
              variant="default"
              className="w-full group transition-all duration-300 ease-smooth hover:shadow-md"
              onClick={handleContactRequest}
              disabled={isSubmitting || property.status === 'sold_out'}
            >
              <Send className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              {isSubmitting ? 'Sending...' : 'Request a Call Back'}
            </Button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        media={[{
          id: property.id,
          image_url: property.image,
          media_type: 'image',
          display_order: 0
        }]}
        initialIndex={0}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};

export default PropertyCard;