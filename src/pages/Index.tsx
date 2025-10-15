import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from '@/components/HeroSection';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Shield, Award, Home, Star } from 'lucide-react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

const Index = () => {
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  
  // Fetch approved properties from Supabase (excluding sold out properties older than 3 days)
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

  const featuredProperties = approvedProperties.slice(0, 3);
  
  // Animated counters
  const propertiesCount = useAnimatedCounter({ end: 500 });
  const customersCount = useAnimatedCounter({ end: 1000 });
  const areasCount = useAnimatedCounter({ end: 50 });
  const experienceCount = useAnimatedCounter({ end: 5 });

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
    <div className="min-h-screen page-transition">
      {/* Hero Section */}
      <HeroSection onFiltersChange={handleFiltersChange} />

      {/* Search Results - Only show if filters are applied */}
      {filteredProperties.length !== approvedProperties.length && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 reveal-up revealed">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Search Results
              </h2>
              <p className="text-lg text-muted-foreground">
                Found {filteredProperties.length} properties matching your criteria
              </p>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-12 fade-in-scale">
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 stagger-children">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            <div className="text-center fade-in-scale">
              <Link to="/properties">
                <Button size="lg" className="btn-hero ripple group">
                  View All Properties
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Properties */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 reveal-up revealed">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover handpicked properties that offer the best value and location in Hyderabad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 stagger-children">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center fade-in-scale">
            <Link to="/properties">
              <Button size="lg" className="btn-hero ripple group">
                View All Properties
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 reveal-up revealed">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Our numbers speak for themselves - join the community of satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-children">
            <div className="text-center p-6 hover-scale group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                <span ref={propertiesCount.elementRef}>{propertiesCount.count}</span>+
              </div>
              <div className="text-primary-foreground/80 text-sm md:text-base">Properties Listed</div>
            </div>

            <div className="text-center p-6 hover-scale group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                <span ref={customersCount.elementRef}>{customersCount.count}</span>+
              </div>
              <div className="text-primary-foreground/80 text-sm md:text-base">Happy Customers</div>
            </div>

            <div className="text-center p-6 hover-scale group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                <span ref={areasCount.elementRef}>{areasCount.count}</span>+
              </div>
              <div className="text-primary-foreground/80 text-sm md:text-base">Areas Covered</div>
            </div>

            <div className="text-center p-6 hover-scale group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                <span ref={experienceCount.elementRef}>{experienceCount.count}</span>+
              </div>
              <div className="text-primary-foreground/80 text-sm md:text-base">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 reveal-up revealed">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose MyInfraHub?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide the most trusted platform for all your real estate needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            <div className="text-center p-6 card-elegant hover-glow group">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <TrendingUp className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Market Insights</h3>
              <p className="text-muted-foreground">Get real-time market data and property valuations</p>
            </div>

            <div className="text-center p-6 card-elegant hover-glow group">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <Users className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Expert Support</h3>
              <p className="text-muted-foreground">24/7 customer support from real estate experts</p>
            </div>

            <div className="text-center p-6 card-elegant hover-glow group">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <Shield className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Secure Transactions</h3>
              <p className="text-muted-foreground">100% verified properties and secure payment process</p>
            </div>

            <div className="text-center p-6 card-elegant hover-glow group">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <Award className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Trusted Platform</h3>
              <p className="text-muted-foreground">Award-winning platform trusted by thousands</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto reveal-up revealed">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who found their perfect homes with us
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center stagger-children">
              <Link to="/properties">
                <Button size="lg" variant="secondary" className="btn-hero text-lg px-8 py-6 min-w-[200px]">
                  <Home className="h-5 w-5 mr-2" />
                  Browse Properties
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 min-w-[200px] text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary bg-primary-foreground/10 backdrop-blur-sm">
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
