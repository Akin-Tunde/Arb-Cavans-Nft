// src/App.tsx
import { useState } from 'react';
import { CanvasGrid } from './components/CanvasGrid';
import { ConnectButton } from './components/ConnectButton';
import { PixelInfoPanel } from './components/PixelInfoPanel';
import { CanvasSelector } from './components/CanvasSelector';
import { CreateCanvasForm } from './components/CreateCanvasForm'; // Import the new form
import { useCanvasStore } from './stores/canvasStore';
import { useLiveCanvasData } from './hooks/useLiveCanvasData'; // We will create this hook next

const CANVAS_WIDTH = 32; // This will become dynamic later
const CANVAS_HEIGHT = 32;

function App() {
  const [isCreating, setIsCreating] = useState(false); // State to toggle UI
  const { pixels, refetchCanvasData } = useLiveCanvasData(); // Use our new data hook

  // This function will be called by the form on success
  function handleCanvasCreated() {
    refetchCanvasData(); // Refetch the list of canvases
    setIsCreating(false); // Switch back to the player view
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-4 bg-gray-50 sm:p-8">
      <div className="flex justify-between items-center w-full max-w-7xl">
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
        >
          {isCreating ? '← Back to Canvas' : '＋ Create New Canvas'}
        </button>
        <ConnectButton />
      </div>

      <header className="my-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Farcaster Canvas
        </h1>
      </header>
      
      {isCreating ? (
        // --- CREATOR VIEW ---
        <CreateCanvasForm onCanvasCreated={handleCanvasCreated} />
      ) : (
        // --- PLAYER VIEW ---
        <div className="flex flex-wrap justify-center w-full gap-8">
          <div className="shadow-lg rounded-lg overflow-hidden w-[600px] h-[600px]">
            <CanvasGrid 
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              pixels={pixels}
            />
          </div>
          <div className="flex flex-col w-[300px] gap-4">
            <CanvasSelector />
            <PixelInfoPanel />
          </div>
        </div>
      )}
    </main>
  );
}

export default App;