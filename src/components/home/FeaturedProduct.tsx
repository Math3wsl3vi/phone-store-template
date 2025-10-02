// src/components/FeaturedProduct.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, ProductsService } from '../../service/productService';
import { useCartStore } from '../../store/cartStore';
import { BatteryFullIcon, MemoryStick, Microchip, Plus, SmartphoneIcon } from 'lucide-react';

export function FeaturedProduct() {
  const addToCart = useCartStore((state) => state.addToCart);
  const navigate = useNavigate();
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProduct();
  }, []);

  const loadFeaturedProduct = async () => {
    try {
      const products = await ProductsService.getFeaturedProducts();
      if (products.length > 0) {
        setFeaturedProduct(products[0]);
      }
    } catch (error) {
      console.error('Failed to load featured product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!featuredProduct) return;
    
    addToCart({
      id: featuredProduct.id,
      name: featuredProduct.name,
      price: featuredProduct.price,
      image: featuredProduct.image_url,
      product_id: featuredProduct.id,
      quantity: 1
    });
    
    alert(`${featuredProduct.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!featuredProduct) return;
    
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">Loading featured product...</div>
        </div>
      </section>
    );
  }

  if (!featuredProduct) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <span className="text-blue-600 font-semibold mb-2 block">
              Featured Product
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {featuredProduct.name}
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              {featuredProduct.description}
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Display product specs dynamically */}
              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <SmartphoneIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Display</h3>
                  <p className="text-sm text-gray-600">{featuredProduct.specs.display}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <Microchip className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Processor</h3>
                  <p className="text-sm text-gray-600">{featuredProduct.specs.processor}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <MemoryStick className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Storage</h3>
                  <p className="text-sm text-gray-600">{featuredProduct.specs.storage}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <BatteryFullIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Battery Life</h3>
                  <p className="text-sm text-gray-600">All-day battery</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
              {/* Price */}
              <div className="md:mr-6">
                <p className="text-sm text-gray-500 mb-1">Starting at</p>
                <p className="text-3xl font-bold">Ksh {featuredProduct.price.toLocaleString()}</p>
              </div>

              {/* Buttons */}
              <div className="w-full md:w-1/2 space-y-3 md:space-y-0 md:space-x-3 flex flex-col md:flex-row">
                <button 
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="flex items-center space-x-4">
              {featuredProduct.colors.map((color, index) => (
                <div 
                  key={index}
                  className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                  style={{ 
                    backgroundColor: color.toLowerCase().includes('black') ? '#000' :
                                   color.toLowerCase().includes('blue') ? '#3b82f6' :
                                   color.toLowerCase().includes('white') ? '#f3f4f6' :
                                   color.toLowerCase().includes('gray') ? '#9ca3af' :
                                   color.toLowerCase().includes('titanium') ? '#71717a' :
                                   '#6b7280'
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full blur-3xl opacity-70"></div>
              <img 
                src={featuredProduct.image_url} 
                alt={featuredProduct.name} 
                className="relative z-10 max-h-[500px] w-[800px] object-contain rounded-md" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}