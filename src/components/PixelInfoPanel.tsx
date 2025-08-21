// src/components/PixelInfoPanel.tsx

import { useState, useEffect } from 'react';
import { useUiStore } from '../stores/uiStore';
import { marketplaceContractConfig, pixelNftContract, farcasterCanvasContract, COLOR_PALETTE } from '../config';
import { useCanvasStore } from '../stores/canvasStore';
import { formatEther, parseEther, BaseError } from 'viem';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { ColorPalette } from './ColorPalette';
import { ListModal } from './ListModal';
import toast from 'react-hot-toast';

interface PixelInfoPanelProps {
  refetchData: () => void;
}

export function PixelInfoPanel({ refetchData }: PixelInfoPanelProps){
  const selectedPixel = useUiStore((state) => state.selectedPixel);
  
  const { pixels, mintPrice, canvasContractAddress, nftContractAddress, marketplaceContractAddress, canvasWidth } = useCanvasStore();
  const { address: userAddress, isConnected } = useAccount();
  
  const [selectedColor, setSelectedColor] = useState(1);
  const [isListModalOpen, setListModalOpen] = useState(false);
  const [listingPrice, setListingPrice] = useState('');

  // --- THIS IS THE CORRECTED HOOK USAGE ---
  // The useWriteContract hook itself does not take onSuccess or onError.
  // We will handle these states in the useEffect below.
  const { data: hash, error, isPending, writeContract, reset: resetWriteContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const tokenId = selectedPixel ? (BigInt(selectedPixel.y) * BigInt(canvasWidth) + BigInt(selectedPixel.x)) : 0n;

  const { data: listingData } = useReadContract({
    ...marketplaceContractConfig,
    address: marketplaceContractAddress,
    functionName: 'listings',
    args: [tokenId],
    query: { enabled: !!selectedPixel && !!marketplaceContractAddress },
  });

  const listing = listingData as { seller: `0x${string}`, price: bigint } | undefined;
  const isForSale = listing && listing.price > 0n;

  useEffect(() => {
    setSelectedColor(1);
  }, [selectedPixel]);

  // --- Handlers remain the same ---

  const handleMint = () => {
    if (!canvasContractAddress || !selectedPixel) return;
    toast.loading('Sending transaction...', { id: 'tx_toast' });
    writeContract({ ...farcasterCanvasContract, address: canvasContractAddress, functionName: 'mintPixel', args: [selectedPixel.x, selectedPixel.y, selectedColor], value: mintPrice });
  };

  const handleChangeColor = () => {
    if (!nftContractAddress) return;
    toast.loading('Sending transaction...', { id: 'tx_toast' });
    writeContract({ ...pixelNftContract, address: nftContractAddress, functionName: 'changeColor', args: [tokenId, selectedColor] });
  };

  const handleBuy = () => {
    if (!marketplaceContractAddress || !listing?.price) return;
    toast.loading('Sending transaction...', { id: 'tx_toast' });
    writeContract({ ...marketplaceContractConfig, address: marketplaceContractAddress, functionName: 'buyPixel', args: [tokenId], value: listing.price });
  };

  const handleList = (price: string) => {
    if (!nftContractAddress || !marketplaceContractAddress) return;
    setListingPrice(price);
    setListModalOpen(false);
    toast.loading('1/2: Approving marketplace...', { id: 'tx_toast' });
    writeContract({ ...pixelNftContract, address: nftContractAddress, functionName: 'approve', args: [marketplaceContractAddress, tokenId] });
  };
  
  // (We can add handleCancelListing and handleUpdateListing back later if you like)

  // --- THIS IS THE CORRECTED EFFECT for Transaction State Handling ---
  useEffect(() => {
    if (isConfirming) {
      toast.loading('Waiting for confirmation...', { id: 'tx_toast', duration: Infinity });
    }

    if (isConfirmed) {
      if (listingPrice && marketplaceContractAddress) {
        toast.loading('2/2: Listing pixel...', { id: 'tx_toast' });
        writeContract({ ...marketplaceContractConfig, address: marketplaceContractAddress, functionName: 'listPixel', args: [tokenId, parseEther(listingPrice)] });
        setListingPrice('');
      } else {
        toast.success('Transaction Confirmed!', { id: 'tx_toast', duration: 2000 });
        setTimeout(() => refetchData(), 1500);
      }
      resetWriteContract();
    }

    // This is the correct place to handle the error state from the hook.
    if (error) {
      toast.error(error instanceof BaseError ? error.shortMessage : 'An error occurred.', { id: 'tx_toast', duration: 4000 });
      setListingPrice(''); // Reset listing flow on error
      resetWriteContract(); // Reset to clear the error state
    }
  }, [isConfirming, isConfirmed, error, resetWriteContract, listingPrice, marketplaceContractAddress, writeContract, tokenId, refetchData]);

  // --- The rest of the component's JSX remains the same ---
  
  if (!selectedPixel) {
    return (
      <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold">Select a Pixel</h3>
        <p className="mt-2 text-sm text-gray-500">Click on any pixel on the grid to interact.</p>
      </div>
    );
  }

  const { x, y } = selectedPixel;
  const pixelData = pixels.get(`${x},${y}`);
  const isOwner = isConnected && pixelData && pixelData.owner.toLowerCase() === userAddress?.toLowerCase();
  const isLoading = isPending || isConfirming;

  return (
    <>
      <ListModal 
        isOpen={isListModalOpen}
        onClose={() => setListModalOpen(false)}
        onList={handleList}
        isLoading={isLoading}
      />
      <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold">Pixel ({x}, {y})</h3>
        
        <div className="mt-4 space-y-3">
          {pixelData ? (
            // Pixel is Minted
            <>
              <p><strong>Status:</strong> <span className={`font-semibold ${isForSale ? 'text-yellow-600' : 'text-green-600'}`}>{isForSale ? "For Sale" : "Owned"}</span></p>
              <p><strong>Owner:</strong> <span className="font-mono text-sm break-all">{pixelData.owner}</span></p>
              
              {isOwner ? (
                // OWNER VIEW
                <div className="pt-4 space-y-3 border-t">
                  <ColorPalette selectedColor={selectedColor} onSelectColor={setSelectedColor} />
                  <button onClick={handleChangeColor} disabled={isLoading} className="w-full px-4 py-2 font-bold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:bg-gray-400">
                    {isLoading ? 'Confirming...' : 'Change Color'}
                  </button>
                  <button onClick={() => setListModalOpen(true)} disabled={isLoading} className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                    List for Sale
                  </button>
                </div>
              ) : isForSale ? (
                // BUYER VIEW
                <div className="pt-4 border-t">
                  <p><strong>Price:</strong> <span className="font-semibold">{formatEther(listing.price)} ETH</span></p>
                  <button onClick={handleBuy} disabled={!isConnected || isLoading} className="w-full px-4 py-2 mt-4 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                    {isLoading ? 'Confirming...' : `Buy Now`}
                  </button>
                </div>
              ) : (
                <p className="pt-4 mt-4 text-sm text-center text-gray-500 border-t">This pixel is owned and not currently for sale.</p>
              )}
            </>
          ) : (
            // Pixel is Unminted
            <>
              <p><strong>Status:</strong> <span className="font-semibold text-blue-600">Available</span></p>
              <ColorPalette selectedColor={selectedColor} onSelectColor={setSelectedColor} />
              <button onClick={handleMint} disabled={!isConnected || isLoading} className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
                {isLoading ? 'Confirming...' : `Mint for ${formatEther(mintPrice)} ETH`}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}