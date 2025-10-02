// src/store/adminStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  specs: {
    display: string;
    processor: string;
    storage: string;
  };
  isNew?: boolean;
  brand: string;
  colors: string[];
  stock: number;
  category: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface AdminStore {
  products: Product[];
  orders: Order[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getStats: () => {
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
  };
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      products: [
        {
          id: 1,
          name: "iPhone 17 Pro Max",
          image: "https://i.pinimg.com/736x/19/b2/f6/19b2f6dc397a1be6fd5005303264a7c9.jpg",
          price: 129900,
          specs: { display: '6.9" Super Retina XDR', processor: "A19 Pro", storage: "256GB" },
          isNew: true,
          brand: "iPhone",
          colors: ["Titanium", "Blue", "White", "Black"],
          stock: 50,
          category: "flagship"
        },
        // Add your other products here with stock and category
      ],
      orders: [],
      
      addProduct: (product) => {
        set((state) => ({
          products: [...state.products, { ...product, id: Date.now() }]
        }));
      },

      updateProduct: (id, updatedProduct) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updatedProduct } : p
          )
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id)
        }));
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        }));
      },

      getStats: () => {
        const state = get();
        const totalProducts = state.products.length;
        const totalOrders = state.orders.length;
        const pendingOrders = state.orders.filter(order => order.status === 'pending').length;
        const totalRevenue = state.orders
          .filter(order => order.status === 'delivered')
          .reduce((sum, order) => sum + order.total, 0);

        return {
          totalProducts,
          totalOrders,
          pendingOrders,
          totalRevenue
        };
      }
    }),
    {
      name: 'admin-storage',
    }
  )
);