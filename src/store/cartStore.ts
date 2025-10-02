// src/store/cartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProductsService } from '../service/productService'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  product_id: string
}

interface CartStore {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  loadProducts: () => Promise<void>
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addToCart: (item) => {
        set((state) => {
          const existing = state.cartItems.find((i) => i.id === item.id)
          if (existing) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.id === item.id 
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) } 
                  : i
              ),
            }
          }
          return { cartItems: [...state.cartItems, { ...item, quantity: item.quantity || 1 }] }
        })
      },

      removeFromCart: (id) => {
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id)
          return
        }
        
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => {
        set({ cartItems: [] })
      },

      loadProducts: async () => {
        try {
          // This would be used to sync cart with latest product data
          const products = await ProductsService.getAllProducts()
          // You can add logic here to update cart items with latest prices/availability
          console.log('Products loaded:', products)
        } catch (error) {
          console.error('Failed to load products:', error)
        }
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
)

// Computed total selector
export const useCartTotal = () => {
  const cartItems = useCartStore((state) => state.cartItems)
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
}