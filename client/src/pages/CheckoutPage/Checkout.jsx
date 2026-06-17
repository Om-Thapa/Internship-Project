import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { API, useAuthStore } from "@/stores/authStore";
import { trackEvent } from "@/utils/analytics";

export default function Checkout() {
  const { register, handleSubmit } = useForm();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Directly references your custom checkout logic and links to existing state variables
  const cartItems = [
    {
      id: 1,
      slug: "purepuff-original",
      name: "PurePuff Original",
      price: 99,
      image: "/products/Placeholder.png",
      quantity: 1,
    },
  ];

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
          description: "Premium Hardware Sequence Purchase",
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
    <div className="min-h-screen bg-[#030303] text-white pt-24 pb-12 px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/[0.01] border border-white/[0.08] p-8 rounded-2xl backdrop-blur-xl"
      >
        <h3 className="text-xl font-light tracking-widest uppercase mb-6 text-neutral-200">
          System Processing Form
        </h3>
        <form onSubmit={handleSubmit(onCheckoutSubmit)} className="space-y-4">
          <input
            {...register("fullName", { required: true })}
            placeholder="Full Name Mapping"
            className="w-full bg-white/[0.02] border border-white/[0.1] rounded p-3 text-sm text-white"
          />
          <input
            {...register("phone", { required: true })}
            placeholder="Secure Phone Coordinates (Delivery Context Only)"
            className="w-full bg-white/[0.02] border border-white/[0.1] rounded p-3 text-sm text-white"
          />
          <input
            {...register("address", { required: true })}
            placeholder="Line Address Framework"
            className="w-full bg-white/[0.02] border border-white/[0.1] rounded p-3 text-sm text-white"
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              {...register("city", { required: true })}
              placeholder="City Node"
              className="bg-white/[0.02] border border-white/[0.1] rounded p-3 text-sm text-white"
            />
            <input
              {...register("state", { required: true })}
              placeholder="State Index"
              className="bg-white/[0.02] border border-white/[0.1] rounded p-3 text-sm text-white"
            />
            <input
              {...register("pincode", { required: true })}
              placeholder="Pincode Zone"
              className="bg-white/[0.02] border border-white/[0.1] rounded p-3 text-sm text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 transition mt-6"
          >
            {loading
              ? "Compiling Orders Vector..."
              : "Execute Secure Gateway Pipeline"}
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="bg-white/[0.01] border border-white/[0.08] p-8 rounded-2xl backdrop-blur-xl">
          <h3 className="text-xl font-light tracking-widest uppercase mb-6 text-neutral-200">
            Terminal Checkout Manifest
          </h3>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-4 border-b border-white/[0.05]"
            >
              <div>
                <p className="text-sm font-medium tracking-wide">{item.name}</p>
                <p className="text-xs text-neutral-500">
                  Allocation Array: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-mono">${item.price * item.quantity}</p>
            </div>
          ))}
          <div className="pt-6 space-y-2 text-sm text-neutral-400 font-light">
            <div className="flex justify-between">
              <span>Core Operations Subtotal</span>
              <span className="font-mono">${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Logistics Routing Variable</span>
              <span className="font-mono">${shipping}</span>
            </div>
            <div className="flex justify-between text-white font-normal pt-4 border-t border-white/[0.1] text-base">
              <span>Grand Consolidated Balance</span>
              <span className="font-mono text-white">${total}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
