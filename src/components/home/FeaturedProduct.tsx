import React from 'react';
import { BatteryFullIcon, MemoryStick, Microchip, SmartphoneIcon } from 'lucide-react';
export function FeaturedProduct() {
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <span className="text-blue-600 font-semibold mb-2 block">
              Featured Product
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              iPhone 17 Pro Max
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Experience the future with our most powerful iPhone ever.
              Featuring the groundbreaking A19 Pro chip, an immersive 6.9" Super
              Retina XDR display, and our most advanced camera system.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <SmartphoneIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">6.9" Display</h3>
                  <p className="text-sm text-gray-600">Super Retina XDR</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <Microchip className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">A19 Pro Chip</h3>
                  <p className="text-sm text-gray-600">Fastest performance</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <MemoryStick className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Up to 1TB</h3>
                  <p className="text-sm text-gray-600">Storage options</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <BatteryFullIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">All-day Battery</h3>
                  <p className="text-sm text-gray-600">Up to 28 hours</p>
                </div>
              </div>
            </div>
            <div className="flex items-center mb-8">
              <div className="mr-6">
                <p className="text-sm text-gray-500 mb-1">Starting at</p>
                <p className="text-3xl font-bold">Ksh 220,000</p>
              </div>
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Add to Cart
                </button>
                <button className="bg-gray-100 text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Learn More
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-5 h-5 rounded-full bg-black border-2 border-white shadow-sm"></div>
              <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-sm"></div>
              <div className="w-5 h-5 rounded-full bg-gray-300 border-2 border-white shadow-sm"></div>
              <div className="w-5 h-5 rounded-full bg-purple-700 border-2 border-white shadow-sm"></div>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full blur-3xl opacity-70"></div>
              <img src="https://i.pinimg.com/736x/a7/5c/41/a75c41ed714dad8246b09197434ee5f0.jpg" alt="iPhone 17 Pro Max" className="relative z-10 max-h-[500px] w-[800px] object-contain rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </section>;
}