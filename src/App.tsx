// src/App.tsx
import { useState } from 'react';
import { CanvasGrid } from './components/CanvasGrid';
import { ConnectButton } from './components/ConnectButton';
import { PixelInfoPanel } from './components/PixelInfoPanel';
import { CanvasSelector } from './components/CanvasSelector';
import { CreateCanvasForm } from './components/CreateCanvasForm';
import { Toaster } from 'react-hot-toast';

// --- 1. Import the new ActivityFeed component ---
import { ActivityFeed } from './components/ActivityFeed';

import { useLiveCanvasData } from './hooks/useLiveCanvasData';
import { useCanvasStore } from './stores/canvasStore';
function App() {
  const [isCreating, setIsCreating] = useState(false);
  const { pixels, refetchCanvasData } = useLiveCanvasData();
  const { canvasWidth, canvasHeight } = useCanvasStore();

  function handleCanvasCreated() {
    setIsCreating(false);
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-4 bg-gray-50 sm:p-8">
       <Toaster position="top-right" />
      <div className="flex justify-between items-center w-full max-w-7xl mb-4">
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
        >
          {isCreating ? '← Back to Canvas' : '＋ Create New Canvas'}
        </button>
        <ConnectButton />
      </div>

      <header className="my-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Farcaster Canvas
        </h1>
      </header>
      
      {isCreating ? (
        <div className="w-full flex justify-center">
            <CreateCanvasForm onCanvasCreated={handleCanvasCreated} />
        </div>
      ) : (
        // --- THIS IS THE CORRECTED LAYOUT ---
        <div className="flex flex-col md:flex-row justify-center w-full gap-8">
          
          {/* Left Side: The Canvas Grid */}
          <div className="shadow-lg rounded-lg overflow-hidden w-[600px] h-[600px] flex-shrink-0">
            <CanvasGrid 
               width={canvasWidth}
              height={canvasHeight}
              pixels={pixels}
            />
          </div>

          {/* Right Side: The Control Panel */}
          <div className="flex flex-col w-full md:w-[400px] gap-4">
            <CanvasSelector />
            <ActivityFeed />
            {/* The PixelInfoPanel is now the final, permanent item in this column.
                It will show "Select a Pixel" by default, and update when a pixel is clicked. */}
            <PixelInfoPanel refetchData={refetchCanvasData} />
          </div>

        </div>
      )}
    </main>
  );
}

export default App;