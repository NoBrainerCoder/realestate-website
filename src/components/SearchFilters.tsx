import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SliderWithInput } from '@/components/ui/slider-with-input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [area, setArea] = useState('');
  const [budget, setBudget] = useState<[number, number]>([0, 10000000]);
  const [bhk, setBhk] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hyderabadAreas = [
    'Kukatpally', 'Ameerpet', 'Erragadda', 'Sanathnagar', 'Madhapur', 
    'Gachibowli', 'Hitech City', 'Kondapur', 'Miyapur', 'Nizampet'
  ];

  const handleSearch = () => {
    const filters = {
      searchTerm,
      area,
      budget,
      bhk,
      furnishing,
      propertyType,
    };
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setArea('');
    setBudget([0, 10000000]);
    setBhk('');
    setFurnishing('');
    setPropertyType('');
    onFiltersChange({});
  };

  return (
    <div className="bg-background/95 backdrop-blur-sm rounded-2xl shadow-elegant p-6 border border-border hover-glow fade-in-scale">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex gap-4 stagger-children">
          <div className="flex-1">
            <Input
              placeholder="Search by location, builder, project name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 text-base form-input focus:scale-105 transition-all duration-300"
            />
          </div>
          <Button onClick={handleSearch} className="btn-hero h-12 px-8 hover-lift ripple group">
            <Search className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Search
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 stagger-children">
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger className="form-input hover-lift">
              <SelectValue placeholder="Select Area" />
            </SelectTrigger>
            <SelectContent className="animate-slide-in-down">
              {hyderabadAreas.map((areaName) => (
                <SelectItem key={areaName} value={areaName} className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
                  {areaName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={bhk} onValueChange={setBhk}>
            <SelectTrigger className="form-input hover-lift">
              <SelectValue placeholder="BHK" />
            </SelectTrigger>
            <SelectContent className="animate-slide-in-down">
              <SelectItem value="1" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">1 BHK</SelectItem>
              <SelectItem value="2" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">2 BHK</SelectItem>
              <SelectItem value="3" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">3 BHK</SelectItem>
              <SelectItem value="4" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">4 BHK</SelectItem>
              <SelectItem value="4+" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">4 BHK+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="form-input hover-lift">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent className="animate-slide-in-down">
              <SelectItem value="apartment" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Apartment</SelectItem>
              <SelectItem value="independent-house" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Independent House</SelectItem>
              <SelectItem value="villa" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Villa</SelectItem>
              <SelectItem value="commercial" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Commercial</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-10 hover-lift ripple group"
          >
            <Filter className={`h-4 w-4 mr-2 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''} group-hover:scale-110`} />
            {showAdvanced ? 'Less Filters' : 'More Filters'}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 border-t pt-4 slide-in-down">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
              {/* Budget Slider */}
              <div className="form-group">
                <SliderWithInput
                  value={budget}
                  onValueChange={setBudget}
                  min={0}
                  max={100000000}
                  step={100000}
                  label="Budget Range"
                  formatValue={(value) => `₹${value.toLocaleString()}`}
                  className="w-full"
                />
              </div>

              {/* Furnishing */}
              <Select value={furnishing} onValueChange={setFurnishing}>
                <SelectTrigger className="form-input hover-lift">
                  <SelectValue placeholder="Furnishing Status" />
                </SelectTrigger>
                <SelectContent className="animate-slide-in-down">
                  <SelectItem value="furnished" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Furnished</SelectItem>
                  <SelectItem value="semi-furnished" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Semi-Furnished</SelectItem>
                  <SelectItem value="unfurnished" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Unfurnished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 stagger-children">
              {area && (
                <Badge variant="secondary" className="flex items-center gap-1 hover-scale animate-bounce-in">
                  Area: {area}
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200 hover:scale-125" onClick={() => setArea('')} />
                </Badge>
              )}
              {bhk && (
                <Badge variant="secondary" className="flex items-center gap-1 hover-scale animate-bounce-in">
                  {bhk} BHK
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200 hover:scale-125" onClick={() => setBhk('')} />
                </Badge>
              )}
              {propertyType && (
                <Badge variant="secondary" className="flex items-center gap-1 hover-scale animate-bounce-in">
                  {propertyType}
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200 hover:scale-125" onClick={() => setPropertyType('')} />
                </Badge>
              )}
              {furnishing && (
                <Badge variant="secondary" className="flex items-center gap-1 hover-scale animate-bounce-in">
                  {furnishing}
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200 hover:scale-125" onClick={() => setFurnishing('')} />
                </Badge>
              )}
              
              <Button variant="ghost" size="sm" onClick={clearFilters} className="hover-shake ripple">
                Clear All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;