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
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[160px] top-[-15%] left-[-15%]" />
      <div className="absolute w-[500px] h-[500px] bg-slate-100/30 rounded-full blur-[140px] bottom-[-10%] right-[-10%]" />

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: -40 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-md bg-white/70 border border-slate-200/60 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.08)] relative z-10"
      >
        <h2 className="text-4xl font-semibold tracking-[-0.02em] text-slate-900 text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-slate-500 text-xs text-center tracking-widest uppercase mb-8 font-medium">
          Sign in to your account
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-2xl mb-6 text-center tracking-wide">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-slate-700 font-semibold mb-3">
              Email Address
            </label>
            <input
              {...register("email", { required: true })}
              placeholder="you@example.com"
              className="w-full bg-white/50 border border-slate-200 focus:border-emerald-300 focus:bg-white rounded-2xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-slate-700 font-semibold mb-3">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="••••••••"
              className="w-full bg-white/50 border border-slate-200 focus:border-emerald-300 focus:bg-white rounded-2xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-400 text-white hover:bg-emerald-500 uppercase font-semibold text-xs tracking-[0.2em] rounded-2xl transition duration-500 shadow-[0_18px_60px_rgba(16,185,129,0.22)] hover:shadow-[0_24px_80px_rgba(16,185,129,0.28)]"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
        <div className="mt-8 text-center">
          <Link
            to="/register"
            className="text-sm text-slate-600 hover:text-emerald-600 transition tracking-wide font-medium"
          >
            Don't have an account? Create one
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
