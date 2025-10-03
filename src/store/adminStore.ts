// src/store/adminStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabaseAdmin } from '../lib/supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  specs: {
    display: string;
    processor: string;
    storage: string;
  };
  brand: string;
  category: string;
  colors: string[];
  stock: number;
  is_new: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id?: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address: any;
  customer_email: string;
  customer_phone: string;
  customer_name: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product_name: string;
  product_image: string;
}

interface AdminStore {
  products: Product[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'is_active'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
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
      products: [],
      orders: [],
      loading: false,
      error: null,

      fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabaseAdmin
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ products: data || [] });
        } catch (error) {
          set({ error: 'Failed to fetch products' });
          console.error('Error fetching products:', error);
        } finally {
          set({ loading: false });
        }
      },

      addProduct: async (productData) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabaseAdmin
            .from('products')
            .insert([{
              ...productData,
              is_active: true,
              created_at: new Date().toISOString(),
            }])
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            products: [data, ...state.products],
          }));
        } catch (error) {
          set({ error: 'Failed to add product' });
          console.error('Error adding product:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      updateProduct: async (id, productData) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabaseAdmin
            .from('products')
            .update(productData)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            products: state.products.map((p) =>
              p.id === id ? { ...p, ...data } : p
            ),
          }));
        } catch (error) {
          set({ error: 'Failed to update product' });
          console.error('Error updating product:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      deleteProduct: async (id) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
          }));
        } catch (error) {
          set({ error: 'Failed to delete product' });
          console.error('Error deleting product:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      fetchOrders: async () => {
        set({ loading: true, error: null });
        try {
          const { data: orders, error: ordersError } = await supabaseAdmin
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

          if (ordersError) throw ordersError;

          // Fetch order items for each order
          const ordersWithItems = await Promise.all(
            (orders || []).map(async (order) => {
              const { data: items, error: itemsError } = await supabaseAdmin
                .from('order_items')
                .select('*')
                .eq('order_id', order.id);

              if (itemsError) throw itemsError;

              return {
                ...order,
                items: items || [],
              };
            })
          );

          set({ orders: ordersWithItems });
        } catch (error) {
          set({ error: 'Failed to fetch orders' });
          console.error('Error fetching orders:', error);
        } finally {
          set({ loading: false });
        }
      },

      updateOrderStatus: async (orderId, status) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabaseAdmin
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', orderId);

          if (error) throw error;

          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === orderId ? { ...order, status } : order
            ),
          }));
        } catch (error) {
          set({ error: 'Failed to update order status' });
          console.error('Error updating order status:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      getStats: () => {
        const state = get();
        const totalProducts = state.products.length;
        const totalOrders = state.orders.length;
        const pendingOrders = state.orders.filter(order => order.status === 'pending').length;
        const totalRevenue = state.orders
          .filter(order => order.status === 'delivered')
          .reduce((sum, order) => sum + order.total_amount, 0);

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
      partialize: (state) => ({ 
        products: state.products,
        orders: state.orders 
      }),
    }
  )
);