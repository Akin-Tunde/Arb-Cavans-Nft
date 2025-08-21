  // src/hooks/useLiveCanvasData.ts
    import { useEffect } from 'react';
    import { useCanvasStore } from '../stores/canvasStore';
    import { farcasterCanvasContract, pixelNftContract, type PixelData } from '../config';
    import { useReadContracts } from 'wagmi';

    const CANVAS_WIDTH = 32; // This should be dynamic based on the selected canvas
    const TOTAL_PIXELS = CANVAS_WIDTH * CANVAS_WIDTH;

    export function useLiveCanvasData() {
      const { 
        canvasContractAddress, 
        nftContractAddress,
        setPixels, 
        setMintPrice,
        pixels
      } = useCanvasStore();

      const pixelContractReads = Array.from({ length: TOTAL_PIXELS }).flatMap((_, i) => [
        { ...pixelNftContract, address: nftContractAddress, functionName: 'ownerOf', args: [i] },
        { ...pixelNftContract, address: nftContractAddress, functionName: 'pixelColors', args: [i] }
      ]);

      const { data, isSuccess, refetch } = useReadContracts({
        contracts: [
          { ...farcasterCanvasContract, address: canvasContractAddress, functionName: 'mintPrice' },
          ...pixelContractReads
        ],
        query: { enabled: !!canvasContractAddress && !!nftContractAddress },
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
                const x = i % CANVAS_WIDTH;
                const y = Math.floor(i / CANVAS_WIDTH);
                const key = `${x},${y}`;
                newPixels.set(key, {
                  owner: ownerResult.result as `0x${string}`,
                  colorIndex: Number(colorResult.result)
                });
            }
          }
          setPixels(newPixels);
        }
      }, [data, isSuccess, setPixels, setMintPrice]);

      return { pixels, refetchCanvasData: refetch };
    }