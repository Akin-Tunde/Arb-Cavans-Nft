// src/components/PixelInfoPanel.tsx
import { useState, useEffect } from 'react';
import { useUiStore } from '../stores/uiStore';
import { marketplaceContractConfig, pixelNftContract, farcasterCanvasContract } from '../config';
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
  // --- STATE AND STORES ---
  const selectedPixel = useUiStore((state) => state.selectedPixel);
  const { pixels, mintPrice, canvasContractAddress, nftContractAddress, marketplaceContractAddress, canvasWidth } = useCanvasStore();
  const { address: userAddress, isConnected } = useAccount();
  
  const [selectedColor, setSelectedColor] = useState(1); // Default to black (index 1)
  const [isListModalOpen, setListModalOpen] = useState(false);
  const [listingPrice, setListingPrice] = useState(''); // Used to sequence the approve/list flow

  // --- WAGMI HOOKS ---
  const { data: hash, error, writeContract, isPending, reset: resetWriteContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // --- DATA FETCHING (Secondary Market) ---
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

  // --- UI LOGIC ---
  if (!selectedPixel) {
    return (
      <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold">Select a Pixel</h3>
        <p className="mt-2 text-sm text-gray-500">Click on any pixel to interact.</p>
      </div>
    );
  }

  const { x, y } = selectedPixel;
  const pixelData = pixels.get(`${x},${y}`);
  const isOwner = isConnected && pixelData && pixelData.owner.toLowerCase() === userAddress?.toLowerCase();

  // --- TRANSACTION HANDLERS ---
  const handleMint = () => {
    if (!canvasContractAddress) return;
    toast.loading('Sending transaction...', { id: 'tx_toast' });
    writeContract({ ...farcasterCanvasContract, address: canvasContractAddress, functionName: 'mintPixel', args: [x, y, selectedColor], value: mintPrice });
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
    toast.loading('1/2: Approving transaction...', { id: 'tx_toast' });
    writeContract({ ...pixelNftContract, address: nftContractAddress, functionName: 'approve', args: [marketplaceContractAddress, tokenId] });
  };

  // --- EFFECT for Transaction Sequencing and UI Updates ---
  useEffect(() => {
    if (isConfirming) {
      toast.loading('Waiting for confirmation...', { id: 'tx_toast', duration: Infinity });
    }
    if (isConfirmed) {
      if (listingPrice && marketplaceContractAddress) {
        toast.loading('2/2: Listing pixel...', { id: 'tx_toast' });
        writeContract({ ...marketplaceContractConfig, address: marketplaceContractAddress, functionName: 'listPixel', args: [tokenId, parseEther(listingPrice)] });
        setListingPrice(''); // Clear price to prevent re-triggering
      } else {
        toast.success('Transaction Confirmed!', { id: 'tx_toast', duration: 2000 });
        setTimeout(() => window.location.reload(), 1500);
      }
      resetWriteContract();
    }
    if (error) {
      toast.error(error instanceof BaseError ? error.shortMessage : 'An error occurred.', { id: 'tx_toast', duration: 4000 });
      setListingPrice('');
      resetWriteContract();
    }
  }, [isConfirming, isConfirmed, error, resetWriteContract, listingPrice, marketplaceContractAddress, writeContract, tokenId, refetchData]);

  const isLoading = isPending || isConfirming;

  // --- RENDER LOGIC ---
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
            // --- Case 1: Pixel is Minted ---
            <>
              <p><strong>Status:</strong> <span className={`font-semibold ${isForSale ? 'text-yellow-600' : 'text-green-600'}`}>{isForSale ? "For Sale" : "Minted"}</span></p>
              <p><strong>Owner:</strong> <span className="font-mono text-sm break-all">{pixelData.owner}</span></p>
              
              {isOwner ? (
                // --- OWNER VIEW ---
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
                // --- BUYER VIEW ---
                <div className="pt-4 border-t">
                  <p><strong>Price:</strong> <span className="font-semibold">{formatEther(listing.price)} ETH</span></p>
                  <button onClick={handleBuy} disabled={!isConnected || isLoading} className="w-full px-4 py-2 mt-4 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                    {isLoading ? 'Confirming...' : `Buy Now`}
                  </button>
                </div>
              ) : (
                 // --- VISITOR VIEW (Not for sale) ---
                <p className="pt-4 mt-4 text-sm text-center text-gray-500 border-t">This pixel is owned and not currently for sale.</p>
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
        <div className="mt-4 text-xs font-mono h-4">
          {hash && !isConfirmed && !error && <div>Hash: {hash.substring(0,10)}...</div>}
        </div>
      </div>
    </>
  );
}