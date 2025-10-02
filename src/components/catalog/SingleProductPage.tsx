import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { products } from "../../utlis/data";

interface SingleProductPageProps {
  products: typeof products; // Or define a proper Product type
}


export default function SingleProductPage({ products }: SingleProductPageProps) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Find the product based on URL parameter with proper type handling
  const product = products.find((p) => p.id === parseInt(productId || "1")) || products[0];
  
  const [selectedColor, setSelectedColor] = useState("");

  // Reset selected color when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || "");
    }
  }, [product]);

  // Handle navigation to product details with proper typing
  const handleProductClick = (newProductId: number) => {
    navigate(`/product/${newProductId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle add to cart with proper typing
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        id: String(product.id), // convert number -> string
        quantity: 1,
      });
    }
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Product Header */}
        <div className="text-center mb-8">
          {product.isNew && (
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
            src={product.image}
            alt={product.name}
            className="w-full h-auto"
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
                  <span className="text-sm text-gray-600">{selectedColor}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
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

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add to Bag
              </button>
              <button className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors">
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
                    <p className="text-gray-600">Or pick up available at Apple Store</p>
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
        <div className="max-w-7xl mx-auto mt-24">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center">
            You might also like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products
              .filter((p) => p.id !== product.id)
              .slice(0, 3)
              .map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(relatedProduct.id)}
                >
                  <div className="bg-gray-50 rounded-3xl overflow-hidden mb-4 transition-transform group-hover:scale-105">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="text-center">
                    {relatedProduct.isNew && (
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
      </div>
    </div>
  );
}