"use client";
import React from "react";
import { Link } from "react-router-dom";

const newArrivals = [
  {
    id: 1,
    name: "iPhone 17 Pro Max",
    image:
      "https://i.pinimg.com/736x/19/b2/f6/19b2f6dc397a1be6fd5005303264a7c9.jpg",
    price: 129999,
    isNew: true,
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    image:
      "https://i.pinimg.com/736x/24/22/32/24223258deb2711a6cfb6ffe2ba3b5e9.jpg",
    price: 119999,
    isNew: true,
  },
  {
    id: 3,
    name: "iPhone 15",
    image:
      "https://i.pinimg.com/736x/75/5f/44/755f44e406776455518d3af39a2a9bfe.jpg",
    price: 99999,
    isNew: true,
  },
  {
    id: 4,
    name: "Samsung Galaxy Z Fold 6",
    image:
      "https://i.pinimg.com/736x/4a/0e/72/4a0e729aeaf14e4887f47dc21fd989a3.jpg",
    price: 179900,
    isNew: true,
  },
];

export function HeroSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="md:max-w-fit mx-auto px-6">
        {/* Section Heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          New Arrivals
        </h2>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((phone) => (
            <Link to={`/product/${phone.id}`} className="group block" key={phone.id}>
              <div
                className="group relative bg-white shadow-md overflow-hidden hover:shadow-xl transition duration-300 w-full rounded-lg"
              >
                {/* Badge */}
              {phone.isNew && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  New
                </span>
              )}

              {/* Image */}
              <div className="relative h-64 flex items-center justify-center bg-white">
                <img
                  src={phone.image}
                  alt={phone.name}
                  className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {phone.name}
                </h3>
                <p className="text-gray-600"> Ksh {phone.price.toLocaleString()}</p>
                <button className="mt-4 w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition">
                  Buy Now
                </button>
              </div>
            </div>
          </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
