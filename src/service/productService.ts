// src/services/productsService.ts

import { supabaseAdmin } from "../lib/supabase"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  specs: {
    display: string
    processor: string
    storage: string
  }
  brand: string
  category: string
  colors: string[]
  stock: number
  is_new: boolean
  is_active: boolean
  created_at: string
}

export class ProductsService {
  static async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) return null
    return data
  }

  static async getProductsByBrand(brand: string): Promise<Product[]> {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('brand', brand)
      .eq('is_active', true)
      .order('price', { ascending: true })

    if (error) throw error
    return data || []
  }

  static async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('is_new', true)
      .eq('is_active', true)
      .limit(6)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}