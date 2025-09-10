import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [area, setArea] = useState('');
  const [budget, setBudget] = useState([0, 10000000]);
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
    <div className="bg-background/95 backdrop-blur-sm rounded-2xl shadow-elegant p-6 border border-border">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by location, builder, project name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <Button onClick={handleSearch} className="btn-hero h-12 px-8">
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger>
              <SelectValue placeholder="Select Area" />
            </SelectTrigger>
            <SelectContent>
              {hyderabadAreas.map((areaName) => (
                <SelectItem key={areaName} value={areaName}>
                  {areaName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={bhk} onValueChange={setBhk}>
            <SelectTrigger>
              <SelectValue placeholder="BHK" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 BHK</SelectItem>
              <SelectItem value="2">2 BHK</SelectItem>
              <SelectItem value="3">3 BHK</SelectItem>
              <SelectItem value="4">4 BHK</SelectItem>
              <SelectItem value="4+">4 BHK+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="independent-house">Independent House</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-10"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showAdvanced ? 'Less Filters' : 'More Filters'}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget Slider */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Budget Range: ₹{budget[0].toLocaleString()} - ₹{budget[1].toLocaleString()}
                </label>
                <Slider
                  value={budget}
                  onValueChange={setBudget}
                  max={100000000}
                  min={0}
                  step={100000}
                  className="w-full"
                />
              </div>

              {/* Furnishing */}
              <Select value={furnishing} onValueChange={setFurnishing}>
                <SelectTrigger>
                  <SelectValue placeholder="Furnishing Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="furnished">Furnished</SelectItem>
                  <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                  <SelectItem value="unfurnished">Unfurnished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2">
              {area && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Area: {area}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setArea('')} />
                </Badge>
              )}
              {bhk && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {bhk} BHK
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setBhk('')} />
                </Badge>
              )}
              {propertyType && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {propertyType}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setPropertyType('')} />
                </Badge>
              )}
              {furnishing && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {furnishing}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setFurnishing('')} />
                </Badge>
              )}
              
              <Button variant="ghost" size="sm" onClick={clearFilters}>
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