// src/components/shop/iPhoneShop.tsx
import { useState, useEffect } from "react";
import { ProductCard } from "../product/ProductCard";
import { Filter, SortAsc, Grid, List } from "lucide-react";
import { Product, ProductsService } from "../../service/productService";

export function IPhoneShop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, priceRange, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await ProductsService.getAllProducts();
      const iphones = allProducts.filter(product => 
        product.brand.toLowerCase() === "iphone" && product.is_active
      );
      setProducts(iphones);
      
      // Set max price based on actual products
      const maxPrice = Math.max(...iphones.map(p => p.price));
      setPriceRange([0, Math.min(maxPrice, 300000)]);
    } catch (err) {
      setError("Failed to load iPhones");
      console.error("Error loading iPhones:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => {
      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      return true;
    });

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    setFilteredProducts(filtered);
  };

  const categories = ["all", "flagship", "mid-range", "budget"];
  const getCategoryDisplayName = (category: string) => {
    const names: { [key: string]: string } = {
      "all": "All iPhones",
      "flagship": "Flagship",
      "mid-range": "Mid Range",
      "budget": "Budget"
    };
    return names[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">iPhones</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">iPhones</h1>
          <p className="text-gray-600">
            Discover the latest iPhone models with cutting-edge technology
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Filter className="h-5 w-5 text-gray-500" />
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="font-medium mb-3 text-gray-700">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {getCategoryDisplayName(category)}
                    </button>
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
                    max="300000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Ksh {priceRange[0].toLocaleString()}</span>
                    <span>Ksh {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange([0, 300000]);
                }}
                className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
                <p className="text-gray-600">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex bg-white border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md ${
                      viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md ${
                      viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  <SortAsc className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <p className="text-gray-500 text-lg mb-4">No iPhones found matching your filters</p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, 300000]);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
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
            ) : (
              <div className="space-y-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-3/4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {product.specs.display} • {product.specs.processor} • {product.specs.storage}
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">
                            Ksh {product.price.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                            {product.is_new && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                New
                              </span>
                            )}
                          </div>
                          <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}