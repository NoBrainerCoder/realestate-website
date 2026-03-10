import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from '@/components/HeroSection';
import SustainabilitySection from '@/components/SustainabilitySection';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Shield, Award, Home, Star } from 'lucide-react';

const Index = () => {
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  
  const { data: approvedProperties = [], isLoading } = useQuery({
    queryKey: ['approved-properties'],
    queryFn: async () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
      
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
        .or(`status.eq.approved,and(status.eq.sold_out,sold_out_date.gte.${threeDaysAgo})`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(property => ({
        ...property,
        type: property.property_type,
        bedrooms: parseInt(property.bedrooms),
        bathrooms: parseInt(property.bathrooms),
        image: (property.property_images as any)?.[0]?.image_url || '/placeholder.svg',
        isNew: new Date(property.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }));
    }
  });

  const featuredProperties = approvedProperties.slice(0, 3);

  useEffect(() => {
    if (approvedProperties.length > 0) {
      setFilteredProperties(approvedProperties);
    }
  }, [approvedProperties]);

  const handleFiltersChange = (filters: any) => {
    let filtered = [...approvedProperties];

    if (filters.searchTerm) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        property.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.areas && filters.areas.length > 0) {
      filtered = filtered.filter(property => 
        filters.areas.some((area: string) =>
          property.location.toLowerCase().includes(area.toLowerCase())
        )
      );
    }

    if (filters.budget && filters.budget.length === 2) {
      const [minPrice, maxPrice] = filters.budget;
      filtered = filtered.filter(property => {
        const price = Number(property.price);
        return price >= minPrice && price <= maxPrice;
      });
    }

    if (filters.bhk) {
      const bhkValue = filters.bhk.replace('+', '');
      filtered = filtered.filter(property => {
        if (filters.bhk.includes('+')) {
          return property.bedrooms >= parseInt(bhkValue);
        }
        return property.bedrooms === parseInt(bhkValue);
      });
    }

    if (filters.propertyType) {
      filtered = filtered.filter(property => 
        property.property_type === filters.propertyType
      );
    }

    if (filters.furnishing) {
      filtered = filtered.filter(property => 
        property.furnishing === filters.furnishing
      );
    }

    setFilteredProperties(filtered);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection onFiltersChange={handleFiltersChange} />
      <SustainabilitySection />

      {/* Search Results */}
      {filteredProperties.length !== approvedProperties.length && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Search Results</h2>
              <p className="text-lg text-muted-foreground">Found {filteredProperties.length} properties matching your criteria</p>
            </div>
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
            <div className="text-center">
              <Link to="/properties">
                <Button size="lg" className="btn-hero group text-primary-foreground">
                  View All Properties
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Properties */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Properties</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover handpicked properties that offer the best value and location in Hyderabad
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/properties">
              <Button size="lg" className="btn-hero group text-primary-foreground">
                View All Properties
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose EcoNest?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide the most trusted platform for all your real estate needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, title: 'Market Insights', desc: 'Get real-time market data and property valuations' },
              { icon: Users, title: 'Expert Support', desc: '24/7 customer support from real estate experts' },
              { icon: Shield, title: 'Secure Transactions', desc: '100% verified properties and secure payment process' },
              { icon: Award, title: 'Trusted Platform', desc: 'Award-winning platform trusted by thousands' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 card-elegant hover-glow group rounded-xl">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who found their perfect homes with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/properties">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 min-w-[200px]">
                  <Home className="h-5 w-5 mr-2" />
                  Browse Properties
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 min-w-[200px] text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary bg-primary-foreground/10">
                  <Star className="h-5 w-5 mr-2" />
                  Get Expert Help
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
