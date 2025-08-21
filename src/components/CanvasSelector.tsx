// src/components/CanvasSelector.tsx

import { useCanvasStore } from '../stores/canvasStore';
import { useEffect } from 'react';
import { useSubgraphCanvasList } from '../hooks/useSubgraphCanvasList';
import type { CanvasInfo } from '../hooks/useSubgraphCanvasList';

// Helper function to format long addresses for a cleaner UI
const shortenAddress = (address: string) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

export function CanvasSelector() {
  const { canvases, isLoading } = useSubgraphCanvasList();
  
  const { 
    setCanvasAddresses, 
    canvasContractAddress, 
    setCanvasDimensions 
  } = useCanvasStore();

  // This effect automatically selects the newest canvas on first load
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
  }, [canvases, canvasContractAddress, setCanvasAddresses, setCanvasDimensions]);
  
  const handleSelectCanvas = (canvas: CanvasInfo) => {
    if (canvas.canvasContract === canvasContractAddress) return;

    setCanvasAddresses({
      canvas: canvas.canvasContract,
      nft: canvas.nftContract,
      marketplace: canvas.marketplaceContract,
    });
    setCanvasDimensions(canvas.width, canvas.height);
  }

  // Loading and Empty states
  if (isLoading) {
    return <div className="p-4 text-center bg-white border rounded-lg shadow-sm">Searching for canvases...</div>;
  }

  if (canvases.length === 0) {
    return (
      <div className="p-4 text-center bg-white border rounded-lg shadow-sm">
        <p className="font-semibold">No Canvases Found</p>
        <p className="text-sm mt-1 text-gray-500">Be the first to create one!</p>
      </div>
    );
  }

  // --- THIS IS THE UPDATED UI ---
  return (
    <div className="p-4 space-y-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">Available Canvases</h3>
      
      {/* A single, scrollable column for the detailed cards */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {canvases.map(canvas => {
          const isSelected = canvas.canvasContract === canvasContractAddress;

          return (
            <div
              key={canvas.canvasContract}
              onClick={() => handleSelectCanvas(canvas)}
              className={`
                p-4 border rounded-lg cursor-pointer transition-all duration-150 flex flex-col
                ${isSelected 
                  ? 'bg-blue-50 border-blue-500 shadow-md' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }
              `}
            >
              {/* --- Section 1: Main Info --- */}
              <div className="mb-3">
                <p className="font-bold text-gray-800 text-lg">
                  {canvas.width}x{canvas.height} Canvas
                </p>
                <p className="text-xs text-gray-500">
                  Creator: <span className="font-mono">{shortenAddress(canvas.creator)}</span>
                </p>
              </div>

              {/* --- Section 2: Details with Addresses and Price --- */}
              <div className="mt-auto pt-3 border-t border-gray-200 space-y-1.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mint Price:</span>
                  <span className="font-semibold text-gray-800 bg-gray-200 px-2 py-0.5 rounded">{canvas.mintPrice} ETH</span>
                </div>
                <div className="flex justify-between items-center font-mono text-xs" title={canvas.nftContract}>
                  <span className="text-gray-600">NFT Contract:</span>
                  <span className="text-blue-600">{shortenAddress(canvas.nftContract)}</span>
                </div>
                <div className="flex justify-between items-center font-mono text-xs" title={canvas.marketplaceContract}>
                  <span className="text-gray-600">Marketplace:</span>
                  <span className="text-green-600">{shortenAddress(canvas.marketplaceContract)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}