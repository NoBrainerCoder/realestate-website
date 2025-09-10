import HeroSection from '@/components/HeroSection';
import PropertyCard from '@/components/PropertyCard';
import { mockProperties } from '@/data/mockProperties';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Shield, Award } from 'lucide-react';

const Index = () => {
  const featuredProperties = mockProperties.slice(0, 3);

  return (
    <div className="min-h-screen page-transition">
      {/* Hero Section */}
      <HeroSection />

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
    </div>
  );
};

export default Index;
