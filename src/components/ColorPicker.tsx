import { Palette } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { COLOR_PALETTE, type PrimaryColorName } from '@/lib/usePrimaryColor';

interface ColorPickerProps {
  colorName: PrimaryColorName;
  onColorChange: (name: PrimaryColorName) => void;
}

export function ColorPicker({ colorName, onColorChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" title="Change primary color">
          <Palette size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-2">
        <div className="grid grid-cols-6 gap-1.5">
          {COLOR_PALETTE.map(color => (
            <button
              key={color.name}
              type="button"
              onClick={() => {
                onColorChange(color.name);
                setIsOpen(false);
              }}
              className={`h-6 w-6 rounded-sm border transition-transform hover:scale-110 ${
                colorName === color.name ? 'ring-2 ring-foreground ring-offset-1' : ''
              }`}
              style={{
                background: color.value ?? 'linear-gradient(135deg, #fff 45%, #000 55%)',
              }}
              title={color.label}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
