// src/services/ordersService.ts
import { supabaseAdmin } from "../lib/supabase"

export interface OrderItem {
  product_id: string
  quantity: number
  unit_price: number
  product_name: string
  product_image: string
}

export interface CartItemForOrder {
  product_id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface ShippingAddress {
  address: string;
}

export interface Order {
  id: string
  customer_id?: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  shipping_address: ShippingAddress
  customer_email: string
  customer_phone: string
  customer_name: string
  created_at: string
  items: OrderItem[]
}

export class OrdersService {
 static async createOrder(orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    payment_method: string;
    items: CartItemForOrder[];
    total_amount: number;
  }): Promise<Order> {
    try {
      // Since we can't query by numeric IDs, let's get all products and map by name
      const { data: allProducts, error: productsError } = await supabaseAdmin
        .from('products')
        .select('id, name, price, image_url')
        .eq('is_active', true);

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw new Error(`Failed to fetch products: ${productsError.message}`);
      }

      // Create a mapping from product name to database ID
      const productMap = new Map();
      allProducts?.forEach(product => {
        productMap.set(product.name.toLowerCase(), {
          id: product.id,
          price: product.price,
          image_url: product.image_url
        });
      });

      // Create the order
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert([
          {
            total_amount: orderData.total_amount,
            status: 'pending',
            payment_method: orderData.payment_method,
            payment_status: 'pending',
            shipping_address: { address: orderData.shipping_address },
            customer_email: orderData.customer_email,
            customer_phone: orderData.customer_phone,
            customer_name: orderData.customer_name,
          }
        ])
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      if (!order) {
        throw new Error('No order data returned from database');
      }

      // Transform cart items to order items format using product name mapping
      const orderItems = orderData.items.map(item => {
        const productInfo = productMap.get(item.name.toLowerCase());
        
        if (!productInfo) {
          console.warn(`Product "${item.name}" not found in database. Available products:`, Array.from(productMap.keys()));
          throw new Error(`Product "${item.name}" not found in database`);
        }

        return {
          order_id: order.id,
          product_id: productInfo.id, // Use the actual UUID from database
          quantity: item.quantity,
          unit_price: productInfo.price, // Use price from database to ensure consistency
          product_name: item.name,
          product_image: productInfo.image_url || item.image
        };
      });

      console.log('Inserting order items:', orderItems);

      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        
        // Clean up: delete the order if items failed
        await supabaseAdmin
          .from('orders')
          .delete()
          .eq('id', order.id);
          
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      // Fetch the complete order with items
      const completeOrder = await this.getOrderById(order.id);
      
      if (!completeOrder) {
        throw new Error('Failed to retrieve created order');
      }

      return completeOrder;

    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  }

  static async getOrderById(orderId: string): Promise<Order | null> {
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return order;
  }

  static async getOrders(): Promise<Order[]> {
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
    return orders || []
  }

  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) throw error
  }
}