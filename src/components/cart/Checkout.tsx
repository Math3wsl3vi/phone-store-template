"use client";
import { useState } from "react";
import { useCartStore, useCartTotal } from "../../store/cartStore";
import { useNavigate } from "react-router-dom";
import { OrdersService } from "../../service/orderService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define interfaces for type safety
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: "mpesa" | "card";
}

interface CartItem {
  id?: string;
  product_id?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartItemForOrder {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: string;
  total_amount: number;
  items: CartItemForOrder[];
  created_at: string;
}

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCartStore();
  const total = useCartTotal();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "mpesa",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handlePlaceOrder = async () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData: OrderDetails = {
        customer_name: formData.fullName,
        customer_email: formData.email || `customer-${Date.now()}@example.com`,
        customer_phone: formData.phone,
        shipping_address: formData.address,
        payment_method: formData.paymentMethod,
        total_amount: total,
        items: cartItems.map((item: CartItem) => ({
          product_id: item.product_id || item.id || "unknown-product",
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        id: "",
        created_at: new Date().toLocaleString(),
      };

      console.log("Creating order with data:", orderData);

      const order = await OrdersService.createOrder(orderData);

      console.log("Order created successfully:", order);

      setOrderDetails({
        ...orderData,
        id: order.id,
      });

      clearCart();

      toast.success(`Order placed successfully! Order ID: ${order.id.slice(-8).toUpperCase()}`, {
        position: "top-right",
        autoClose: 3000,
      });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to place order. Please try again.";
      console.error("Error placing order:", err);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseReceipt = () => {
    setOrderDetails(null);
    navigate("/");
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <ToastContainer />
      
      {orderDetails ? (
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="border border-gray-200 rounded-2xl p-8 bg-gray-50 print:border-0 print:p-4">
            <h2 className="text-2xl font-semibold mb-6 print:text-xl">Order Receipt</h2>
            <div className="space-y-6 print:space-y-4">
              <div>
                <p className="text-lg font-medium print:text-base">Order ID: {orderDetails.id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-gray-600 print:text-xs">Placed on: {orderDetails.created_at}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold print:text-base">Customer Details</h3>
                <p className="text-sm print:text-xs">Name: {orderDetails.customer_name}</p>
                <p className="text-sm print:text-xs">Email: {orderDetails.customer_email}</p>
                <p className="text-sm print:text-xs">Phone: {orderDetails.customer_phone}</p>
                <p className="text-sm print:text-xs">Address: {orderDetails.shipping_address}</p>
                <p className="text-sm print:text-xs">Payment Method: {orderDetails.payment_method}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold print:text-base">Order Items</h3>
                {orderDetails.items.map((item: CartItemForOrder, idx: number) => (
                  <div key={idx} className="flex gap-4 mb-4 print:mb-2 print:flex print:items-start">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg print:w-12 print:h-12 print:rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm print:text-xs">{item.name}</p>
                      <p className="text-sm text-gray-500 print:text-xs">Qty: {item.quantity}</p>
                      <p className="font-medium text-sm print:text-xs">
                        Ksh {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 print:border-t print:pt-2">
                <div className="flex justify-between text-lg font-semibold print:text-base">
                  <span>Total</span>
                  <span>Ksh {orderDetails.total_amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-4 print:hidden">
                <button
                  onClick={handlePrintReceipt}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  Print Receipt
                </button>
                <button
                  onClick={handleCloseReceipt}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-12 print:hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
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
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  Enter your name and address
                </h2>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name *"
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
                      placeholder="Phone Number *"
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
                      placeholder="Street Address *"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </section>
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
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500">Your bag is empty.</p>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {cartItems.map((item: CartItem, idx: number) => (
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
                      <div className="border-t border-gray-200"></div>
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
                      <div className="border-t border-gray-200"></div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-semibold">Total</span>
                        <div className="text-right">
                          <p className="text-2xl font-semibold">
                            Ksh {total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={loading || cartItems.length === 0}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors text-base disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Placing Order...
                          </>
                        ) : (
                          "Place Order"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .max-w-3xl {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .max-w-3xl * {
            visibility: visible;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
          .print\\:p-4 {
            padding: 1rem !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:text-xl {
            font-size: 1.25rem !important;
          }
          .print\\:text-base {
            font-size: 1rem !important;
          }
          .print\\:text-xs {
            font-size: 0.75rem !important;
          }
          .print\\:w-12 {
            width: 3rem !important;
          }
          .print\\:h-12 {
            height: 3rem !important;
          }
          .print\\:mb-2 {
            margin-bottom: 0.5rem !important;
          }
          .print\\:rounded {
            border-radius: 0.25rem !important;
          }
          .print\\:pt-2 {
            padding-top: 0.5rem !important;
          }
          .print\\:space-y-4 > * + * {
            margin-top: 1rem !important;
          }
          .print\\:flex {
            display: flex !important;
          }
          .print\\:items-start {
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}