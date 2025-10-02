"use client";
import React, { useState } from "react";
import { useCartStore, useCartTotal } from "../../store/cartStore"; // Import from Zustand store

export default function CheckoutPage() {
  // Use Zustand store
  const { cartItems } = useCartStore();
  const total = useCartTotal(); // Use the computed total
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "mpesa",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Please fill in all required fields.");
      return;
    }
    alert(`Order placed! Payment via ${formData.paymentMethod}.`);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                How would you like to get your order?
              </h2>
              <div className="space-y-4">
                <div className="border-2 border-gray-900 rounded-xl p-6 bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-lg mb-1">Deliver It</p>
                      <p className="text-sm text-gray-600">
                        Get it delivered to your address
                      </p>
                    </div>
                    <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                Enter your name and address
              </h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    We'll email you a receipt and send order updates to your mobile device.
                  </p>
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                How would you like to pay?
              </h2>
              <div className="space-y-3">
                <label className="flex items-center border-2 border-gray-900 rounded-xl p-4 cursor-pointer bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mpesa"
                    checked={formData.paymentMethod === "mpesa"}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="ml-3 font-medium">M-Pesa</span>
                </label>
                <label className="flex items-center border border-gray-300 rounded-xl p-4 cursor-pointer hover:border-gray-400">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="ml-3 font-medium">Credit or Debit Card</span>
                </label>
              </div>
            </section>
          </div>

          {/* Order Summary Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="border border-gray-200 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                {cartItems.length === 0 ? (
                  <p className="text-gray-500">Your bag is empty.</p>
                ) : (
                  <div className="space-y-6">
                    {/* Items */}
                    <div className="space-y-4">
                      {cartItems.map((item, idx: number) => (
                        <div key={idx} className="flex gap-4 mb-10">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            <p className="font-medium text-sm mt-1">
                              Ksh {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">Ksh {total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">Free</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Total */}
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-semibold">Total</span>
                      <div className="text-right">
                        <p className="text-2xl font-semibold">
                          Ksh {total.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors text-base"
                    >
                      Place Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}