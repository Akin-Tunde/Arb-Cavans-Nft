// src/hooks/useCanvasEvents.ts
import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { factoryContract } from '../config';
import type { AbiEvent, Log, DecodeEventLogReturnType } from 'viem';

// ... (CanvasInfo interface remains the same) ...
export interface CanvasInfo {
  creator: `0x${string}`;
  canvasContract: `0x${string}`;
  nftContract: `0x${string}`;
  marketplaceContract: `0x${string}`;
  width: number;
  height: number;
}

type CanvasCreatedLog = Log & DecodeEventLogReturnType<typeof factoryContract.abi, 'CanvasCreated'>;

// Define a constant for our batch size, respecting the RPC limit
const LOG_FETCH_BLOCK_RANGE = 499n; // Using BigInt for block numbers

export function useCanvasEvents() {
  const [canvases, setCanvases] = useState<CanvasInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!publicClient) return;

    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const canvasCreatedEvent = factoryContract.abi.find(
          (item) => item.type === 'event' && item.name === 'CanvasCreated'
        ) as AbiEvent | undefined;

        if (!canvasCreatedEvent) throw new Error("CanvasCreated event ABI not found");

        const latestBlock = await publicClient.getBlockNumber();
        const allLogs: CanvasCreatedLog[] = [];

        // Loop forwards in batches of LOG_FETCH_BLOCK_RANGE
        for (let fromBlock = 0n; fromBlock <= latestBlock; fromBlock += LOG_FETCH_BLOCK_RANGE) {
          const toBlock = fromBlock + LOG_FETCH_BLOCK_RANGE;
          
          const logs = await publicClient.getLogs({
            address: factoryContract.address,
            event: canvasCreatedEvent,
            fromBlock,
            toBlock: toBlock > latestBlock ? latestBlock : toBlock,
          });
          allLogs.push(...(logs as CanvasCreatedLog[]));
        }

        const canvasMap = new Map<`0x${string}`, CanvasInfo>();
        allLogs.forEach(log => {
          const { args } = log; 
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
  }, [publicClient]);

  return { canvases, isLoading };
}