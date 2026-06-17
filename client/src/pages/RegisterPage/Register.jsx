import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";

export default function Register() {
  const { register, handleSubmit } = useForm();
  const { register: createAccount, error, loading } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const success = await createAccount(data);
    if (success) navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-neutral-900/30 rounded-full blur-[140px] top-[-10%] right-[-10%]" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-light tracking-[0.2em] text-white text-center uppercase mb-2">
          Initialize
        </h2>
        <p className="text-neutral-500 text-xs text-center tracking-widest mb-8">
          ESTABLISH SECURITY PROFILE
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1">
              Identity Name
            </label>
            <input
              {...register("name", { required: true })}
              className="w-full bg-white/[0.03] border border-white/[0.1] rounded px-4 py-2.5 text-sm text-white outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1">
              Secure Email Gateway
            </label>
            <input
              {...register("email", { required: true })}
              className="w-full bg-white/[0.03] border border-white/[0.1] rounded px-4 py-2.5 text-sm text-white outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1">
              Delivery Core Phone
            </label>
            <input
              {...register("phone", { required: true })}
              className="w-full bg-white/[0.03] border border-white/[0.1] rounded px-4 py-2.5 text-sm text-white outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1">
              Encryption Password
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="w-full bg-white/[0.03] border border-white/[0.1] rounded px-4 py-2.5 text-sm text-white outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-white text-black hover:bg-neutral-200 uppercase font-medium text-xs tracking-[0.2em] rounded transition shadow-lg"
          >
            {loading ? "Structuring Signature..." : "Build Matrix Ledger"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-xs text-neutral-400 hover:text-white transition tracking-wide"
          >
            Already initialized? Mount Token
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
