import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import { API } from "@/stores/authStore";

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-4 pt-28">
      <div className="size-10 rounded-full border-2 border-green-200 border-t-green-500 animate-spin" />
      <p className="text-slate-500 text-sm font-medium animate-pulse">Confirming your order…</p>
    </div>
  );
}

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    API.get(`/orders/${orderId}`)
      .then((r) => setOrder(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <PageLoader />;

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-28 px-4 text-center">
        <p className="text-xl font-bold text-slate-700">Order not found.</p>
        <Link to="/my-orders" className="mt-4 text-green-600 font-semibold hover:underline">
          View my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafb] hero-gradient flex items-center justify-center px-4 py-28 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb orb-green w-[500px] h-[500px] top-0 left-1/2 -translate-x-1/2 opacity-25 absolute pointer-events-none" />
      <div className="orb orb-teal  w-[300px] h-[300px] bottom-0 right-0           opacity-20 absolute pointer-events-none" />

      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 glass-card rounded-3xl p-10 max-w-md w-full text-center shadow-[0_48px_120px_rgba(0,0,0,0.10)]"
      >
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0   }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-[0_8px_32px_rgba(52,201,116,0.40)] glow-green"
        >
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-4xl font-black text-slate-900">Order Placed!</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Thank you for your purchase. We'll send shipping updates to your email.
          </p>

          {/* Order summary card */}
          <div className="mt-7 glass rounded-2xl p-5 text-left space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Order ID</span>
              <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
                #{order._id.slice(-10).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Payment</span>
              <span className={order.paymentStatus === "paid" ? "badge-success" : "badge-pending"}>
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Status</span>
              <span className="badge-pending">{order.orderStatus}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Items</span>
              <span className="text-slate-700 font-semibold">{order.items.length}</span>
            </div>
            <div className="divider" />
            <div className="flex justify-between items-center font-black">
              <span className="text-slate-700">Total Paid</span>
              <span className="text-slate-900 text-lg">₹{order.total}</span>
            </div>
          </div>

          {/* Shipping preview */}
          <div className="mt-4 glass rounded-2xl px-4 py-3 text-left">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Shipping To</p>
            <p className="text-sm text-slate-700 font-medium">
              {order.shippingAddress.fullName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <Link
              to="/my-orders"
              className="flex-1 btn-luxury py-3.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2"
            >
              <Package size={16} /> My Orders
            </Link>
            <Link
              to="/products"
              className="flex-1 py-3.5 rounded-xl border border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-700 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200"
            >
              Shop More <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
