// src/components/CreateCanvasForm.tsx

import { useState, useEffect } from 'react'; // 1. Import useEffect
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { factoryContract } from '../config';
import { parseEther } from 'viem';
import { BaseError } from 'viem';
import toast from 'react-hot-toast';

interface CreateCanvasFormProps {
  onCanvasCreated: () => void; // A function to call when creation is successful
}

export function CreateCanvasForm({ onCanvasCreated }: CreateCanvasFormProps) {
  // Form state
  const [width, setWidth] = useState(32);
  const [height, setHeight] = useState(32);
  const [mintPrice, setMintPrice] = useState('0.0001');
  const [fee, setFee] = useState('2.5');

  const { isConnected } = useAccount();
  const { data: hash, error, writeContract, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Convert form values to the correct types for the smart contract
    const priceInWei = parseEther(mintPrice);
    const feeInBps = Math.round(parseFloat(fee) * 100); // 2.5% -> 250 BPS

    writeContract({
      ...factoryContract,
      functionName: 'createCanvas',
      args: [BigInt(width), BigInt(height), priceInWei, BigInt(feeInBps)],
    });
  }
  
  // 2. THE FIX: The state update logic is moved into a useEffect hook.
  // This hook runs *after* the component renders, safely performing the side effect.
  useEffect(() => {
    if (isConfirmed) {
      toast.success('Success! Your canvas is live.');
      // Call the function passed from the parent component (App.tsx)
      onCanvasCreated();
      // Reset wagmi's writeContract state to be ready for another transaction
      reset();
    }
  }, [isConfirmed, onCanvasCreated, reset]); // Dependency array ensures this runs only when these values change

  // Note: The problematic 'if (isConfirmed) { ... }' block that was here has been removed.

  const isLoading = isPending || isConfirming;

  return (
    <div className="w-full max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold">Launch a New Canvas</h3>
      <p className="mt-2 text-sm text-gray-500">Define the rules for your new world. You will be the owner and receive all fees.</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-700">Width</label>
            <input type="number" id="width" value={width} onChange={e => setWidth(parseInt(e.target.value))} className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height</label>
            <input type="number" id="height" value={height} onChange={e => setHeight(parseInt(e.target.value))} className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm" required />
          </div>
        </div>

        <div>
          <label htmlFor="mintPrice" className="block text-sm font-medium text-gray-700">Mint Price (ETH)</label>
          <input type="text" id="mintPrice" value={mintPrice} onChange={e => setMintPrice(e.target.value)} className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm" required />
        </div>

        <div>
          <label htmlFor="fee" className="block text-sm font-medium text-gray-700">Marketplace Fee (%)</label>
          <input type="text" id="fee" value={fee} onChange={e => setFee(e.target.value)} className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm" required />
        </div>

        <button
          type="submit"
          disabled={!isConnected || isLoading}
          className="w-full px-4 py-3 font-bold text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Confirming...' : isPending ? 'Check Wallet' : 'Launch Canvas'}
        </button>
      </form>

      <div className="mt-4 text-xs font-mono h-12">
        {hash && <div>Transaction Hash: {hash.substring(0,10)}...</div>}
        {isConfirming && <div className="text-blue-600">Deploying your canvas to the blockchain...</div>}
        {isConfirmed && <div className="text-green-600">Deployment successful! Redirecting...</div>}
        {error && (
          <div className="text-red-600 break-words">
            Error: {error instanceof BaseError ? error.shortMessage : error.message}
          </div>
        )}
      </div>
    </div>
  );
}