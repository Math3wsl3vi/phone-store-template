"use client";
import { motion } from "framer-motion";


export default function Hero() {
  return (
    <section className="relative md:h-screen min-h-screen w-full bg-black text-white overflow-hidden pt-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-black opacity-80" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full max-w-7xl mx-auto px-6">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="max-w-lg text-center md:text-left"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            iPhone 17 <span className="text-gray-400">Pro Max</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Experience the future of smartphones with cutting-edge performance,
            breathtaking design, and advanced AI features.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="px-8 py-3 bg-white text-black rounded-md text-lg font-medium hover:bg-gray-200 transition">
              Buy Now
            </button>
            <button className="px-8 py-3 border border-white rounded-md text-lg font-medium hover:bg-gray-800 transition">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative mt-12 md:mt-0"
        >
        <img
                src="https://i.pinimg.com/736x/09/b3/13/09b31385fcf5381f3f166aa87f3dc03f.jpg"
                alt="iPhone 17 Pro Max"
                className="w-full max-w-[900px] h-full mx-auto object-contain drop-shadow-2xl"
                />

        </motion.div>
      </div>

      {/* Floating text at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center"
      >
        <p className="text-sm tracking-wide text-white">
          ↓
        </p>
      </motion.div>
    </section>
  );
}
