import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PropertyCard from '@/components/PropertyCard';
import SearchFilters from '@/components/SearchFilters';
import { Button } from '@/components/ui/button';
import { Grid, List, SlidersHorizontal } from 'lucide-react';

const Properties = () => {
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);

  // Fetch approved properties from Supabase
  const { data: approvedProperties = [], isLoading } = useQuery({
    queryKey: ['approved-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (
            id,
            image_url,
            display_order
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match PropertyCard interface
      return (data || []).map(property => ({
        ...property,
        type: property.property_type,
        bedrooms: parseInt(property.bedrooms),
        bathrooms: parseInt(property.bathrooms),
        image: property.property_images?.[0]?.image_url || '/placeholder.svg',
        isNew: new Date(property.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Properties less than 7 days old
      }));
    }
  });

  useEffect(() => {
    if (approvedProperties.length > 0) {
      setFilteredProperties(approvedProperties);
    }
  }, [approvedProperties]);

  const handleFiltersChange = (filters: any) => {
    let filtered = [...approvedProperties];

    // Apply search term filter
    if (filters.searchTerm) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        property.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Apply area/location filter
    if (filters.area) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.area.toLowerCase())
      );
    }

    // Apply budget filter
    if (filters.budget && filters.budget.length === 2) {
      const [minPrice, maxPrice] = filters.budget;
      filtered = filtered.filter(property => {
        const price = Number(property.price);
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Apply BHK filter
    if (filters.bhk) {
      const bhkValue = filters.bhk.replace('+', '');
      filtered = filtered.filter(property => {
        if (filters.bhk.includes('+')) {
          return property.bedrooms >= parseInt(bhkValue);
        }
        return property.bedrooms === parseInt(bhkValue);
      });
    }

    // Apply property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(property => 
        property.property_type === filters.propertyType
      );
    }

    // Apply furnishing filter
    if (filters.furnishing) {
      filtered = filtered.filter(property => 
        property.furnishing === filters.furnishing
      );
    }

    setFilteredProperties(filtered);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 page-transition">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Properties in Hyderabad
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover {filteredProperties.length} properties matching your criteria
          </p>
        </div>

        {/* Search Filters */}
        {showFilters && (
          <div className="mb-8 slide-in-down">
            <SearchFilters onFiltersChange={handleFiltersChange} />
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-between items-center mb-6 stagger-children">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="hover-lift ripple group"
            >
              <SlidersHorizontal className={`h-4 w-4 mr-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''} group-hover:scale-110`} />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">View:</span>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="hover-scale ripple"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="hover-scale ripple"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Properties Grid/List */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12 fade-in-scale">
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className={`grid gap-6 stagger-children ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;