import React, { useState } from "react";
import { ProductCard } from "../product/ProductCard";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { products } from "../../utlis/data";

export function ProductCatalog() {
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [sortBy, setSortBy] = useState("newest");

  const filteredProducts = products.filter((product) => {
    if (selectedBrand !== "All" && product.brand !== selectedBrand) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "newest") return b.id - a.id;
    return 0;
  });

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">
          Explore Our Collection
        </h2>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                <SlidersHorizontal className="h-5 w-5 text-gray-500" />
              </div>

              {/* Brand Filter */}
              <div className="mb-8">
                <h4 className="font-medium mb-3 text-gray-700">Brand</h4>
                <div className="space-y-3">
                  {["All", "iPhone", "Samsung"].map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center cursor-pointer text-gray-600 hover:text-black transition"
                    >
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(brand)}
                        className="mr-3 h-4 w-4 accent-black"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-medium mb-3 text-gray-700">Price Range</h4>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-black"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Ksh {priceRange[0]}</span>
                  <span>Ksh {priceRange[1]}</span>
                </div>
              </div>

              <button className="w-full py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sorting */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-600">{sortedProducts.length} products</p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-black focus:outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  price={product.price}
                  specs={product.specs}
                  isNew={product.isNew}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
