import HeroSection from '@/components/HeroSection';
import PropertyCard from '@/components/PropertyCard';
import { mockProperties } from '@/data/mockProperties';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Shield, Award, Home, MapPin, Clock, Star } from 'lucide-react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

const Index = () => {
  const featuredProperties = mockProperties.slice(0, 3);
  
  // Animated counters
  const propertiesCount = useAnimatedCounter({ end: 500 });
  const customersCount = useAnimatedCounter({ end: 1000 });
  const areasCount = useAnimatedCounter({ end: 50 });
  const experienceCount = useAnimatedCounter({ end: 5 });

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
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 min-w-[200px] text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
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
