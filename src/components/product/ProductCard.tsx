import React from "react";

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
    <div className="group bg-white shadow-md hover:shadow-xl transition overflow-hidden">
      {/* Image wrapper with fixed aspect ratio */}
      <div className="relative w-full h-64 overflow-hidden">
        <div className="relative w-full h-72 flex items-center justify-center bg-gray-50 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>

        {isNew && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            New
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-gray-600 text-sm mb-2">
          {specs.display} • {specs.processor} • {specs.storage}
        </p>
        <p className="text-xl font-bold text-gray-900">Ksh {price}</p>
        <button className="mt-4 w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
