import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPriceInput, displayPrice } from '@/utils/priceFormatter';

interface BudgetInputProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  label?: string;
}

export const BudgetInput = ({ value, onValueChange, label }: BudgetInputProps) => {
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');

  useEffect(() => {
    // Initialize with formatted values
    if (value[0] > 0) setMinInput(displayPrice(value[0]));
    if (value[1] < 100000000) setMaxInput(displayPrice(value[1]));
  }, []);

  const handleMinChange = (input: string) => {
    setMinInput(input);
    const numericValue = parseFloat(formatPriceInput(input));
    if (!isNaN(numericValue)) {
      onValueChange([numericValue, value[1]]);
    }
  };

  const handleMaxChange = (input: string) => {
    setMaxInput(input);
    const numericValue = parseFloat(formatPriceInput(input));
    if (!isNaN(numericValue)) {
      onValueChange([value[0], numericValue]);
    }
  };

  return (
    <div className="space-y-3">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="min-budget" className="text-xs text-muted-foreground">Min Budget</Label>
          <Input
            id="min-budget"
            type="text"
            value={minInput}
            onChange={(e) => handleMinChange(e.target.value)}
            placeholder="e.g., 10L, 1Cr"
            className="form-input"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="max-budget" className="text-xs text-muted-foreground">Max Budget</Label>
          <Input
            id="max-budget"
            type="text"
            value={maxInput}
            onChange={(e) => handleMaxChange(e.target.value)}
            placeholder="e.g., 50L, 2Cr"
            className="form-input"
          />
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Range: {displayPrice(value[0])} - {displayPrice(value[1])}
      </div>
    </div>
  );
};
