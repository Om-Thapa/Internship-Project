import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { API } from "@/stores/authStore";

function StatusBadge({ status, type = "order" }) {
  const isPaid = status === "paid";
  const isDelivered = status === "delivered" || status === "shipped";
  const isBad = status === "cancelled" || status === "failed";

  if (isBad) {
    return (
      <span className="bg-red-100 text-red-600 border border-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        {status}
      </span>
    );
  }
  if (isPaid || isDelivered) {
    return <span className="badge-success">{status}</span>;
  }
  return <span className="badge-pending">{status}</span>;
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-4 pt-28">
      <div className="size-10 rounded-full border-2 border-green-200 border-t-green-500 animate-spin" />
      <p className="text-slate-500 text-sm font-medium animate-pulse">
        Loading order details…
      </p>
    </div>
  );
}

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    API.get(`/orders/${id}`)
      .then((r) => setOrder(r.data))
      .catch(() => setError("Order not found or you don't have access."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center pt-28 px-4 text-center">
        <p className="text-xl font-bold text-slate-700">
          {error || "Order not found."}
        </p>
        <Link
          to="/my-orders"
          className="mt-5 btn-luxury px-6 py-3 rounded-xl text-white text-sm inline-flex items-center gap-2"
        >
          <ArrowLeft size={15} /> My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafb] pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* Back link */}
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-700 font-medium transition-colors mb-8"
        >
          <ArrowLeft size={15} /> Back to Orders
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-3xl p-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Order Details
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                #{order._id.slice(-12).toUpperCase()}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <StatusBadge status={order.paymentStatus} />
              <StatusBadge status={order.orderStatus} />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-1 mb-8">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0"
              >
                {/* Product image */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 flex-shrink-0 overflow-hidden">
                  {item.productId?.image && (
                    <img
                      src={item.productId.image}
                      alt={item.productId?.name}
                      className="w-full h-full object-contain p-1.5"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm leading-snug">
                    {item.productId?.name || "Product"}
                  </p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>

                <span className="font-black text-slate-900 flex-shrink-0">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Details grid */}
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Shipping address */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-4">
                Shipping Address
              </h3>
              <div className="text-sm text-slate-700 leading-7">
                <p className="font-bold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.pincode}
                </p>
                <p className="text-slate-500 mt-1">
                  {order.shippingAddress.phone}
                </p>
                <p className="text-slate-500">{order.shippingAddress.email}</p>
              </div>
            </div>

            {/* Payment summary */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-4">
                Payment Summary
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span
                    className={`font-semibold ${order.shipping === 0 ? "text-green-600" : ""}`}
                  >
                    {order.shipping === 0 ? "FREE" : `₹${order.shipping}`}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">−₹{order.discount}</span>
                  </div>
                )}
                <div className="divider" />
                <div className="flex justify-between font-black text-slate-900 text-base pt-1">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer action */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-3">
            <Link
              to="/my-orders"
              className="btn-luxury px-6 py-3 rounded-xl text-white text-sm font-bold inline-flex items-center gap-2"
            >
              <ArrowLeft size={15} /> All Orders
            </Link>
            <Link
              to="/products"
              className="px-6 py-3 rounded-xl border border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-700 text-sm font-semibold transition-all duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
