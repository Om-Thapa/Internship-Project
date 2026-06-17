import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API } from '@/stores/authStore';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.get(`/orders/${id}`).then(res => setOrder(res.data)).catch(console.error);
  }, [id]);

  if (!order) return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-neutral-500 tracking-widest animate-pulse">PARSING CONFIGURATION SYSTEM FILE...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 pt-32 pb-12 px-4 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/70 border border-slate-200/60 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.08)]">
        <div className="mb-10 pb-8 border-b border-slate-200">
          <h3 className="text-3xl font-semibold tracking-[-0.02em] mb-2 text-slate-900">Order Details</h3>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-[0.2em]">Order ID: {order._id}</p>
        </div>

        <div className="space-y-5 mb-10">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-5 border-b border-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.productId?.name || "Product"}</p>
                <p className="text-xs text-slate-500 font-mono">Qty: {item.quantity} × ₹{item.price}</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-slate-200">
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-slate-600 font-semibold mb-4">Shipping Address</h4>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state}<br />
              {order.shippingAddress.pincode}
            </p>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-slate-600 font-semibold mb-4">Order Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Status</span>
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full">
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Payment</span>
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full">
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <span className="text-slate-900 font-semibold">Total</span>
                  <span className="font-mono text-lg font-semibold text-slate-900">₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Link
          to="/my-orders"
          className="inline-block mt-10 px-8 py-3 bg-emerald-400 text-white font-semibold uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-emerald-500 transition shadow-[0_18px_60px_rgba(16,185,129,0.22)]"
        >
          Back to Orders
        </Link>
      </motion.div>
    </div>
  );
}