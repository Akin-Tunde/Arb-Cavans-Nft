import { create } from 'zustand'

export interface PixelSelection {
  x: number;
  y: number;
}

interface UiState {
  selectedPixel: PixelSelection | null;
  selectPixel: (x: number, y: number) => void;
  clearSelection: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedPixel: null,
  selectPixel: (x, y) => set({ selectedPixel: { x, y } }),
  clearSelection: () => set({ selectedPixel: null }),
}))