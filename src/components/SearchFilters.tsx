import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { formatPriceInput, displayPrice } from '@/utils/priceFormatter';

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [budget, setBudget] = useState<[number, number]>([0, 100000000]);
  const [budgetChanged, setBudgetChanged] = useState(false);
  const [maxInput, setMaxInput] = useState('');
  const [bhk, setBhk] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hyderabadAreas = [
    // Central Hyderabad
    'Abids', 'Afzal Gunj', 'Ameerpet', 'Asif Nagar', 'Attapur', 'Azampur', 'Banjara Hills', 'Bahadurpura',
    'Begum Bazar', 'Bholakpur', 'Chandrayangutta', 'Charminar', 'Chaderghat', 'Dabeerpura', 'Dilsukhnagar',
    'Erragadda', 'Feelkhana', 'Golconda Fort', 'Goshamahal', 'Gudimalkapur', 'Himayatnagar', 'Hyderguda',
    'Jubilee Hills', 'Karwan', 'Khairatabad', 'King Koti', 'Koti', 'Lakdikapool', 'Malakpet', 'Masab Tank',
    'Mehdipatnam', 'Musheerabad', 'Narayanguda', 'Nampally', 'Old City', 'Panjagutta', 'Pragatinagar', 
    'Purani Haveli', 'Rajendranagar', 'Red Hills', 'Sanathnagar', 'Sanjeeva Reddy Nagar', 'Santosh Nagar', 
    'Secunderabad', 'Shahalibanda', 'Shalibanda', 'Somajiguda', 'Tappachabutra', 'Tolichowki', 'Yakutpura',
    
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
      areas: selectedAreas,
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
  }, [searchTerm, selectedAreas, budget, bhk, furnishing, propertyType, budgetChanged]);

  // Handle search term changes and generate suggestions
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = hyderabadAreas
        .filter(areaName => 
          areaName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedAreas.includes(areaName)
        )
        .slice(0, 8); // Limit to 8 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, selectedAreas]);

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
    setSelectedAreas(prev => [...prev, suggestion]);
    setSearchTerm('');
    setShowSuggestions(false);
    // Keep focus on input
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const removeArea = (areaToRemove: string) => {
    setSelectedAreas(prev => prev.filter(a => a !== areaToRemove));
    // Keep focus on input
    setTimeout(() => inputRef.current?.focus(), 0);
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
    setSelectedAreas([]);
    setBudget([0, 100000000]);
    setBudgetChanged(false);
    setMaxInput('');
    setBhk('');
    setFurnishing('');
    setPropertyType('');
  };

  return (
    <div className="flex justify-center">
      <div className="bg-card backdrop-blur-sm rounded-xl shadow-card p-2.5 border border-border w-fit mx-auto" style={{ maxHeight: '85%' }}>
        <div className="space-y-2">
          {/* Search Bar with Multi-Location Tags - Centered */}
          <div className="flex gap-2 justify-center">
            <div className="w-full md:w-[500px] relative" ref={searchRef}>
              <div className="flex items-center flex-wrap gap-1.5 min-h-[32px] rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 shadow-md">
              {/* Selected Area Tags - More compact */}
              {selectedAreas.map((area) => (
                <Badge 
                  key={area} 
                  variant="secondary" 
                  className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] h-5 rounded-full"
                >
                  {area}
                  <X 
                    className="h-2.5 w-2.5 cursor-pointer hover:text-destructive" 
                    onClick={() => removeArea(area)} 
                  />
                </Badge>
              ))}
              {/* Input for typing new locations */}
              <input
                ref={inputRef}
                type="text"
                placeholder={selectedAreas.length === 0 ? "Search locations (e.g., Gachibowli)" : "Add more..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.trim().length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
                className="flex-1 min-w-[150px] bg-transparent outline-none placeholder:text-muted-foreground text-foreground text-xs"
              />
              </div>
              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-elegant z-50 max-h-[240px] overflow-y-auto animate-fade-in">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1.5 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 first:rounded-t-lg last:rounded-b-lg border-b border-border last:border-b-0"
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
            <Button onClick={applyFilters} className="h-8 px-4 text-xs shadow-md">
              <Search className="h-3 w-3 mr-1" />
              Search
            </Button>
          </div>

          {/* Compact Filters Row - Centered */}
          <div className="flex flex-wrap gap-1.5 items-center justify-center">
            {/* BHK Select - More compact */}
            <div className="w-full sm:w-[85px]">
            <Select value={bhk} onValueChange={setBhk}>
              <SelectTrigger className="h-7 text-[11px] px-2">
                <SelectValue placeholder="BHK" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="1" className="text-[11px]">1 BHK</SelectItem>
                <SelectItem value="2" className="text-[11px]">2 BHK</SelectItem>
                <SelectItem value="3" className="text-[11px]">3 BHK</SelectItem>
                <SelectItem value="4" className="text-[11px]">4 BHK</SelectItem>
                <SelectItem value="4+" className="text-[11px]">4 BHK+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Type Select - More compact */}
          <div className="w-full sm:w-[120px]">
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-7 text-[11px] px-2">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto bg-popover z-50">
                <SelectItem value="flat" className="text-[11px]">Flat / Apartment</SelectItem>
                <SelectItem value="plot" className="text-[11px]">Plot / Open Land</SelectItem>
                <SelectItem value="villa" className="text-[11px]">Villa</SelectItem>
                <SelectItem value="independent-house" className="text-[11px]">Independent House</SelectItem>
                <SelectItem value="commercial-building" className="text-[11px]">Commercial Building</SelectItem>
                <SelectItem value="shop" className="text-[11px]">Shop / Showroom</SelectItem>
                <SelectItem value="warehouse" className="text-[11px]">Warehouse</SelectItem>
                <SelectItem value="office" className="text-[11px]">Office Space</SelectItem>
                <SelectItem value="farmhouse" className="text-[11px]">Farmhouse</SelectItem>
                <SelectItem value="agriculture" className="text-[11px]">Agriculture Land</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Furnishing Status - More compact */}
          <div className="w-full sm:w-[130px]">
            <Select value={furnishing} onValueChange={setFurnishing}>
              <SelectTrigger className="h-7 text-[11px] px-2">
                <SelectValue placeholder="Furnishing" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="furnished" className="text-[11px]">Furnished</SelectItem>
                <SelectItem value="semi-furnished" className="text-[11px]">Semi-Furnished</SelectItem>
                <SelectItem value="unfurnished" className="text-[11px]">Unfurnished</SelectItem>
                <SelectItem value="under-construction" className="text-[11px]">Under Construction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Max Budget Only - More compact */}
          <div className="w-full sm:w-[115px]">
            <input
              type="text"
              placeholder="Max Budget"
              value={maxInput}
              onChange={(e) => handleMaxChange(e.target.value)}
              className="flex h-7 w-full rounded-md border border-input bg-background px-2 py-1 text-[11px] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground"
            />
            </div>
          </div>

          {/* Active Filters - Centered */}
          {(selectedAreas.length > 0 || bhk || propertyType || furnishing || budgetChanged) && (
            <div className="flex flex-wrap gap-1.5 items-center justify-center">
              {bhk && (
                <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5 text-[10px]">
                  {bhk} BHK
                  <X className="h-2.5 w-2.5 cursor-pointer hover:text-destructive" onClick={() => setBhk('')} />
                </Badge>
              )}
              {propertyType && (
                <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5 text-[10px]">
                  {propertyType}
                  <X className="h-2.5 w-2.5 cursor-pointer hover:text-destructive" onClick={() => setPropertyType('')} />
                </Badge>
              )}
              {furnishing && (
                <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5 text-[10px]">
                  {furnishing}
                  <X className="h-2.5 w-2.5 cursor-pointer hover:text-destructive" onClick={() => setFurnishing('')} />
                </Badge>
              )}
              {budgetChanged && (
                <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5 text-[10px]">
                  Max: {displayPrice(budget[1])}
                  <X className="h-2.5 w-2.5 cursor-pointer hover:text-destructive" onClick={() => {
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
                className="h-6 px-2 text-[10px]"
              >
                <X className="h-2.5 w-2.5 mr-0.5" />
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;