import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import BuildingAnimation from './BuildingAnimation';
import SearchFilters from './SearchFilters';
import { ArrowRight, Calculator, Search } from 'lucide-react';

interface HeroSectionProps {
  onFiltersChange?: (filters: any) => void;
}

const HeroSection = ({ onFiltersChange }: HeroSectionProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const contentTimer = setTimeout(() => setShowContent(true), 2000);
    return () => clearTimeout(contentTimer);
  }, []);

  const handleFiltersChange = (filters: any) => {
    if (onFiltersChange) onFiltersChange(filters);
  };

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Clean Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1b3d] via-[#1a2f5a] to-[#0d2847]" />
        {/* Subtle decorative shapes */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#FFA500]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <BuildingAnimation />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${showContent ? 'text-fade-in' : 'opacity-0'}`}>
              Welcome to <span className="text-yellow-400">MyInfraHub</span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 text-white/80 max-w-3xl mx-auto ${showContent ? 'text-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              Find Your Perfect Property in Hyderabad's Prime Locations
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 ${showContent ? 'text-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <Link to="/properties">
                <Button size="lg" className="btn-hero text-lg px-8 py-6">
                  <Search className="h-5 w-5 mr-2" />
                  Browse Properties
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/emi-calculator">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-white/30 hover:bg-white/10 bg-white/5 backdrop-blur-sm">
                  <Calculator className="h-5 w-5 mr-2" />
                  EMI Calculator
                </Button>
              </Link>
            </div>
          </div>

          <div className={`${showContent ? 'text-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
            <SearchFilters onFiltersChange={handleFiltersChange} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
