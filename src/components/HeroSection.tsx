import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SearchFilters from './SearchFilters';
import BuildingAnimation from './BuildingAnimation';
import { Calculator, Search } from 'lucide-react';

interface HeroSectionProps {
  onFiltersChange?: (filters: any) => void;
}

const HeroSection = ({ onFiltersChange }: HeroSectionProps) => {
  const handleFiltersChange = (filters: any) => {
    if (onFiltersChange) onFiltersChange(filters);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f1b3d] to-[#1a2f5a] py-10 md:py-24">
      {/* Animated skyline */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <BuildingAnimation />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center text-white mb-6 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-slide-up">
            Welcome to <span className="text-yellow-400">MyInfraHub</span>
          </h1>
          <p className="text-sm md:text-lg mb-4 md:mb-6 text-white/80 max-w-2xl mx-auto">
            Find Your Perfect Property in Hyderabad's Prime Locations
          </p>
          <div className="hidden md:flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link to="/properties">
              <Button size="default" className="hover-scale">
                <Search className="h-4 w-4 mr-2" />
                Browse Properties
              </Button>
            </Link>
            <Link to="/emi-calculator">
              <Button size="default" variant="outline" className="text-white border-white/30 hover:bg-white/10 bg-transparent hover-scale">
                <Calculator className="h-4 w-4 mr-2" />
                EMI Calculator
              </Button>
            </Link>
          </div>
        </div>
        <SearchFilters onFiltersChange={handleFiltersChange} />
      </div>
    </section>
  );
};

export default HeroSection;
