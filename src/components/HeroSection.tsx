import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SearchFilters from './SearchFilters';
import { Calculator, Search } from 'lucide-react';

interface HeroSectionProps {
  onFiltersChange?: (filters: any) => void;
}

const HeroSection = ({ onFiltersChange }: HeroSectionProps) => {
  const handleFiltersChange = (filters: any) => {
    if (onFiltersChange) onFiltersChange(filters);
  };

  return (
    <section className="relative bg-gradient-to-br from-[#0f1b3d] to-[#1a2f5a] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center text-white mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="text-yellow-400">MyInfraHub</span>
          </h1>
          <p className="text-base md:text-lg mb-6 text-white/80 max-w-2xl mx-auto">
            Find Your Perfect Property in Hyderabad's Prime Locations
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link to="/properties">
              <Button size="default">
                <Search className="h-4 w-4 mr-2" />
                Browse Properties
              </Button>
            </Link>
            <Link to="/emi-calculator">
              <Button size="default" variant="outline" className="text-white border-white/30 hover:bg-white/10 bg-transparent">
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
