// src/config.ts
import type { Abi } from 'viem';

// Import all your ABI JSON files
import canvasFactoryAbi from './abis/canvasFactory.json';
import farcasterCanvasAbi from './abis/farcasterCanvas.json';
import pixelNftAbi from './abis/pixelNft.json';
import marketplaceAbi from './abis/marketplace.json';

// --- CONTRACT CONFIGURATIONS ---

// Get the factory address from our environment variables
export const FACTORY_CONTRACT_ADDRESS = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS as `0x${string}`;

// Create the contract configurations for Wagmi, with proper ABI casting.
export const factoryContract = {
  address: FACTORY_CONTRACT_ADDRESS,
  abi: canvasFactoryAbi as Abi,
};

export const farcasterCanvasContract = {
  abi: farcasterCanvasAbi as Abi,
};

export const pixelNftContract = {
  abi: pixelNftAbi as Abi,
};

export const marketplaceContractConfig = {
  abi: marketplaceAbi as Abi,
};


// --- APPLICATION CONFIGURATIONS ---

export const COLOR_PALETTE = [
  '#FFFFFF', // 0: Unminted (White)
  '#000000', // 1: Black
  '#FF4500', // 2: OrangeRed
  '#FFD700', // 3: Gold
  '#4682B4', // 4: SteelBlue
  '#32CD32', // 5: LimeGreen
  '#8A2BE2', // 6: BlueViolet
  '#FF69B4', // 7: HotPink
];


// --- TYPE DEFINITIONS ---

/**
 * Represents the on-chain data for a single pixel.
 */
export interface PixelData {
  owner: `0x${string}`;
  colorIndex: number;
}