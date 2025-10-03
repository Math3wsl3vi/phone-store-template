"use client";
import { useState, useEffect, useCallback } from "react";
import { ProductCard } from "../product/ProductCard";
import { SlidersHorizontal, ChevronDown, RefreshCw, Search } from "lucide-react";
import { Product, ProductsService } from "../../service/productService";

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const allProducts = await ProductsService.getAllProducts();
      setProducts(allProducts);
      
      // Set max price based on actual products
      const maxPrice = Math.max(...allProducts.map(p => p.price));
      setPriceRange([0, Math.min(maxPrice, 200000)]);
    } catch (err) {
      setError("Failed to load products");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = useCallback(() => {
    const filtered = products.filter((product) => {
      // Search filter
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Brand filter
      if (selectedBrand !== "All" && product.brand !== selectedBrand) {
        return false;
      }
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      return true;
    });

    // Sort products
    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });
  }, [products, selectedBrand, priceRange, sortBy, searchQuery]);

  const sortedProducts = filterAndSortProducts();

  // Get unique brands from products
  const brands = ["All", ...new Set(products.map(product => product.brand))];

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">
            Explore Our Collection
          </h2>
          <div className="flex justify-center items-center py-20">
            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mr-3" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">
            Explore Our Collection
          </h2>
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadProducts}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">
          Explore Our Collection
        </h2>

        {/* Search Bar */}
        <div className="mb-8 lg:w-1/4">
          <div className="relative max-w-md mx-auto lg:mx-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gadgets by name..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </div>

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
                  {brands.map((brand) => (
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
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-black"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Ksh {priceRange[0].toLocaleString()}</span>
                    <span>Ksh {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setSelectedBrand("All");
                    setPriceRange([0, 200000]);
                    setSearchQuery("");
                  }}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                >
                  Clear
                </button>
                <button 
                  onClick={loadProducts}
                  className="flex-1 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sorting */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-600">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-black focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Product Cards */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <p className="text-gray-500 text-lg mb-4">No products found matching your filters</p>
                <button
                  onClick={() => {
                    setSelectedBrand("All");
                    setPriceRange([0, 200000]);
                    setSearchQuery("");
                  }}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.image_url}
                    price={product.price}
                    specs={product.specs}
                    isNew={product.is_new}
                    brand={product.brand}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}