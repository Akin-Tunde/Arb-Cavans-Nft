// src/components/CanvasSelector.tsx (Final, Cleaned Version)
import { useCanvasStore } from '../stores/canvasStore';
import { useEffect } from 'react';
// 1. Import our new custom hook
import { useCanvasEvents } from '../hooks/useCanvasEvents';

export function CanvasSelector() {
  // 2. Use the hook to get the list of canvases and loading state
  const { canvases, isLoading } = useCanvasEvents();
  
  // 3. Get what we need from our Zustand store
  const { setCanvasAddresses, canvasContractAddress, setCanvasDimensions } = useCanvasStore();


  // This effect automatically selects the first canvas when the list loads
  useEffect(() => {
    if (!canvasContractAddress && canvases.length > 0) {
      const firstCanvas = canvases[0];
      setCanvasAddresses({
        canvas: firstCanvas.canvasContract,
        nft: firstCanvas.nftContract,
        marketplace: firstCanvas.marketplaceContract,
      });
      setCanvasDimensions(firstCanvas.width, firstCanvas.height);
    }
  }, [canvases, canvasContractAddress, setCanvasAddresses]);
  
  // This function handles the dropdown change event
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAddress = e.target.value as `0x${string}`;
    const selectedCanvas = canvases.find(c => c.canvasContract === selectedAddress);
    if (selectedCanvas) {
      setCanvasAddresses({
        canvas: selectedCanvas.canvasContract,
        nft: selectedCanvas.nftContract,
        marketplace: selectedCanvas.marketplaceContract,
      });
      // When the user selects a new canvas, update its dimensions in the global store.
      setCanvasDimensions(selectedCanvas.width, selectedCanvas.height);
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center bg-gray-100 rounded-lg shadow-sm">Searching for canvases...</div>;
  }

  if (canvases.length === 0) {
    return (
      <div className="p-4 text-center bg-yellow-100 text-yellow-800 rounded-lg shadow-sm">
        <p>No canvases found.</p>
        <p className="text-xs mt-1">Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2 bg-gray-100 rounded-lg shadow-sm">
      <label htmlFor="canvas-select" className="block text-sm font-medium text-gray-700">Select a Canvas</label>
      <select 
        id="canvas-select"
        value={canvasContractAddress || ''}
        onChange={handleSelectionChange}
        className="block w-full p-2 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >
        {canvases.map(canvas => (
          <option key={canvas.canvasContract} value={canvas.canvasContract}>
            Canvas by {canvas.creator.substring(0, 6)}...
          </option>
        ))}
      </select>
    </div>
  );
}