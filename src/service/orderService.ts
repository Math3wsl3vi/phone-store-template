// src/services/ordersService.ts
import { supabase } from '../lib/supabase'

export interface Order {
  id: string
  customer_id?: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  shipping_address: any
  customer_email: string
  customer_phone: string
  customer_name: string
  created_at: string
  items: OrderItem[]
}

export interface OrderItem {
  product_id: string
  quantity: number
  unit_price: number
  product_name: string
  product_image: string
}

export class OrdersService {
  static async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'items'> & { items: OrderItem[] }): Promise<Order> {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          total_amount: orderData.total_amount,
          status: orderData.status,
          payment_method: orderData.payment_method,
          payment_status: orderData.payment_status,
          shipping_address: orderData.shipping_address,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          customer_name: orderData.customer_name,
        }
      ])
      .select()
      .single()

    if (orderError) throw orderError

    // Insert order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      product_name: item.product_name,
      product_image: item.product_image
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return { ...order, items: orderData.items }
  }

  static async getOrders(): Promise<Order[]> {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return orders || []
  }

  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) throw error
  }
}