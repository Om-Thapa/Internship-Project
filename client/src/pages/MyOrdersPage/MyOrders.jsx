import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ArrowRight, ChevronRight, ShoppingBag } from "lucide-react";
import { API } from "@/stores/authStore";

function StatusBadge({ status }) {
  const styles = {
    processing: "badge-pending",
    shipped:    "badge-success",
    delivered:  "badge-success",
    cancelled:  "bg-red-100 text-red-600 border border-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
  };
  return (
    <span className={styles[status] || "badge-pending"}>
      {status}
    </span>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-4 pt-28">
      <div className="size-10 rounded-full border-2 border-green-200 border-t-green-500 animate-spin" />
      <p className="text-slate-500 text-sm font-medium animate-pulse">Loading your orders…</p>
    </div>
  );
}

export default function MyOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    API.get("/orders")
      .then((r) => setOrders(r.data.orders || []))
      .catch(() => setError("Unable to load orders. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#f8fafb] pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <h1 className="text-5xl font-black text-slate-900">
            My <span className="gradient-text">Orders</span>
          </h1>
          <p className="mt-2 text-slate-500 text-sm uppercase tracking-wider font-medium">
            Track and manage your purchases
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="glass-card rounded-2xl p-5 mb-6 border border-red-200 bg-red-50/50">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!error && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-16 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <Package size={40} className="text-green-400" />
            </div>
            <p className="text-xl font-bold text-slate-700">No orders yet</p>
            <p className="text-slate-500 mt-2 text-sm">Start shopping to see your orders here.</p>
            <Link
              to="/products"
              className="btn-luxury mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white text-sm"
            >
              Browse Products <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}

        {/* Orders list */}
        {orders.length > 0 && (
          <AnimatePresence>
            <div className="space-y-3">
              {orders.map((order, i) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card rounded-2xl px-6 py-5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] transition-shadow duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                      <p className="text-xs font-mono text-slate-400 mb-1">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="font-bold text-slate-900 text-base">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <StatusBadge status={order.orderStatus} />
                        <span className="text-xs text-slate-400">
                          {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-0.5">Total</p>
                        <p className="text-xl font-black text-slate-900">₹{order.total}</p>
                      </div>
                      <Link
                        to={`/orders/${order._id}`}
                        className="flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 border border-green-200 hover:border-green-400 px-4 py-2 rounded-xl transition-all duration-200"
                      >
                        Details <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
