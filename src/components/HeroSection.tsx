import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import BuildingAnimation from './BuildingAnimation';
import SearchFilters from './SearchFilters';
import { ArrowRight, Calculator, Search, Home, Key, Building2 } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import { useAuth } from '@/hooks/useAuth';

interface HeroSectionProps {
  onFiltersChange?: (filters: any) => void;
}

const backgroundImages = [
  heroBg,
  heroBg, // Add more images here when needed
];

const HeroSection = ({ onFiltersChange }: HeroSectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Start content animation after building animation
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(contentTimer);
  }, []);

  useEffect(() => {
    // Background image rotation
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        (prev + 1) % backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleFiltersChange = (filters: any) => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Animated Background - Lighter Navy */}
      <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#142C5A' }}>
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Building Animation */}
      <BuildingAnimation />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${showContent ? 'text-fade-in' : 'opacity-0'}`}>
              Welcome to MyInfraHub
            </h1>
            <p className={`text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto ${showContent ? 'text-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
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
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-white hover:bg-white hover:text-primary bg-white/10 backdrop-blur-sm">
                  <Calculator className="h-5 w-5 mr-2" />
                  EMI Calculator
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Filters - Centered */}
          <div className={`${showContent ? 'text-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
            <SearchFilters onFiltersChange={handleFiltersChange} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;