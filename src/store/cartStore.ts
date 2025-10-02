// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  cartItems: CartItem[];
  // Remove total as a separate state and compute it as a getter
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addToCart: (item: CartItem) => {
        set((state) => {
          const existing = state.cartItems.find((i) => i.id === item.id);
          if (existing) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.id === item.id 
                  ? { ...i, quantity: i.quantity + item.quantity } 
                  : i
              ),
            };
          }
          return { cartItems: [...state.cartItems, item] };
        });
      },

      removeFromCart: (id: string) => {
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.id !== id),
        }));
      },

      clearCart: () => {
        set({ cartItems: [] });
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);

// Create a selector for total that computes it from cartItems
export const useCartTotal = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
};