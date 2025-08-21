// src/stores/canvasStore.ts
import { create } from 'zustand'
import type { PixelData } from '../config'

interface CanvasState {
  // The addresses for the currently viewed canvas ecosystem
  canvasContractAddress: `0x${string}` | null;
  nftContractAddress: `0x${string}` | null;
  marketplaceContractAddress: `0x${string}` | null;

  // The on-chain data
  pixels: Map<string, PixelData>;
  mintPrice: bigint;

  // Actions to update the store
  setCanvasAddresses: (addresses: {
    canvas: `0x${string}`;
    nft: `0x${string}`;
    marketplace: `0x${string}`;
  }) => void;

  setPixels: (pixels: Map<string, PixelData>) => void;
  updatePixel: (x: number, y: number, data: PixelData) => void;
  setMintPrice: (price: bigint) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  canvasContractAddress: null,
  nftContractAddress: null,
  marketplaceContractAddress: null,
  pixels: new Map(),
  mintPrice: 0n, // Use BigInt for ETH values

  setCanvasAddresses: (addresses) => set({ 
    canvasContractAddress: addresses.canvas,
    nftContractAddress: addresses.nft,
    marketplaceContractAddress: addresses.marketplace
  }),
  
  setPixels: (pixels) => set({ pixels }),

  updatePixel: (x, y, data) => set((state) => {
    const newPixels = new Map(state.pixels);
    const key = `${x},${y}`;
    newPixels.set(key, data);
    return { pixels: newPixels };
  }),

  setMintPrice: (price) => set({ mintPrice: price }),
}))