import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/Home';
import { CartPanel } from './components/cart/CartPanel';
export function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  return <div className="flex flex-col min-h-screen bg-white font-poppins">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="flex-grow">
        <HomePage />
      </main>
      <Footer />
      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>;
}