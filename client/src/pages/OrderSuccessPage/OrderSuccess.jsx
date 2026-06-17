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
    <div className="min-h-screen bg-[#030303] text-white pt-24 px-4 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full bg-white/[0.01] border border-white/[0.08] p-8 rounded-2xl backdrop-blur-2xl text-center relative shadow-[0_0_50px_rgba(255,255,255,0.02)]"
      >
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-emerald-400"
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
        <h2 className="text-3xl font-light tracking-[0.15em] uppercase mb-2">
          Transaction Standard Verified
        </h2>
        <p className="text-xs text-neutral-500 tracking-wider mb-8 uppercase">
          Order Registry Index Key: {order._id}
        </p>

        <div className="text-left bg-white/[0.02] border border-white/[0.05] p-6 rounded-xl space-y-4 text-sm mb-8">
          <div className="flex justify-between text-neutral-400">
            <span>Ledger Status</span>
            <span className="text-emerald-400 font-mono tracking-wider uppercase">
              {order.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Settlement Transferred</span>
            <span className="text-white font-mono">${order.total}</span>
          </div>
          <div className="border-t border-white/[0.05] pt-4">
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
              Target Cluster Destination
            </p>
            <p className="text-xs text-neutral-300">
              {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.pincode}
            </p>
          </div>
        </div>

        <Link
          to="/my-orders"
          className="inline-block px-8 py-3.5 bg-white text-black font-medium tracking-widest text-xs uppercase rounded transition duration-300 hover:bg-neutral-200"
        >
          Access Execution History
        </Link>
      </motion.div>
    </div>
  );
}
