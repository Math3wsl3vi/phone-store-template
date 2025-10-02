import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./pages/Home";
import { CartPanel } from "./components/cart/CartPanel";
import { ProductCatalog } from "./components/home/ProductCatalog";
import SingleProductPage from "./components/catalog/SingleProductPage";
import { CartProvider } from "./context/CartContext"; 
import CheckoutPage from "./components/cart/Checkout";
import { products } from "./utlis/data";
import { AdminRoute } from "./components/admin/AdminRoute";
import { AdminLogin } from "./components/admin/AdminLogin";

export function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAdminLogin = () => {
    // This function can be empty since the login logic is handled in AdminLogin component
  };

  return (
    <Router>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-white font-poppins">
          <Header onCartClick={() => setIsCartOpen(true)} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<ProductCatalog />} />
              <Route path="/product/:productId" element={<SingleProductPage products={products} />} />
              <Route path="/checkout" element={<CheckoutPage />} /> 
              <Route path="/admin" element={<AdminRoute />} />
              <Route path="/admin/login" element={<AdminLogin onLogin={handleAdminLogin} />} />
            </Routes>
          </main>
          <Footer />
          <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      </CartProvider>
    </Router>
  );
}