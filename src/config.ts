import canvasFactoryAbi from './abis/canvasFactory.json';
import farcasterCanvasAbi from './abis/farcasterCanvas.json';
import pixelNftAbi from './abis/pixelNft.json';

// Get the factory address from our environment variables
export const FACTORY_CONTRACT_ADDRESS = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS as `0x${string}`;

// Create the contract configurations for Wagmi
export const factoryContract = {
  address: FACTORY_CONTRACT_ADDRESS,
  abi: canvasFactoryAbi,
} as const; // `as const` is important for type safety

export const farcasterCanvasContract = {
  abi: farcasterCanvasAbi,
} as const;

export const pixelNftContract = {
  abi: pixelNftAbi,
} as const;

// src/config.ts - Add this to the file
import marketplaceAbi from './abis/marketplace.json';

export const marketplaceContractConfig = {
  abi: marketplaceAbi,
} as const;

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

/**
 * Represents the data for a single pixel.
 */
export interface PixelData {
  owner: string;
  colorIndex: number;
}

/**
 * Generates fake pixel data for UI development.
 */
export function generateMockPixels(width: number, height: number): Map<string, PixelData> {
  const mockPixels = new Map<string, PixelData>();
  
  // A smiley face :)
  const smileyCoords = [
    [10, 10], [15, 10], // Eyes
    [9, 13], [10, 14], [11, 15], [12, 15], [13, 15], [14, 14], [16, 13] // Smile
  ];

  smileyCoords.forEach(([x, y]) => {
    const key = `${x},${y}`;
    mockPixels.set(key, { owner: '0xMockUser1', colorIndex: 1 }); // Black
  });

  mockPixels.set('5,5', { owner: '0xMockUser2', colorIndex: 2 });
  mockPixels.set('25,25', { owner: '0xMockUser3', colorIndex: 4 });
  mockPixels.set('3,28', { owner: '0xMockUser1', colorIndex: 7 });

  return mockPixels;
}