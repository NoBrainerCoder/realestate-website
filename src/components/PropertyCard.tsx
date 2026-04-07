import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Maximize, MapPin, Send, Hash, ImageOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const hasImage = property.image && property.image.trim() !== '';

  const handleCardClick = () => {
    navigate(`/property/${property.id}`);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasImage) setLightboxOpen(true);
  };

  const handleContactRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/sign-in');
      toast({ title: 'Sign in required', description: 'Please sign in to send contact requests' });
      return;
    }
    setPhoneDialogOpen(true);
  };

  const submitContactRequest = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      toast({ title: 'Phone number required', description: 'Please enter a valid 10-digit phone number', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const { data: profile } = await supabase.from('profiles').select('display_name').eq('user_id', user!.id).single();
      const { error } = await supabase.from('contact_requests').insert({
        property_id: property.id,
        property_code: property.property_code || 'N/A',
        property_title: property.title,
        property_location: property.location,
        user_id: user!.id,
        user_name: profile?.display_name || user!.email?.split('@')[0] || 'User',
        user_email: user!.email || '',
        user_phone: phoneNumber
      });
      if (error) throw error;
      toast({ title: 'Success', description: 'Contact request sent successfully! We will call you back soon.' });
      setPhoneDialogOpen(false);
      setPhoneNumber('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send contact request', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className="property-card-animate bg-card border border-border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-smooth hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(255,165,0,0.25)] hover:border-[#FFA500]/30 group"
    >
      {/* Image / Placeholder */}
      <div className="relative overflow-hidden cursor-pointer h-48" onClick={handleImageClick}>
        {hasImage ? (
          <>
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click to view
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-2">
            <ImageOff className="h-10 w-10 text-muted-foreground/40" />
            <span className="text-sm text-muted-foreground/60 font-medium">No Image Available</span>
          </div>
        )}
        {property.status === 'sold_out' && (
          <Badge className="absolute top-3 right-3 bg-destructive hover:bg-destructive text-destructive-foreground text-lg px-6 py-2 shadow-elegant animate-pulse z-10">
            SOLD OUT
          </Badge>
        )}
        {property.isNew && property.status !== 'sold_out' && (
          <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600 animate-bounce-in">New</Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="text-slide-up">
            <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2 transition-all duration-300 ease-smooth group-hover:-translate-y-1 hover:text-primary">
              {property.title}
            </h3>
            <div className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300">
              <MapPin className="h-4 w-4 mr-1 animate-float" />
              <span className="text-sm">{property.location}</span>
            </div>
          </div>

          {property.property_code && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span className="font-mono">{property.property_code}</span>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 hover:text-primary transition-colors duration-300">
              <Bed className="h-4 w-4" /><span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-primary transition-colors duration-300">
              <Bath className="h-4 w-4" /><span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-primary transition-colors duration-300">
              <Maximize className="h-4 w-4" /><span>{property.area} sq ft</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all duration-300">{property.type}</Badge>
            <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all duration-300">{property.furnishing}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">{formatPrice(property.price)}</div>
          </div>

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
      {hasImage && (
        <ImageLightbox
          media={[{ id: property.id, image_url: property.image, media_type: 'image', display_order: 0 }]}
          initialIndex={0}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Phone Number Dialog */}
      <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Request a Call Back</DialogTitle>
            <DialogDescription>Please provide your phone number so we can call you back about this property.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" placeholder="Enter your 10-digit phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} maxLength={10} />
            </div>
            <Button className="w-full" onClick={submitContactRequest} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyCard;
