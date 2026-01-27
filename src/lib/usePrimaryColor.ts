import { useEffect, useState } from 'react';

const PRIMARY_COLOR_KEY = 'primary-color';

export const COLOR_PALETTE = [
  { name: 'default', label: 'Default', value: null },
  { name: 'red', label: 'Red', value: '#ef4444' },
  { name: 'orange', label: 'Orange', value: '#f97316' },
  { name: 'amber', label: 'Amber', value: '#f59e0b' },
  { name: 'yellow', label: 'Yellow', value: '#eab308' },
  { name: 'lime', label: 'Lime', value: '#84cc16' },
  { name: 'green', label: 'Green', value: '#22c55e' },
  { name: 'emerald', label: 'Emerald', value: '#10b981' },
  { name: 'teal', label: 'Teal', value: '#14b8a6' },
  { name: 'cyan', label: 'Cyan', value: '#06b6d4' },
  { name: 'sky', label: 'Sky', value: '#0ea5e9' },
  { name: 'blue', label: 'Blue', value: '#3b82f6' },
  { name: 'indigo', label: 'Indigo', value: '#6366f1' },
  { name: 'violet', label: 'Violet', value: '#8b5cf6' },
  { name: 'purple', label: 'Purple', value: '#a855f7' },
  { name: 'fuchsia', label: 'Fuchsia', value: '#d946ef' },
  { name: 'pink', label: 'Pink', value: '#ec4899' },
  { name: 'rose', label: 'Rose', value: '#f43f5e' },
] as const;

export type PrimaryColorName = (typeof COLOR_PALETTE)[number]['name'];

export function usePrimaryColor() {
  const [colorName, setColorName] = useState<PrimaryColorName>(() => {
    const stored = localStorage.getItem(PRIMARY_COLOR_KEY);
    const found = COLOR_PALETTE.find(c => c.name === stored);
    return found ? found.name : 'default';
  });

  useEffect(() => {
    localStorage.setItem(PRIMARY_COLOR_KEY, colorName);
    const color = COLOR_PALETTE.find(c => c.name === colorName);

    if (color?.value) {
      document.documentElement.style.setProperty('--primary', color.value);
      document.documentElement.style.setProperty('--primary-foreground', '#ffffff');
      document.documentElement.style.setProperty('--ring', color.value);
    } else {
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-foreground');
      document.documentElement.style.removeProperty('--ring');
    }
  }, [colorName]);

  return { colorName, setColorName };
}
