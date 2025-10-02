import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./pages/Home";
import { CartPanel } from "./components/cart/CartPanel";
import { ProductCatalog } from "./components/home/ProductCatalog";
import SingleProductPage from "./components/catalog/SingleProductPage";

export function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<ProductCatalog />} />
            <Route path="/product/:id" element={<SingleProductPage />} />
          </Routes>
        </main>
        <Footer />
        <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </Router>
  );
}
