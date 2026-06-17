import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { API } from "@/stores/authStore";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(console.error);
  }, [orderId]);

  if (!order)
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center text-neutral-500 tracking-widest animate-pulse">
        ACQUIRING TRANSACTION SIGNATURE METRICS...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 pt-32 px-4 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full bg-white/70 border border-slate-200/60 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.08)] text-center"
      >
        <div className="w-20 h-20 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-4xl font-semibold tracking-[-0.02em] mb-4">
          Order Confirmed
        </h2>
        <p className="text-sm text-slate-600 tracking-wider mb-10 uppercase font-medium">
          Order ID: {order._id}
        </p>

        <div className="text-left bg-slate-50/50 border border-slate-200 p-8 rounded-2xl space-y-5 text-sm mb-10">
          <div className="flex justify-between items-center text-slate-700">
            <span className="font-medium">Payment Status</span>
            <span className="text-emerald-600 font-semibold uppercase tracking-wide text-xs">
              {order.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-700 pb-5 border-b border-slate-200">
            <span className="font-medium">Total Amount</span>
            <span className="font-mono font-semibold text-slate-900">₹{order.total}</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-slate-600 font-semibold mb-3">
              Shipping Address
            </p>
            <p className="text-slate-700 text-sm leading-relaxed">
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.pincode}<br />
              {order.shippingAddress.state}
            </p>
          </div>
        </div>

        <Link
          to="/my-orders"
          className="inline-block px-8 py-3.5 bg-emerald-400 text-white font-semibold uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-emerald-500 transition duration-300 shadow-[0_18px_60px_rgba(16,185,129,0.22)]"
        >
          View Orders
        </Link>
      </motion.div>
    </div>
  );
}
