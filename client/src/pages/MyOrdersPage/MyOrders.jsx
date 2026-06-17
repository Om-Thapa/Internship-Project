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
      <div className="min-h-screen bg-[#030303] flex items-center justify-center text-neutral-500 tracking-widest animate-pulse">
        SYNCHRONIZING TRANSACTIONS MODULE...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-28 pb-12 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-light tracking-widest uppercase mb-2">
        Order Matrix
      </h2>
      <p className="text-neutral-500 text-xs tracking-widest uppercase mb-12">
        Historical Allocation Records Archive
      </p>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white/[0.01] border border-white/[0.08] rounded-2xl">
          <p className="text-neutral-500 tracking-wider">
            No active deployment parameters discovered.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/20 transition duration-300"
            >
              <div>
                <p className="text-xs text-neutral-500 font-mono mb-1">
                  ID: {order._id}
                </p>
                <p className="text-sm text-neutral-300 tracking-wide">
                  Processed Vector Date:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <p className="text-sm font-mono font-bold">${order.total}</p>
                  <p className="text-[10px] uppercase tracking-widest text-emerald-400">
                    {order.orderStatus}
                  </p>
                </div>
                <Link
                  to={`/orders/${order._id}`}
                  className="px-4 py-2 border border-white/20 hover:border-white text-xs uppercase tracking-wider rounded transition"
                >
                  Inspect System Node
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
