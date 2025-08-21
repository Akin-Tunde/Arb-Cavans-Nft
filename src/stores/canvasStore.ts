// src/stores/canvasStore.ts
import { create } from 'zustand'
import type { PixelData } from '../config'

interface CanvasState {
  // The addresses for the currently viewed canvas ecosystem
  canvasContractAddress: `0x${string}` | undefined;
  nftContractAddress: `0x${string}` | undefined;
  marketplaceContractAddress: `0x${string}` | undefined;

  // The on-chain data
  pixels: Map<string, PixelData>;
  mintPrice: bigint;
  canvasWidth: number;
  canvasHeight: number;

  // Actions to update the store
  setCanvasAddresses: (addresses: {
    canvas: `0x${string}`;
    nft: `0x${string}`;
    marketplace: `0x${string}`;
  }) => void;
  setPixels: (pixels: Map<string, PixelData>) => void;
  updatePixel: (x: number, y: number, data: PixelData) => void;
  setMintPrice: (price: bigint) => void;
  setCanvasDimensions: (width: number, height: number) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  // --- STATE ---
  canvasContractAddress: undefined,
  nftContractAddress: undefined,
  marketplaceContractAddress: undefined,
  pixels: new Map(),
  mintPrice: 0n,
  canvasWidth: 32, // Default width
  canvasHeight: 32, // Default height

  // --- ACTIONS ---
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

  setCanvasDimensions: (width, height) => set({ 
    canvasWidth: width, 
    canvasHeight: height 
  }),
}))