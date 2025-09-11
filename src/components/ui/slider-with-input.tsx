import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SliderWithInputProps {
  value: [number, number]
  onValueChange: (value: [number, number]) => void
  min?: number
  max?: number
  step?: number
  label?: string
  formatValue?: (value: number) => string
  className?: string
}

const SliderWithInput = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderWithInputProps
>(({ 
  value, 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  label,
  formatValue = (val) => val.toString(),
  className,
  ...props 
}, ref) => {
  const [minInput, setMinInput] = React.useState(value[0].toString());
  const [maxInput, setMaxInput] = React.useState(value[1].toString());

  // Update inputs when slider value changes
  React.useEffect(() => {
    setMinInput(value[0].toString());
    setMaxInput(value[1].toString());
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    if (newValue.length === 2) {
      onValueChange([newValue[0], newValue[1]]);
    }
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setMinInput(inputValue);
    
    const numValue = parseInt(inputValue) || min;
    if (numValue >= min && numValue <= value[1]) {
      onValueChange([numValue, value[1]]);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setMaxInput(inputValue);
    
    const numValue = parseInt(inputValue) || max;
    if (numValue <= max && numValue >= value[0]) {
      onValueChange([value[0], numValue]);
    }
  };

  const handleMinInputBlur = () => {
    const numValue = parseInt(minInput) || min;
    const clampedValue = Math.max(min, Math.min(numValue, value[1]));
    setMinInput(clampedValue.toString());
    onValueChange([clampedValue, value[1]]);
  };

  const handleMaxInputBlur = () => {
    const numValue = parseInt(maxInput) || max;
    const clampedValue = Math.min(max, Math.max(numValue, value[0]));
    setMaxInput(clampedValue.toString());
    onValueChange([value[0], clampedValue]);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label className="text-sm font-medium text-foreground">
          {label}: {formatValue(value[0])} - {formatValue(value[1])}
        </Label>
      )}
      
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center hover-glow transition-all duration-300",
        )}
        value={value}
        onValueChange={handleSliderChange}
        max={max}
        min={min}
        step={step}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary transition-colors hover:bg-secondary/80">
          <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-300" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 hover:shadow-lg hover:shadow-primary/30" />
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 hover:shadow-lg hover:shadow-primary/30" />
      </SliderPrimitive.Root>

      <div className="flex gap-4 stagger-children">
        <div className="flex-1 space-y-1">
          <Label htmlFor="min-input" className="text-xs text-muted-foreground">Min</Label>
          <Input
            id="min-input"
            type="number"
            value={minInput}
            onChange={handleMinInputChange}
            onBlur={handleMinInputBlur}
            min={min}
            max={value[1]}
            step={step}
            className="h-9 form-input"
          />
        </div>
        <div className="flex-1 space-y-1">
          <Label htmlFor="max-input" className="text-xs text-muted-foreground">Max</Label>
          <Input
            id="max-input"
            type="number"
            value={maxInput}
            onChange={handleMaxInputChange}
            onBlur={handleMaxInputBlur}
            min={value[0]}
            max={max}
            step={step}
            className="h-9 form-input"
          />
        </div>
      </div>
    </div>
  )
});

SliderWithInput.displayName = "SliderWithInput"

export { SliderWithInput }