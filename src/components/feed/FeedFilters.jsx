import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { cn } from '@/lib/utils';

const PRICE_RANGES = [
  { label: 'Any', min: 0, max: Infinity },
  { label: 'Under $30', min: 0, max: 30 },
  { label: '$30–$80', min: 30, max: 80 },
  { label: '$80–$200', min: 80, max: 200 },
  { label: '$200+', min: 200, max: Infinity },
];

const COLORS = [
  { label: 'Black', value: 'black', hex: '#1a1a1a' },
  { label: 'White', value: 'white', hex: '#f5f5f5' },
  { label: 'Beige', value: 'beige', hex: '#d4c5a9' },
  { label: 'Brown', value: 'brown', hex: '#8B6343' },
  { label: 'Grey', value: 'grey', hex: '#9E9E9E' },
  { label: 'Blue', value: 'blue', hex: '#4A90D9' },
  { label: 'Green', value: 'green', hex: '#5A9E6F' },
  { label: 'Pink', value: 'pink', hex: '#E8A0B4' },
  { label: 'Red', value: 'red', hex: '#C0392B' },
  { label: 'Yellow', value: 'yellow', hex: '#F1C40F' },
];

export default function FeedFilters({ filters, onChange }) {
  const [open, setOpen] = useState(false);

  const activeCount = (filters.priceRange.label !== 'Any' ? 1 : 0) + (filters.color ? 1 : 0);

  const handlePriceSelect = (range) => onChange({ ...filters, priceRange: range });
  const handleColorSelect = (color) => onChange({ ...filters, color: filters.color === color.value ? null : color.value });
  const handleClear = () => onChange({ priceRange: PRICE_RANGES[0], color: null });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-1.5 px-3 h-8 rounded-full border text-xs font-medium transition-all shrink-0",
          activeCount > 0
            ? "bg-primary text-primary-foreground border-primary"
            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
        )}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Filters
        {activeCount > 0 && (
          <span className="bg-primary-foreground text-primary rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
            {activeCount}
          </span>
        )}
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Filter">
        <div className="px-5 py-4 space-y-6">
          {/* Price */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">Price</p>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.label}
                  onClick={() => handlePriceSelect(range)}
                  className={cn(
                    "px-3 py-1.5 rounded-full border text-sm font-medium transition-all",
                    filters.priceRange.label === range.label
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-foreground hover:border-foreground/30"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">Color</p>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color)}
                  aria-label={color.label}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    filters.color === color.value ? "border-primary scale-110 shadow-md" : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
            {filters.color && (
              <p className="text-xs text-muted-foreground mt-2 capitalize">
                Selected: {filters.color}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            {activeCount > 0 && (
              <Button variant="outline" className="flex-1" onClick={() => { handleClear(); setOpen(false); }}>
                <X className="w-3.5 h-3.5 mr-1.5" /> Clear
              </Button>
            )}
            <Button className="flex-1" onClick={() => setOpen(false)}>
              Apply
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

export { PRICE_RANGES };