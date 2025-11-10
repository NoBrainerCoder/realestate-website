import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Maximize, MapPin, Phone, Eye, Calendar, Mail } from 'lucide-react';
import AppointmentDialog from './AppointmentDialog';
import ContactInfoDialog from './ContactInfoDialog';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    area: number;
    bedrooms: number;
    bathrooms: number;
    type: string;
    furnishing: string;
    image: string;
    isNew?: boolean;
    status?: string;
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/property/${property.id}`);
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
      className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-smooth hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(59,130,246,0.2)] hover:border-primary/30 group"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary transition-all duration-300 ease-smooth group-hover:-translate-y-1">
              {formatPrice(property.price)}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <div className="flex gap-2 stagger-children">
              <Link to={`/property/${property.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                <Button variant="outline" className="w-full hover-lift ripple group">
                  <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  View Details
                </Button>
              </Link>
              <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                <ContactInfoDialog 
                  trigger={
                    <Button className="w-full btn-hero ripple group">
                      <Phone className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Contact
                    </Button>
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 stagger-children">
              <a 
                href="tel:+919866123350"
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="outline" className="w-full hover-lift ripple group">
                  <Phone className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Call Now
                </Button>
              </a>
              <a 
                href="mailto:myinfrahub.com@gmail.com"
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="outline" className="w-full hover-lift ripple group">
                  <Mail className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Send Email
                </Button>
              </a>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <AppointmentDialog 
                propertyId={property.id} 
                propertyTitle={property.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;