import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login, error, loading } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const status = await login(data);
    if (status) navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-neutral-900/30 rounded-full blur-[140px] top-[-10%] left-[-10%]" />
      <div className="absolute w-[400px] h-[400px] bg-neutral-900/20 rounded-full blur-[120px] bottom-[-10%] right-[-10%]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative z-10"
      >
        <h2 className="text-3xl font-light tracking-[0.2em] text-white text-center uppercase mb-2">
          Sign In
        </h2>
        <p className="text-neutral-500 text-xs text-center tracking-widest mb-8">
          PUREPUFF INTERFACE HUB
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded mb-4 text-center tracking-wide">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-2">
              Secure Email Address
            </label>
            <input
              {...register("email", { required: true })}
              className="w-full bg-white/[0.03] border border-white/[0.1] focus:border-white/30 rounded px-4 py-3 text-sm text-white outline-none transition duration-300"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-2">
              Cryptographic Core Pass
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="w-full bg-white/[0.03] border border-white/[0.1] focus:border-white/30 rounded px-4 py-3 text-sm text-white outline-none transition duration-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black hover:bg-neutral-200 uppercase font-medium text-xs tracking-[0.2em] rounded transition duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            {loading ? "Processing Cryptography..." : "Authorize Key"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            to="/register"
            className="text-xs text-neutral-400 hover:text-white transition tracking-wide"
          >
            Generate New Access Matrix?
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
