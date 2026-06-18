import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { API, useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/useCartStore";
import { trackEvent } from "@/utils/analytics";

export default function Checkout() {
  const { register, handleSubmit } = useForm();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const cartItems = useCartStore((state) => state.items);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto py-15">
          <div className="flex flex-col items-center text-center">
            {/* Illustration */}
            <img
              src="/empty-cart.png"
              alt="Empty Cart"
              className="w-72 h-72 object-contain"
            />

            <h1 className="text-4xl font-bold">🌿 Your Cart Feels Light</h1>

            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Add some PurePuff products and take a step toward better
              respiratory wellness.
            </p>

            <Link
              to="/products"
              className="mt-8 rounded-xl bg-green-600 px-8 py-4 text-white font-semibold hover:bg-green-700 transition"
            >
              Shop Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0,
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const initPaymentMatrix = async (orderData) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = async () => {
      try {
        const razorOrderRes = await API.post("/payment/create-order", {
          orderId: orderData._id,
        });
        const options = {
          key: "rzp_test_yourid", // Pull cleanly inside actual process configurations
          amount: razorOrderRes.data.amount,
          currency: razorOrderRes.data.currency,
          name: "PUREPUFF CORE",
          description: "Product Purchase",
          order_id: razorOrderRes.data.id,
          handler: async function (response) {
            const verification = await API.post("/payment/verify", response);
            if (verification.data.status === "success") {
              trackEvent("purchase", {
                transaction_id: orderData._id,
                value: total,
                currency: "INR",
              });
              window.location.href = `/order-success/${orderData._id}`;
            }
          },
          theme: { color: "#030303" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        alert("Payment initialization breakdown.");
      }
    };
  };

  const onCheckoutSubmit = async (formData) => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Add items before checking out.");
      return;
    }

    setLoading(true);
    trackEvent("begin_checkout", { value: total, currency: "INR" });
    try {
      const orderPayload = {
        items: cartItems,
        shippingAddress: {
          fullName: formData.fullName,
          email: user?.email || formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      };
      const res = await API.post("/orders", orderPayload);

      // Todo
      await initPaymentMatrix(res.data);
    } catch (error) {
      alert(
        error.response?.data?.message || "Order lifecycle processing failure.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 pt-20 pb-12 px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      <motion.div
        initial={{ opacity: 0, x: 0, y:-30 }}
        animate={{ opacity: 1, x: -30 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="bg-white/70 border border-slate-200/60 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.08)]"
      >
        <h3 className="text-2xl font-semibold tracking-[-0.02em] mb-8 text-slate-900">
          Shipping Information
        </h3>
        <form onSubmit={handleSubmit(onCheckoutSubmit)} className="space-y-5">
          <input
            {...register("fullName", { required: true })}
            placeholder="Full Name"
            className="w-full bg-white/50 border border-slate-200 focus:border-emerald-300 focus:bg-white rounded-2xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
          />
          <input
            {...register("phone", { required: true })}
            placeholder="Phone Number"
            className="w-full bg-white/50 border border-slate-200 focus:border-emerald-300 focus:bg-white rounded-2xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
          />
          <input
            {...register("address", { required: true })}
            placeholder="Street Address"
            className="w-full bg-white/50 border border-slate-200 focus:border-emerald-300 focus:bg-white rounded-2xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              {...register("city", { required: true })}
              placeholder="City"
              className="bg-white/50 border border-slate-200 focus:border-emerald-300 focus:bg-white rounded-2xl px-4 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
            />
            <input
              {...register("state", { required: true })}
              placeholder="State"
              className="bg-white/50 border border-slate-200 focus:border-emerald-300 focus:bg-white rounded-2xl px-4 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
            />
            <input
              {...register("pincode", { required: true })}
              placeholder="Pincode"
              className="bg-white/50 border border-slate-200 focus:border-emerald-300 focus:bg-white rounded-2xl px-4 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-400 text-white font-semibold text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-500 transition duration-300 shadow-[0_18px_60px_rgba(16,185,129,0.22)] hover:shadow-[0_24px_80px_rgba(16,185,129,0.28)] mt-8"
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 0 , y:-30}}
        animate={{ opacity: 1, x: -30 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="space-y-6"
      >
        <div className="bg-white/70 border border-slate-200/60 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.08)]">
          <h3 className="text-2xl font-semibold tracking-[-0.02em] mb-8 text-slate-900">
            Order Summary
          </h3>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-4 border-b border-slate-200"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">₹{item.price * item.quantity}</p>
            </div>
          ))}
          <div className="pt-6 space-y-3 text-sm text-slate-600 font-medium">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-slate-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-mono text-slate-900">₹{shipping}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-semibold pt-4 border-t border-slate-200 text-base">
              <span>Total</span>
              <span className="font-mono">₹{total}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
