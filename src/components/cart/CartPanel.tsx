import React from "react";
import { XIcon, ShoppingCartIcon } from "lucide-react";
import { useCartStore } from "../../store/cartStore"; // adjust path to your Zustand store
import { useNavigate } from "react-router-dom";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartPanel({ isOpen, onClose }: CartPanelProps) {
  // Use Zustand store - select only what you need
  const { cartItems, removeFromCart, clearCart } = useCartStore();
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const navigate = useNavigate();

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-grow overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCartIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">
                  Looks like you haven't added any products yet.
                </p>
                <button
                  onClick={onClose}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          Ksh {item.price.toLocaleString()} × {item.quantity}
                        </p>
                        <p className="text-sm text-gray-400">Total: Ksh {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold">Ksh {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-6">
              <span className="font-medium">Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <button
              onClick={() => {
                onClose(); // close cart panel
                navigate("/checkout");
              }}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors mb-3 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
            <button
              onClick={onClose}
              className="w-full bg-transparent text-black border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Continue Shopping
            </button>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="w-full mt-3 text-red-500 hover:underline"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}