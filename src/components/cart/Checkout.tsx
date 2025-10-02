"use client";
import React, { useState } from "react";
import { CartItem, useCart } from "../../context/CartContext";

export function CheckoutPage() {
  const { cartItems, total } = useCart();
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

    // Mock checkout
    alert(`Order placed! Payment via ${formData.paymentMethod}.`);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Shipping Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <div>
            <label className="block mb-2 font-medium">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="mpesa">M-Pesa</option>
              <option value="card">Credit/Debit Card</option>
            </select>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item:CartItem, idx: number) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>Ksh {item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg pt-4">
                <span>Total:</span>
                <span>Ksh {total}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Place Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
