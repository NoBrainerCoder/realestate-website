import { useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import SearchFilters from '@/components/SearchFilters';
import { mockProperties, filterProperties } from '@/data/mockProperties';
import { Button } from '@/components/ui/button';
import { Grid, List, SlidersHorizontal } from 'lucide-react';

const Properties = () => {
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);

  const handleFiltersChange = (filters: any) => {
    const filtered = filterProperties(filters);
    setFilteredProperties(filtered);
  };

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