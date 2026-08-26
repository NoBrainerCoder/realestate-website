import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from '@/components/HeroSection';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, MapPinned, BadgeIndianRupee, Headphones } from 'lucide-react';
import QuantumLoader from '@/components/QuantumLoader';

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: 'Verified Listings',
    description: 'Every property is reviewed and approved by our team before it goes live.',
  },
  {
    icon: MapPinned,
    title: 'Hyderabad Expertise',
    description: 'Deep coverage of 150+ localities, from Gachibowli to Uppal.',
  },
  {
    icon: BadgeIndianRupee,
    title: 'Zero Brokerage Leads',
    description: 'Request a call back and talk to our team directly — no hidden charges.',
  },
  {
    icon: Headphones,
    title: 'Support That Answers',
    description: 'Call +91 9866123350 or write to us and get a response the same day.',
  },
];

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
        image: (property.property_images as any)?.[0]?.image_url || '/placeholder.svg',
        isNew: new Date(property.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Properties less than 7 days old
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

    // Apply search term filter
    if (filters.searchTerm) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        property.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Apply areas filter (multiple selected areas)
    if (filters.areas && filters.areas.length > 0) {
      filtered = filtered.filter(property => 
        filters.areas.some((area: string) =>
          property.location.toLowerCase().includes(area.toLowerCase())
        )
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
        <QuantumLoader size="65" />
      </div>
    );
  }

  return (
    <div className="min-h-screen page-transition">
      {/* Hero Section */}
      <HeroSection onFiltersChange={handleFiltersChange} />

      {/* Search Results - Only show if filters are applied */}
      {filteredProperties.length !== approvedProperties.length && (
        <section className="py-8 md:py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6 md:mb-8 reveal-up revealed">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-4">
                Search Results
              </h2>
              <p className="text-sm md:text-lg text-muted-foreground">
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
      <section className="py-8 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-12 reveal-up revealed">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-4">
              Featured Properties
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover handpicked properties that offer the best value and location in Hyderabad
            </p>
          </div>

          {featuredProperties.length === 0 ? (
            <div className="text-center py-10 fade-in-scale">
              <h3 className="text-lg font-semibold mb-2">No properties listed yet</h3>
              <p className="text-muted-foreground text-sm">
                New listings appear here as soon as they are approved.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 stagger-children">
              {featuredProperties.map((property) => (
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

      {/* Why Choose Us */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 reveal-up revealed">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-4">
              Why Choose MyInfraHub
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              A simpler, safer way to buy, sell and rent property in Hyderabad
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">
            {whyChooseUs.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-lg p-5 md:p-6 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-[0_4px_20px_hsl(var(--primary)/0.2)]"
              >
                <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-10 md:py-16 bg-gradient-to-br from-[#0f1b3d] to-[#1a2f5a]">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-3">
            Have a property to <span className="text-yellow-400">list?</span>
          </h2>
          <p className="text-sm md:text-lg text-white/80 max-w-2xl mx-auto mb-6">
            Post your property for free. Our team reviews every listing before it goes live.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/post-property">
              <Button size="lg" className="w-full sm:w-auto hover-scale">
                Post Your Property
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10">
                Talk to Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
