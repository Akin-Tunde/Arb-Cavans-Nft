// src/components/ColorPalette.tsx
import { COLOR_PALETTE } from '../config';

interface ColorPaletteProps {
  selectedColor: number;
  onSelectColor: (colorIndex: number) => void;
}

export function ColorPalette({ selectedColor, onSelectColor }: ColorPaletteProps) {
  // We don't show the first color (white for unminted)
  const availableColors = COLOR_PALETTE.slice(1);

  return (
    <div className="pt-4 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-600">Select a Color</h4>
      <div className="flex flex-wrap gap-3 mt-3">
        {availableColors.map((color, index) => {
          const colorIndex = index + 1; // Adjust index because we sliced the array
          return (
            <div
              key={color}
              onClick={() => onSelectColor(colorIndex)}
              className={`w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110
                          ${selectedColor === colorIndex ? 'outline outline-2 outline-offset-2 outline-blue-500' : 'outline outline-1 outline-gray-300'}`}
              style={{ backgroundColor: color }}
            />
          )
        })}
      </div>
    </div>
  );
}