// src/config.ts


// Import all your ABI JSON files
import { canvasFactoryAbi } from './abis/CanvasFactory';
import { farcasterCanvasAbi } from './abis/FarcasterCanvas';
import { pixelNftAbi } from './abis/PixelNFT';
import { marketplaceAbi } from './abis/Marketplace';


// --- CONTRACT CONFIGURATIONS ---
export const FACTORY_CONTRACT_ADDRESS = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS as `0x${string}`;

// The configurations no longer need casting, as the types are inferred correctly from the .ts files
export const factoryContract = {
  address: FACTORY_CONTRACT_ADDRESS,
  abi: canvasFactoryAbi, // Already has 'as const'
};

export const farcasterCanvasContract = {
  abi: farcasterCanvasAbi,
};

export const pixelNftContract = {
  abi: pixelNftAbi,
};

export const marketplaceContractConfig = {
  abi: marketplaceAbi,
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