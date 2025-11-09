import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { formatPriceInput, displayPrice } from '@/utils/priceFormatter';

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [area, setArea] = useState('');
  const [budget, setBudget] = useState<[number, number]>([0, 100000000]);
  const [budgetChanged, setBudgetChanged] = useState(false);
  const [maxInput, setMaxInput] = useState('');
  const [bhk, setBhk] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [propertyType, setPropertyType] = useState('');
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

  const handleMaxChange = (input: string) => {
    setMaxInput(input);
    const numericValue = parseFloat(formatPriceInput(input));
    if (!isNaN(numericValue)) {
      setBudget([0, numericValue]);
      setBudgetChanged(true);
    } else if (input === '') {
      setBudget([0, 100000000]);
      setBudgetChanged(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setArea('');
    setBudget([0, 100000000]);
    setBudgetChanged(false);
    setMaxInput('');
    setBhk('');
    setFurnishing('');
    setPropertyType('');
  };

  return (
    <div className="bg-card backdrop-blur-sm rounded-xl shadow-card p-4 border border-border">
      <div className="space-y-4">
        {/* Search Bar with Autocomplete */}
        <div className="flex gap-3">
          <div className="flex-1 relative" ref={searchRef}>
            <Input
              placeholder="Search by location, builder, project name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.trim().length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
              className="h-10 text-sm"
            />
            {/* Autocomplete Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-elegant z-50 max-h-[300px] overflow-y-auto animate-slide-in-down">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 first:rounded-t-lg last:rounded-b-lg border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-3 w-3 opacity-50" />
                      <span className="text-sm font-medium">{suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button onClick={applyFilters} className="h-10 px-6">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Compact Filters Row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Area Select */}
          <div className="w-full sm:w-[160px]">
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto bg-popover z-50">
                {hyderabadAreas.map((areaName) => (
                  <SelectItem key={areaName} value={areaName} className="text-sm">
                    {areaName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* BHK Select */}
          <div className="w-full sm:w-[100px]">
            <Select value={bhk} onValueChange={setBhk}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="BHK" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="1" className="text-sm">1 BHK</SelectItem>
                <SelectItem value="2" className="text-sm">2 BHK</SelectItem>
                <SelectItem value="3" className="text-sm">3 BHK</SelectItem>
                <SelectItem value="4" className="text-sm">4 BHK</SelectItem>
                <SelectItem value="4+" className="text-sm">4 BHK+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Type Select */}
          <div className="w-full sm:w-[160px]">
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto bg-popover z-50">
                <SelectItem value="flat" className="text-sm">Flat / Apartment</SelectItem>
                <SelectItem value="plot" className="text-sm">Plot / Open Land</SelectItem>
                <SelectItem value="villa" className="text-sm">Villa</SelectItem>
                <SelectItem value="independent-house" className="text-sm">Independent House</SelectItem>
                <SelectItem value="commercial-building" className="text-sm">Commercial Building</SelectItem>
                <SelectItem value="shop" className="text-sm">Shop / Showroom</SelectItem>
                <SelectItem value="warehouse" className="text-sm">Warehouse</SelectItem>
                <SelectItem value="office" className="text-sm">Office Space</SelectItem>
                <SelectItem value="farmhouse" className="text-sm">Farmhouse</SelectItem>
                <SelectItem value="agriculture" className="text-sm">Agriculture Land</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Furnishing Status */}
          <div className="w-full sm:w-[160px]">
            <Select value={furnishing} onValueChange={setFurnishing}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Furnishing" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="furnished" className="text-sm">Furnished</SelectItem>
                <SelectItem value="semi-furnished" className="text-sm">Semi-Furnished</SelectItem>
                <SelectItem value="unfurnished" className="text-sm">Unfurnished</SelectItem>
                <SelectItem value="under-construction" className="text-sm">Under Construction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Max Budget Only */}
          <div className="w-full sm:w-[140px]">
            <Input
              type="text"
              placeholder="Max Budget"
              value={maxInput}
              onChange={(e) => handleMaxChange(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>

        {/* Active Filters */}
        {(area || bhk || propertyType || furnishing || budgetChanged) && (
          <div className="flex flex-wrap gap-2 items-center">
            {area && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                Area: {area}
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setArea('')} />
              </Badge>
            )}
            {bhk && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                {bhk} BHK
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setBhk('')} />
              </Badge>
            )}
            {propertyType && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                {propertyType}
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setPropertyType('')} />
              </Badge>
            )}
            {furnishing && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                {furnishing}
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setFurnishing('')} />
              </Badge>
            )}
            {budgetChanged && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                Max: {displayPrice(budget[1])}
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => {
                  setBudget([0, 100000000]);
                  setBudgetChanged(false);
                  setMaxInput('');
                }} />
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearFilters} 
              className="h-7 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;