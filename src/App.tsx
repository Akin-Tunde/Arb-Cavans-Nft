import { CanvasGrid } from './components/CanvasGrid';
import { ConnectButton } from './components/ConnectButton';
import { generateMockPixels } from './config';

// We will build the PixelInfoPanel component in the next step
// import { PixelInfoPanel } from './components/PixelInfoPanel';

const CANVAS_WIDTH = 32;
const CANVAS_HEIGHT = 32;
const mockPixelData = generateMockPixels(CANVAS_WIDTH, CANVAS_HEIGHT);

function App() {
  return (
    <main className="flex flex-col items-center min-h-screen p-4 bg-gray-50 sm:p-8">
      <div className="flex justify-end w-full max-w-7xl">
        <ConnectButton />
      </div>

      <header className="my-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Farcaster Canvas
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          A collaborative, on-chain artboard built with React, Wagmi, and Tailwind CSS.
        </p>
      </header>
      
      <div className="flex flex-wrap justify-center w-full gap-8">
        <div className="shadow-lg rounded-lg overflow-hidden w-[600px] h-[600px]">
          <CanvasGrid 
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            pixels={mockPixelData}
          />
        </div>
        
        <div className="w-[300px]">
          {/* We will replace this with the real info panel next */}
          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">Select a Pixel</h3>
            <p className="mt-2 text-sm text-gray-500">Click on any pixel on the canvas to see its details and interact.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;