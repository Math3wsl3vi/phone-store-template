import React from 'react';
import { XIcon, ShoppingCartIcon } from 'lucide-react';
interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
export function CartPanel({
  isOpen,
  onClose
}: CartPanelProps) {
  const cartItems = []; // This would be connected to state in a real app
  return <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-6">
            {cartItems.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCartIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">
                  Looks like you haven't added any products yet.
                </p>
                <button onClick={onClose} className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  Continue Shopping
                </button>
              </div> : <div className="space-y-6">
                {/* This would map through cart items in a real app */}
              </div>}
          </div>
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold">$0.00</span>
            </div>
            <div className="flex justify-between mb-6">
              <span className="font-medium">Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors mb-3 font-medium" disabled={cartItems.length === 0}>
              Proceed to Checkout
            </button>
            <button onClick={onClose} className="w-full bg-transparent text-black border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>;
}