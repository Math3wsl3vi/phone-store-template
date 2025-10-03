import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { Product, ProductsService } from "../../service/productService";

export default function SingleProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("");

  // Fetch product data from Supabase
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch the main product
        const productData = await ProductsService.getProductById(productId);
        
        if (!productData) {
          setError("Product not found");
          return;
        }

        setProduct(productData);
        setSelectedColor(productData.colors?.[0] || "");

        // Fetch related products (same brand)
        const allProducts = await ProductsService.getAllProducts();
        const related = allProducts
          .filter(p => p.id !== productData.id && p.brand === productData.brand)
          .slice(0, 3);
        
        setRelatedProducts(related);

      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id, // Use the actual UUID from database
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image_url, // Use image_url from database
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart({
        id: product.id,
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image_url,
      });
      // Navigate to checkout page immediately
      navigate('/checkout');
    }
  };

  const handleProductClick = (newProductId: string) => {
    navigate(`/product/${newProductId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="text-center mb-8">
              <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
              <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
            <div className="max-w-4xl mx-auto mb-16">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "The product you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Product Header */}
        <div className="text-center mb-8">
          {product.is_new && (
            <p className="text-orange-600 font-semibold text-sm mb-2 tracking-wide">NEW</p>
          )}
          <h1 className="text-5xl md:text-6xl font-semibold mb-3 tracking-tight">
            {product.name}
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            From Ksh {product.price.toLocaleString()}
          </p>
        </div>

        {/* Product Image */}
        <div className="max-w-4xl mx-auto mb-16">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Product Details Card */}
        <div className="max-w-2xl mx-auto mb-24">
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Color</h3>
                  <span className="text-sm text-gray-600 capitalize">{selectedColor}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase().includes("black")
                          ? "#1a1a1a"
                          : color.toLowerCase().includes("blue")
                          ? "#4a90e2"
                          : color.toLowerCase().includes("white")
                          ? "#f5f5f7"
                          : color.toLowerCase().includes("gold")
                          ? "#e5c89b"
                          : color.toLowerCase().includes("silver")
                          ? "#d4d4d4"
                          : color.toLowerCase().includes("titanium")
                          ? "#8e8e93"
                          : color.toLowerCase().includes("natural")
                          ? "#bfa98f"
                          : color.toLowerCase().includes("pink")
                          ? "#f4c2c2"
                          : color.toLowerCase().includes("green")
                          ? "#7fb069"
                          : color.toLowerCase().includes("navy")
                          ? "#2c3e50"
                          : color.toLowerCase().includes("cream")
                          ? "#f5f5dc"
                          : color.toLowerCase().includes("gray")
                          ? "#808080"
                          : "#9e9e9e",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            <div className="mb-10 space-y-6">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <span className="text-gray-600 capitalize">{key}</span>
                  <span className="font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>

            {/* Stock Information */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Availability</span>
                <span className={`font-semibold ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                {product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}
              </button>
              <button 
               onClick={handleBuyNow}
                className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>

            {/* Delivery Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Free delivery</p>
                    <p className="text-gray-600">Free delivery on all orders over Ksh 10,000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Returns</p>
                    <p className="text-gray-600">Free and easy returns within 14 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto mt-24">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center">
              You might also like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(relatedProduct.id)}
                >
                  <div className="bg-gray-50 rounded-3xl overflow-hidden mb-4 transition-transform group-hover:scale-105">
                    <img
                      src={relatedProduct.image_url}
                      alt={relatedProduct.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="text-center">
                    {relatedProduct.is_new && (
                      <p className="text-orange-600 font-semibold text-xs mb-1">NEW</p>
                    )}
                    <h3 className="font-semibold text-lg mb-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      From Ksh {relatedProduct.price.toLocaleString()}
                    </p>
                    <button className="text-blue-600 hover:underline text-sm font-medium">
                      Learn more
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}