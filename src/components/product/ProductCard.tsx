import React from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  price: number;
  specs: {
    display: string;
    processor: string;
    storage: string;
  };
  isNew?: boolean;
}

export function ProductCard({ id, name, image, price, specs, isNew }: ProductCardProps) {
  return (
    <Link to={`/product/${id}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white shadow-md hover:shadow-xl transition rounded-lg overflow-hidden">
        {/* Image wrapper with fixed height */}
        <div className="relative w-full h-64 flex items-center justify-center bg-gray-50 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          {isNew && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              New
            </span>
          )}
        </div>

        {/* Content (fills remaining space evenly) */}
        <div className="flex flex-col flex-grow p-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
            {name}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
            {specs.display} • {specs.processor} • {specs.storage}
          </p>
          <p className="text-xl font-bold text-gray-900 mt-auto">
            Ksh {price.toLocaleString()}
          </p>

          <button className="mt-4 w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition">
            Check It Out
          </button>
        </div>
      </div>
    </Link>
  );
}
