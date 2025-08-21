// src/components/PixelInfoPanel.tsx (Upgraded Version)
import { useState, useEffect } from 'react';
import { useUiStore } from '../stores/uiStore';
import { COLOR_PALETTE, marketplaceContractConfig, pixelNftContract } from '../config';
import { useCanvasStore } from '../stores/canvasStore';
import { formatEther, parseEther } from 'viem';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { farcasterCanvasContract } from '../config';
import { BaseError } from 'viem';
import { ColorPalette } from './ColorPalette'; // Import the new component

export function PixelInfoPanel() {
  // --- STATE AND STORES ---
  const selectedPixel = useUiStore((state) => state.selectedPixel);
  const { pixels, mintPrice, canvasContractAddress, nftContractAddress, marketplaceContractAddress, updatePixel } = useCanvasStore();
  const { address: userAddress, isConnected } = useAccount();
  const [selectedColor, setSelectedColor] = useState(1); // Default to black

  // --- WAGMI HOOKS ---
  const { data: hash, error, writeContract, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // --- DATA FETCHING for Secondary Market ---
  // Read the listing details for the selected pixel from the Marketplace contract
  const { data: listingData } = useReadContract({
    ...marketplaceContractConfig,
    address: marketplaceContractAddress,
    functionName: 'listings',
    args: [selectedPixel ? (BigInt(selectedPixel.y) * 32n + BigInt(selectedPixel.x)) : 0n], // Calculate tokenId
    query: { enabled: !!selectedPixel && !!marketplaceContractAddress },
  });

  const listing = listingData as { seller: `0x${string}`, price: bigint } | undefined;
  const isForSale = listing && listing.price > 0n;

  // --- UI LOGIC ---
  if (!selectedPixel) {
    return ( <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm"><h3 className="text-lg font-semibold">Select a Pixel</h3><p className="mt-2 text-sm text-gray-500">Click on any pixel to interact.</p></div> );
  }

  const { x, y } = selectedPixel;
  const tokenId = BigInt(y) * 32n + BigInt(x); // Calculate tokenId for transactions
  const pixelData = pixels.get(`${x},${y}`);
  const isOwner = isConnected && pixelData && pixelData.owner.toLowerCase() === userAddress?.toLowerCase();

  // --- TRANSACTION HANDLERS ---
  const handleMint = () => writeContract({ ...farcasterCanvasContract, address: canvasContractAddress, functionName: 'mintPixel', args: [x, y, selectedColor], value: mintPrice });
  const handleChangeColor = () => writeContract({ ...pixelNftContract, address: nftContractAddress, functionName: 'changeColor', args: [tokenId, selectedColor] });
  const handleBuy = () => writeContract({ ...marketplaceContractConfig, address: marketplaceContractAddress, functionName: 'buyPixel', args: [tokenId], value: listing?.price });

  // --- UI UPDATE ON SUCCESS ---
  useEffect(() => {
    if (isConfirmed) {
      // This is a simplified refetch. A more robust solution would refetch specific data.
      window.location.reload(); 
      reset(); // Reset the transaction state
    }
  }, [isConfirmed, reset]);

  const isLoading = isPending || isConfirming;

  // --- RENDER LOGIC ---
  return (
    <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold">Pixel ({x}, {y})</h3>
      
      <div className="mt-4 space-y-3">
        {/* Case 1: Pixel is Minted */}
        {pixelData ? (
          <>
            <p><strong>Status:</strong> <span className={`font-semibold ${isForSale ? 'text-yellow-600' : 'text-green-600'}`}>{isForSale ? "For Sale" : "Minted"}</span></p>
            <p><strong>Owner:</strong> <span className="font-mono text-sm break-all">{pixelData.owner}</span></p>
            
            {isOwner ? (
              // --- OWNER VIEW ---
              <div className="pt-4 border-t">
                <ColorPalette selectedColor={selectedColor} onSelectColor={setSelectedColor} />
                <button onClick={handleChangeColor} disabled={isLoading} className="w-full px-4 py-2 mt-4 font-bold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:bg-gray-400">
                  {isLoading ? 'Confirming...' : 'Change Color'}
                </button>
                {/* Listing functionality would be added here */}
              </div>
            ) : isForSale ? (
              // --- BUYER VIEW ---
              <div className="pt-4 border-t">
                <p><strong>Price:</strong> <span className="font-semibold">{formatEther(listing.price)} ETH</span></p>
                <button onClick={handleBuy} disabled={!isConnected || isLoading} className="w-full px-4 py-2 mt-4 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                  {isLoading ? 'Confirming...' : `Buy Now`}
                </button>
              </div>
            ) : (
               // --- VISITOR VIEW (Not for sale) ---
              <p className="text-sm text-gray-500">This pixel is owned and not currently for sale.</p>
            )}
          </>
        ) : (
          // --- Case 2: Pixel is Unminted ---
          <>
            <p><strong>Status:</strong> <span className="font-semibold text-blue-600">Available</span></p>
            <ColorPalette selectedColor={selectedColor} onSelectColor={setSelectedColor} />
            <button onClick={handleMint} disabled={!isConnected || isLoading} className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
              {isLoading ? 'Confirming...' : `Mint for ${formatEther(mintPrice)} ETH`}
            </button>
          </>
        )}
      </div>

      {/* Transaction Status Display */}
      <div className="mt-4 text-xs font-mono">
        {hash && <div>Hash: {hash.substring(0,10)}...</div>}
        {isConfirming && <div className="text-blue-600">Waiting for confirmation...</div>}
        {isConfirmed && <div className="text-green-600">Transaction confirmed! UI refreshing...</div>}
        {error && ( <div className="text-red-600 break-words">Error: {error instanceof BaseError ? error.shortMessage : error.message}</div> )}
      </div>
    </div>
  );
}