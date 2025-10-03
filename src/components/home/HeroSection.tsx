"use client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../product/ProductCard"; 
import { Product, ProductsService } from "../../service/productService";

export function HeroSection() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNewArrivals();
  }, []);

  const loadNewArrivals = async () => {
    try {
      setLoading(true);
      const products = await ProductsService.getFeaturedProducts();
      setNewArrivals(products);
    } catch (err) {
      setError("Failed to load new arrivals");
      console.error("Error loading new arrivals:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="md:max-w-fit mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            New Arrivals
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-lg shadow-md p-4">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="md:max-w-fit mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadNewArrivals}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (newArrivals.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="md:max-w-fit mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
          <p className="text-gray-600">No new products available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="md:max-w-fit mx-auto px-6">
        {/* Section Heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          New Arrivals
        </h2>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image_url}
              price={product.price}
              isNew={product.is_new}
              specs={product.specs}
            />
          ))}
        </div>
      </div>
    </section>
  );
}