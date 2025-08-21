// src/hooks/useLiveCanvasData.ts
import { useEffect } from 'react';
import { useCanvasStore } from '../stores/canvasStore';
import { farcasterCanvasContract, pixelNftContract, type PixelData } from '../config';
import { useReadContracts } from 'wagmi';

export function useLiveCanvasData() {
  const { 
    canvasContractAddress, 
    nftContractAddress,
    setPixels, 
    setMintPrice,
    pixels,
    canvasWidth, // Get dimensions from store
    canvasHeight,
  } = useCanvasStore();

  const TOTAL_PIXELS = canvasWidth * canvasHeight;

  // This check prevents the hook from running with an invalid number of pixels
  const isEnabled = !!canvasContractAddress && !!nftContractAddress && TOTAL_PIXELS > 0;

  const pixelContractReads = Array.from({ length: TOTAL_PIXELS }).flatMap((_, i) => [
    { ...pixelNftContract, address: nftContractAddress, functionName: 'ownerOf', args: [BigInt(i)] },
    { ...pixelNftContract, address: nftContractAddress, functionName: 'pixelColors', args: [BigInt(i)] }
  ]);

  const { data, isSuccess, refetch } = useReadContracts({
    contracts: [
      { ...farcasterCanvasContract, address: canvasContractAddress, functionName: 'mintPrice' },
      ...pixelContractReads
    ],
    query: { enabled: isEnabled },
  });

  useEffect(() => {
    if (isSuccess && data) {
      const priceResult = data[0];
      if (priceResult.status === 'success') setMintPrice(priceResult.result as bigint);

      const newPixels = new Map<string, PixelData>();
      for (let i = 0; i < TOTAL_PIXELS; i++) {
        const ownerResult = data[2 * i + 1];
        const colorResult = data[2 * i + 2];
        if (ownerResult.status === 'success' && colorResult.status === 'success') {
            const x = i % canvasWidth;
            const y = Math.floor(i / canvasWidth);
            const key = `${x},${y}`;
            newPixels.set(key, {
              owner: ownerResult.result as `0x${string}`,
              colorIndex: Number(colorResult.result)
            });
        }
      }
      setPixels(newPixels);
    }
  }, [data, isSuccess, setPixels, setMintPrice, TOTAL_PIXELS, canvasWidth]);

  return { pixels, refetchCanvasData: refetch };
}