// src/hooks/useCanvasEvents.ts
import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { factoryContract } from '../config';
import { decodeEventLog } from 'viem';

// Define the structure of the canvas info we want to store
export interface CanvasInfo {
  creator: `0x${string}`;
  canvasContract: `0x${string}`;
  nftContract: `0x${string}`;
  marketplaceContract: `0x${string}`;
}

export function useCanvasEvents() {
  const [canvases, setCanvases] = useState<CanvasInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the public client (our connection to the blockchain) from Wagmi
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!publicClient) return;

    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Use the public client directly to get the logs
        const logs = await publicClient.getLogs({
          address: factoryContract.address,
          event: factoryContract.abi.find((e) => e.name === 'CanvasCreated') as any,
          fromBlock: 0n, // Search from the beginning of the chain
          toBlock: 'latest',
        });

        // Decode the logs just like before
        const canvasMap = new Map<`0x${string}`, CanvasInfo>();
        logs.forEach(log => {
          try {
            const decodedLog = decodeEventLog({
              abi: factoryContract.abi,
              data: log.data,
              topics: log.topics,
            });
            if (decodedLog.eventName === 'CanvasCreated') {
              const newCanvas: CanvasInfo = {
                creator: decodedLog.args.creator as `0x${string}`,
                canvasContract: decodedLog.args.canvasContract as `0x${string}`,
                nftContract: decodedLog.args.nftContract as `0x${string}`,
                marketplaceContract: decodedLog.args.marketplaceContract as `0x${string}`,
              };
              canvasMap.set(newCanvas.canvasContract, newCanvas);
            }
          } catch (error) {
            console.error("Failed to decode a log entry:", error);
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
  }, [publicClient]); // Re-run if the public client changes

  return { canvases, isLoading };
}