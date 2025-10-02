"use client";
import React from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../product/ProductCard"; 
import { products } from "../../utlis/data"; 

export function HeroSection() {
  // Pick only new arrivals from products array
  const newArrivals = products.filter((p) => p.isNew);

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
            <Link to={`/product/${product.id}`} key={product.id}>
              <ProductCard
                id={product.id}
                name={product.name}
                image={product.image}
                price={product.price}
                isNew={product.isNew}
                specs={product.specs}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
