// src/hooks/useCanvasEvents.ts
import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { factoryContract } from '../config';
import type { AbiEvent } from 'viem';

// Define the structure of the canvas info we want to store
export interface CanvasInfo {
  creator: `0x${string}`;
  canvasContract: `0x${string}`;
  nftContract: `0x${string}`;
  marketplaceContract: `0x${string}`;
  width: number;
  height: number;
}

// Define the specific type for our event's arguments, matching the contract
type CanvasCreatedEventArgs = {
    creator?: `0x${string}`;
    canvasContract?: `0x${string}`;
    nftContract?: `0x${string}`;
    marketplaceContract?: `0x${string}`;
    width?: bigint;
    height?: bigint;
}

export function useCanvasEvents() {
  const [canvases, setCanvases] = useState<CanvasInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    // Don't run the effect if the client isn't ready
    if (!publicClient) return;

    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // 1. Find the event ABI in a type-safe way
        const canvasCreatedEvent = factoryContract.abi.find(
          (item) => item.type === 'event' && item.name === 'CanvasCreated'
        ) as AbiEvent | undefined;

        // If the ABI is somehow malformed, we can't proceed.
        if (!canvasCreatedEvent) {
          throw new Error("CanvasCreated event not found in ABI");
        }

        // 2. Fetch the logs using the specific event ABI
        const logs = await publicClient.getLogs({
          address: factoryContract.address,
          event: canvasCreatedEvent, // Use the found event ABI
          fromBlock: 0n,
          toBlock: 'latest',
        });

        // 3. Process the logs. `log.args` will now be correctly typed.
        const canvasMap = new Map<`0x${string}`, CanvasInfo>();
        logs.forEach(log => {
          const args = log.args as CanvasCreatedEventArgs;
          // Ensure all required args are present
          if (args.creator && args.canvasContract && args.nftContract && args.marketplaceContract && args.width !== undefined && args.height !== undefined) {
            const newCanvas: CanvasInfo = {
              creator: args.creator,
              canvasContract: args.canvasContract,
              nftContract: args.nftContract,
              marketplaceContract: args.marketplaceContract,
              width: Number(args.width),
              height: Number(args.height),
            };
            canvasMap.set(newCanvas.canvasContract, newCanvas);
          }
        });
        
        setCanvases(Array.from(canvasMap.values()));
      } catch (error) {
        console.error("Failed to fetch canvas events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [publicClient]); // Re-run this effect if the public client ever changes

  return { canvases, isLoading };
}