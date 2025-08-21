// src/components/ListModal.tsx
import { useState } from 'react';

// Define the properties (props) that this component accepts from its parent
interface ListModalProps {
  isOpen: boolean; // Controls whether the modal is visible
  onClose: () => void; // A function to call when the user wants to close the modal
  onList: (price: string) => void; // A function to call when the user confirms a price
  isLoading: boolean; // Disables buttons during a transaction
}

export function ListModal({ isOpen, onClose, onList, isLoading }: ListModalProps) {
  // Local state to manage the content of the price input field
  const [price, setPrice] = useState('0.01');

  // If the modal is not supposed to be open, render nothing.
  if (!isOpen) {
    return null;
  }

  // This function is called when the user submits the form (e.g., clicks "List Item")
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default browser page refresh on form submission
    onList(price); // Call the onList function passed from the parent, sending the price
  };

  return (
    // The modal overlay: a semi-transparent background that covers the whole screen
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      
      {/* The modal content panel */}
      <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-sm">
        <h3 className="text-xl font-bold text-gray-900">List Your Pixel for Sale</h3>
        <p className="mt-2 text-sm text-gray-500">
          Set a price in ETH. Other users will be able to buy it instantly. A marketplace fee will be applied upon a successful sale.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (ETH)
            </label>
            <input
              type="text" // Using type="text" is better for decimal values like ETH
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 0.01"
              required
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading} 
              className="w-full px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg transition-colors hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg transition-colors hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Confirming...' : 'List Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
