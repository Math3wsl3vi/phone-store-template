import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  ShoppingCartIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useCartStore } from "../../store/cartStore"; // Import from Zustand store
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Use Zustand store - select only cartItems
  const cartItems = useCartStore((state) => state.cartItems);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      // Force scrolled mode on non-homepages
      setIsScrolled(window.scrollY > 10 || location.pathname !== "/");
    };
    handleScroll(); // run once when route changes
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  // Switch colors
  const textColor = isScrolled
    ? "text-gray-800 hover:text-black"
    : "text-white hover:text-gray-200";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className={`text-2xl font-bold transition-colors ${
            isScrolled ? "text-black" : "text-white"
          }`}
        >
          PremiumPhones
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`${textColor} font-medium`}>
            Home
          </Link>
          <Link to="/iphones" className={`${textColor} font-medium`}>
            iPhones
          </Link>
          <Link to="/samsung" className={`${textColor} font-medium`}>
            Samsung
          </Link>
          <Link to="/samsung" className={`${textColor} font-medium`}>
            Gadgets
          </Link>
          <Link to="/support" className={`${textColor} font-medium`}>
            Support
          </Link>
        </nav>

        {/* Search + Cart */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={onCartClick}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ShoppingCartIcon
              className={`h-6 w-6 ${isScrolled ? "text-black" : "text-white"}`}
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={onCartClick}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ShoppingCartIcon
              className={`h-6 w-6 ${isScrolled ? "text-black" : "text-white"}`}
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <XIcon className={`h-6 w-6 ${isScrolled ? "text-black" : "text-white"}`} />
            ) : (
              <MenuIcon className={`h-6 w-6 ${isScrolled ? "text-black" : "text-white"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md absolute top-full left-0 right-0 border-b border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-4 pb-4">
              <Link to="/" className="text-gray-800 hover:text-black font-medium py-2">
                Home
              </Link>
              <Link to="/iphones" className="text-gray-800 hover:text-black font-medium py-2">
                iPhones
              </Link>
              <Link to="/samsung" className="text-gray-800 hover:text-black font-medium py-2">
                Samsung
              </Link>
              <Link to="/samsung" className="text-gray-800 hover:text-black font-medium py-2">
                Gadgets
              </Link>
              <Link to="/support" className="text-gray-800 hover:text-black font-medium py-2">
                Support
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}