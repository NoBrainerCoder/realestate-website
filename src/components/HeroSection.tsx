import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SearchFilters from './SearchFilters';
import { ArrowRight, Calculator, Search, Leaf } from 'lucide-react';

interface HeroSectionProps {
  onFiltersChange?: (filters: any) => void;
}

const HeroSection = ({ onFiltersChange }: HeroSectionProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleFiltersChange = (filters: any) => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col bg-background">
      {/* Subtle eco pattern background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 ${showContent ? 'text-fade-in' : 'opacity-0'}`}>
              <Leaf className="h-4 w-4" />
              <span className="text-sm font-medium">Eco-Friendly Real Estate Platform</span>
            </div>
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 text-foreground ${showContent ? 'text-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
              Welcome to <span className="text-primary">EcoNest</span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto ${showContent ? 'text-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              Find sustainable and smart properties in Hyderabad
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 ${showContent ? 'text-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <Link to="/properties">
                <Button size="lg" className="btn-hero text-lg px-8 py-6 text-primary-foreground">
                  <Search className="h-5 w-5 mr-2" />
                  Browse Properties
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/emi-calculator">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Calculator className="h-5 w-5 mr-2" />
                  EMI Calculator
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Filters */}
          <div className={`${showContent ? 'text-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <SearchFilters onFiltersChange={handleFiltersChange} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
