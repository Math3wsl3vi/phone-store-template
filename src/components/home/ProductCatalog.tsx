import React, { useState } from "react";
import { ProductCard } from "../product/ProductCard";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

const products = [
  {
    id: 1,
    name: "iPhone 17 Pro Max",
    image:
      "https://i.pinimg.com/736x/19/b2/f6/19b2f6dc397a1be6fd5005303264a7c9.jpg",
    price: 129900,
    specs: { display: '6.9" Super Retina XDR', processor: "A19 Pro", storage: "256GB" },
    isNew: true,
    brand: "iPhone",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    image:
      "https://i.pinimg.com/736x/24/22/32/24223258deb2711a6cfb6ffe2ba3b5e9.jpg",
    price: 119900,
    specs: { display: '6.8" Dynamic AMOLED', processor: "Snapdragon 8 Gen 3", storage: "256GB" },
    isNew: true,
    brand: "Samsung",
  },
  {
    id: 3,
    name: "iPhone 17 Air",
    image:
      "https://i.pinimg.com/736x/06/f2/fc/06f2fce304cbbd6bc50fb773c6615b8f.jpg",
    price: 99999,
    specs: { display: '6.1" Retina XDR', processor: "A19", storage: "128GB" },
    isNew: true,
    brand: "iPhone",
  },
  {
    id: 4,
    name: "Samsung Galaxy Z Fold 6",
    image:
      "https://i.pinimg.com/736x/4a/0e/72/4a0e729aeaf14e4887f47dc21fd989a3.jpg",
    price: 179900,
    specs: { display: '7.6" Foldable Dynamic AMOLED', processor: "Snapdragon 8 Gen 3", storage: "512GB" },
    isNew: true,
    brand: "Samsung",
  },
  {
    id: 5,
    name: "iPhone 16 Pro",
    image:
      "https://i.pinimg.com/736x/75/5f/44/755f44e406776455518d3af39a2a9bfe.jpg",
    price: 99999,
    specs: { display: '6.1" Super Retina XDR', processor: "A18 Pro", storage: "256GB" },
    brand: "iPhone",
  },
  {
    id: 6,
    name: "iPhone 15 Pro Max",
    image:
      "https://i.pinimg.com/1200x/18/84/24/1884248df0286062436ea23d29ef5183.jpg",
    price: 99999,
    specs: { display: '6.7" Dynamic AMOLED', processor: "Snapdragon 8 Gen 3", storage: "256GB" },
    brand: "Samsung",
  },
];

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
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
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
