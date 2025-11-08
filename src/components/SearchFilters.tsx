import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BudgetInput } from '@/components/BudgetInput';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [area, setArea] = useState('');
  const [budget, setBudget] = useState<[number, number]>([0, 100000000]);
  const [budgetChanged, setBudgetChanged] = useState(false);
  const [bhk, setBhk] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const hyderabadAreas = [
    // Central Hyderabad
    'Abids', 'Afzal Gunj', 'Ameerpet', 'Asif Nagar', 'Attapur', 'Azampur', 'Banjara Hills', 'Bahadurpura',
    'Begum Bazar', 'Bholakpur', 'Chandrayangutta', 'Charminar', 'Chaderghat', 'Dabeerpura', 'Dilsukhnagar',
    'Erragadda', 'Feelkhana', 'Golconda Fort', 'Goshamahal', 'Gudimalkapur', 'Himayatnagar', 'Hyderguda',
    'Jubilee Hills', 'Karwan', 'Khairatabad', 'King Koti', 'Koti', 'Lakdikapool', 'Malakpet', 'Masab Tank',
    'Mehdipatnam', 'Musheerabad', 'Narayanguda', 'Nampally', 'Old City', 'Panjagutta', 'Purani Haveli',
    'Rajendranagar', 'Red Hills', 'Sanathnagar', 'Sanjeeva Reddy Nagar', 'Santosh Nagar', 'Secunderabad',
    'Shahalibanda', 'Shalibanda', 'Somajiguda', 'Tappachabutra', 'Tolichowki', 'Yakutpura',
    
    // North Hyderabad
    'Alwal', 'Bollaram', 'Bowenpally', 'Balanagar', 'Chintal', 'Compally', 'Dundigal', 'Gajularamaram',
    'Hafeezpet', 'IDA Jeedimetla', 'Jeedimetla', 'Kukatpally', 'Malkajgiri', 'Medchal', 'Miyapur',
    'Moosapet', 'Quthbullapur', 'Yapral',
    
    // West Hyderabad
    'Chandanagar', 'Gachibowli', 'Gopanpally', 'Hitech City', 'Hydernagar', 'Kondapur', 'Lingampally',
    'Madhapur', 'Madinaguda', 'Nizampet', 'Patancheru', 'Serilingampally', 'BHEL', 'Ramchandrapuram',
    
    // East Hyderabad
    'Abdullapurmet', 'Amberpet', 'AS Rao Nagar', 'BN Reddy Nagar', 'Boduppal', 'Chaitanyapuri', 
    'Chengicherla', 'Dammaiguda', 'ECIL', 'Falaknuma', 'Gaddiannaram', 'Ghatkesar', 'Hayathnagar',
    'Habsiguda', 'KPHB Colony', 'Kapra', 'Keesara', 'L B Nagar', 'Mansoorabad', 'Moulali', 'Nagole',
    'Nacharam', 'Peerzadiguda', 'Ramanthapur', 'RK Puram', 'Sainikpuri', 'Saroornagar', 'Tarnaka',
    'Uppal', 'Vanasthalipuram', 'Vidyanagar', 'Moula Ali',
    
    // South Hyderabad
    'Adibatla', 'Aramghar', 'Badangpet', 'Bandlaguda', 'Balapur', 'Chintalkunta', 'Kothapet', 
    'Kothur', 'Mailardevpally', 'Mamidipalli', 'Mangalhat', 'Meerpet', 'Nadergul', 'Narsingi',
    'Pahadi Shareef', 'Saidabad', 'Shamshabad', 'Shivarampally', 'Tukkuguda',
    
    // Emerging & Outer Areas
    'Financial District', 'Kokapet', 'Kollur', 'Mokila', 'Nanakramguda', 'Osman Nagar', 'Puppalaguda',
    'Raidurg', 'Shankarpalli', 'Tellapur', 'Vattinagulapally', 'Mokila', 'Khajaguda'
  ].sort();

  const applyFilters = () => {
    const filters: any = {
      searchTerm,
      area,
      bhk,
      furnishing,
      propertyType,
    };
    // Only include budget if user has changed it
    if (budgetChanged) {
      filters.budget = budget;
    }
    onFiltersChange(filters);
  };

  // Apply filters immediately when any value changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, area, budget, bhk, furnishing, propertyType, budgetChanged]);

  // Handle search term changes and generate suggestions
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = hyderabadAreas.filter(areaName =>
        areaName.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 8); // Limit to 8 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setArea(suggestion);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setArea('');
    setBudget([0, 100000000]);
    setBudgetChanged(false);
    setBhk('');
    setFurnishing('');
    setPropertyType('');
  };

  return (
    <div className="bg-background/95 backdrop-blur-sm rounded-2xl shadow-elegant p-6 border border-border hover-glow fade-in-scale">
      <div className="space-y-6">
        {/* Search Bar with Autocomplete */}
        <div className="flex gap-4 stagger-children">
          <div className="flex-1 relative" ref={searchRef}>
            <Input
              placeholder="Search by location, builder, project name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.trim().length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
              className="h-12 text-base form-input focus:scale-105 transition-all duration-300"
            />
            {/* Autocomplete Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-elegant z-50 max-h-[300px] overflow-y-auto animate-slide-in-down">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-3 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 first:rounded-t-lg last:rounded-b-lg border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 opacity-50" />
                      <span className="font-medium">{suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button onClick={applyFilters} className="btn-hero h-12 px-8 hover-lift ripple group">
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
            <SelectContent className="animate-slide-in-down max-h-[300px] overflow-y-auto">
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
            <SelectContent className="animate-slide-in-down max-h-[300px] overflow-y-auto">
              <SelectItem value="flat" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Flat / Apartment</SelectItem>
              <SelectItem value="plot" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Plot / Open Land</SelectItem>
              <SelectItem value="villa" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Villa</SelectItem>
              <SelectItem value="independent-house" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Independent House</SelectItem>
              <SelectItem value="commercial-building" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Commercial Building</SelectItem>
              <SelectItem value="shop" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Shop / Showroom</SelectItem>
              <SelectItem value="warehouse" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Warehouse</SelectItem>
              <SelectItem value="office" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Office Space</SelectItem>
              <SelectItem value="farmhouse" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Farmhouse</SelectItem>
              <SelectItem value="agriculture" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200">Agriculture Land</SelectItem>
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
              {/* Budget Input */}
              <div className="form-group">
                <BudgetInput
                  value={budget}
                  onValueChange={(value) => {
                    setBudget(value);
                    setBudgetChanged(true);
                  }}
                  label="Budget Range"
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
            <div className="flex flex-wrap gap-2 items-center stagger-children">
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
            </div>
          </div>
        )}

        {/* Clear All Filters Button at Bottom */}
        {(area || bhk || propertyType || furnishing || searchTerm) && (
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={clearFilters} 
              className="w-full hover-shake ripple"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;