import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { API } from "@/stores/authStore";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders")
      .then((res) => {
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 flex items-center justify-center tracking-widest animate-pulse">
        SYNCHRONIZING TRANSACTIONS MODULE...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 pt-32 pb-12 px-4 max-w-5xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-semibold tracking-[-0.02em] mb-3">
          Your Orders
        </h2>
        <p className="text-slate-600 text-sm uppercase tracking-[0.2em] font-medium">
          Track and manage your purchases
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white/50 border border-slate-200/60 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.04)]">
          <p className="text-slate-500 text-lg font-medium">
            No orders yet. Start shopping!
          </p>
          <Link to="/products" className="text-emerald-600 hover:text-emerald-700 transition font-semibold mt-4 inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/50 border border-slate-200/60 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 transition duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
            >
              <div>
                <p className="text-xs text-slate-500 font-mono mb-2">
                  Order ID: {order._id.slice(0, 8)}...
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">₹{order.total}</p>
                  <p className="text-xs uppercase tracking-wider text-emerald-600 font-medium">
                    {order.orderStatus}
                  </p>
                </div>
                <Link
                  to={`/orders/${order._id}`}
                  className="px-6 py-2.5 border border-slate-300 hover:border-emerald-300 text-slate-900 hover:text-emerald-600 text-xs uppercase tracking-[0.2em] font-semibold rounded-lg transition duration-300"
                >
                  Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
