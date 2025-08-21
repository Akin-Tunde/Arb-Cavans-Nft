// src/components/ListModal.tsx

import { useState } from 'react';

interface ListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onList: (price: string) => void;
  isLoading: boolean;
  // --- 1. ADDED: A title prop to make the modal reusable for "List" or "Update" ---
  title?: string;
  // --- 2. ADDED: An initial price for updating existing listings ---
  initialPrice?: string;
}

export function ListModal({ isOpen, onClose, onList, isLoading, title, initialPrice }: ListModalProps) {
  // --- 3. MODIFIED: Use the initialPrice if provided, otherwise default ---
  const [price, setPrice] = useState(initialPrice || '0.01');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(price) > 0) {
      onList(price);
    } else {
      // Basic validation feedback
      alert("Price must be greater than zero.");
    }
  };

  // --- 4. ADDED: A handler to validate user input as they type ---
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // This regex allows numbers and a single decimal point.
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      setPrice(value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-sm">
        {/* --- 5. MODIFIED: Use the title prop for the heading --- */}
        <h3 className="text-xl font-bold text-gray-900">{title || 'List Your Pixel for Sale'}</h3>
        <p className="mt-2 text-sm text-gray-500">
          Set a price in ETH. A marketplace fee will be applied upon a successful sale.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (ETH)
            </label>
            <input
              type="text"
              id="price"
              value={price}
              // --- 6. MODIFIED: Use the new controlled input handler ---
              onChange={handlePriceChange}
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
              {isLoading ? 'Confirming...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}