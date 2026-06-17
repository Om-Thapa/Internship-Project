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
    <div className="min-h-screen bg-[#030303] text-white pt-28 pb-12 px-4 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.01] border border-white/[0.08] p-8 rounded-2xl backdrop-blur-xl">
        <h3 className="text-xl font-light tracking-widest uppercase mb-2">System Diagnostics Matrix</h3>
        <p className="text-xs text-neutral-500 font-mono mb-8">NODE REFS: {order._id}</p>

        <div className="space-y-4 mb-8">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-4 border-b border-white/[0.05]">
              <div>
                <p className="text-sm font-medium tracking-wide">{item.productId?.name || 'PurePuff Blueprint Component'}</p>
                <p className="text-xs text-neutral-500 font-mono">Volume Factor: {item.quantity} @ ${item.price}</p>
              </div>
              <p className="text-sm font-mono">${item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/[0.1] text-sm">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-neutral-400 mb-3">Logistics Framework Location</h4>
            <p className="text-neutral-300 font-light text-xs leading-relaxed">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.address}, {order.shippingAddress.city}<br />
              {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
          </div>
          <div className="space-y-2 text-xs text-neutral-400">
            <h4 className="text-xs uppercase tracking-widest text-white mb-2">Operational State Ledger</h4>
            <div className="flex justify-between"><span>Pipeline Status</span><span className="uppercase text-white tracking-widest">{order.orderStatus}</span></div>
            <div className="flex justify-between"><span>Payment Registry</span><span className="uppercase text-emerald-400 font-mono">{order.paymentStatus}</span></div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/[0.05]"><span>Aggregated Financial Value</span><span className="font-mono">${order.total}</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}