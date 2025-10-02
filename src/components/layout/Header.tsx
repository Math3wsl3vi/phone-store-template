import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  ShoppingCartIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useCart } from "../../context/CartContext"; // adjust path

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 👇 use cart from context
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Switch colors based on scroll
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
        <div className="flex items-center">
          <a
            href="/"
            className={`text-2xl font-bold transition-colors ${
              isScrolled ? "text-black" : "text-white"
            }`}
          >
            PremiumPhones
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/" className={`${textColor} font-medium`}>
            Home
          </a>
          <a href="/iphones" className={`${textColor} font-medium`}>
            iPhones
          </a>
          <a href="/samsung" className={`${textColor} font-medium`}>
            Samsung
          </a>
          <a href="/other-brands" className={`${textColor} font-medium`}>
            Other Brands
          </a>
          <a href="/support" className={`${textColor} font-medium`}>
            Support
          </a>
        </nav>

        {/* Search and Cart */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className={`pl-10 pr-4 py-2 rounded-lg border ${
                isScrolled
                  ? "border-gray-300 bg-white text-gray-800"
                  : "border-white/50 bg-white/10 text-white placeholder-white/70"
              } focus:outline-none focus:ring-2 focus:ring-gray-200 w-48`}
            />
            <SearchIcon
              className={`absolute left-3 top-2.5 h-5 w-5 ${
                isScrolled ? "text-gray-400" : "text-white/70"
              }`}
            />
          </div>
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
              <XIcon
                className={`h-6 w-6 ${
                  isScrolled ? "text-black" : "text-white"
                }`}
              />
            ) : (
              <MenuIcon
                className={`h-6 w-6 ${
                  isScrolled ? "text-black" : "text-white"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md absolute top-full left-0 right-0 border-b border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-2">
            <div className="my-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 w-full"
                />
                <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <nav className="flex flex-col space-y-4 pb-4">
              <a href="/" className="text-gray-800 hover:text-black font-medium py-2">
                Home
              </a>
              <a href="/iphones" className="text-gray-800 hover:text-black font-medium py-2">
                iPhones
              </a>
              <a href="/samsung" className="text-gray-800 hover:text-black font-medium py-2">
                Samsung
              </a>
              <a href="/other-brands" className="text-gray-800 hover:text-black font-medium py-2">
                Other Brands
              </a>
              <a href="/support" className="text-gray-800 hover:text-black font-medium py-2">
                Support
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
