// src/components/CanvasGrid.tsx
import { COLOR_PALETTE, type PixelData } from '../config';
import { useUiStore } from '../stores/uiStore';

interface CanvasGridProps {
  width: number;
  height: number;
  pixels: Map<string, PixelData>;
}

export const CanvasGrid: React.FC<CanvasGridProps> = ({ width, height, pixels }) => {
  const selectPixel = useUiStore((state) => state.selectPixel);
  const selectedPixelCoords = useUiStore((state) => state.selectedPixel);

  const handlePixelClick = (index: number) => {
    const x = index % width;
    const y = Math.floor(index / width);
    selectPixel(x, y);
  };

  const getPixelColor = (index: number): string => {
    const x = index % width;
    const y = Math.floor(index / width);
    const key = `${x},${y}`;
    const pixelData = pixels.get(key);
    return pixelData ? COLOR_PALETTE[pixelData.colorIndex] : COLOR_PALETTE[0];
  };

  return (
    <div 
      className="grid border-2 border-gray-700" 
      style={{ 
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gridTemplateRows: `repeat(${height}, 1fr)` 
      }}
    >
      {Array.from({ length: width * height }).map((_, index) => {
        const x = index % width;
        const y = Math.floor(index / width);
        const isSelected = selectedPixelCoords?.x === x && selectedPixelCoords?.y === y;

        return (
          <div
            key={index}
            // --- THIS IS THE CORRECTED LINE ---
            // We removed the redundant `hover:outline` and `outline` classes
           className={`w-full h-full shadow-[inset_0_0_0_0.5px_rgba(224,224,224,1)]
            hover:outline-2 hover:outline-red-500 hover:z-10 cursor-pointer
            ${isSelected ? 'outline-2 outline-red-500 z-10' : ''}`}
            style={{ backgroundColor: getPixelColor(index) }}
            onClick={() => handlePixelClick(index)}
          />
        );
      })}
    </div>
  );
};