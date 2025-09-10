import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Maximize, MapPin, Phone, Eye, Heart } from 'lucide-react';
import { useState } from 'react';

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
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

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
    <div className="card-elegant rounded-2xl overflow-hidden hover-lift">
      {/* Image */}
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        {property.isNew && (
          <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">
            New
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 h-8 w-8 rounded-full ${
            isFavorited ? 'bg-red-500 text-white' : 'bg-white/80 text-red-500'
          }`}
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Title and Location */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2">
              {property.title}
            </h3>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.location}</span>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              <span>{property.area} sq ft</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{property.type}</Badge>
            <Badge variant="outline">{property.furnishing}</Badge>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(property.price)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Link to={`/property/${property.id}`} className="flex-1">
              <Button variant="outline" className="w-full hover-scale">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
            <Button className="flex-1 btn-hero">
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;