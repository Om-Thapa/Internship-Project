import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

/* ── Shared sub-components ─────────────────────────────────── */
export function AuthLayout({ title, subtitle, alt, children }) {
  return (
    <div className="min-h-screen bg-[#f8fafb] hero-gradient flex items-center justify-center px-4 py-28 relative overflow-hidden">
      <div className="orb orb-green  w-[500px] h-[500px] -top-40 -left-40 opacity-40 absolute pointer-events-none" />
      <div className="orb orb-teal   w-[400px] h-[400px] bottom-0 right-0   opacity-30 absolute pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md glass-card rounded-3xl p-10 shadow-[0_48px_120px_rgba(0,0,0,0.10)]"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="size-14 rounded-2xl overflow-hidden ring-2 ring-green-200/60 shadow-sm">
            <img
              src="/LOGO.jpg.jpeg"
              alt="PurePuff"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-3xl font-black text-center text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-center text-slate-500 mt-1 mb-8">
          {subtitle}
        </p>

        {children}

        <p className="mt-7 text-center text-sm text-slate-500">
          {alt.label}{" "}
          <Link
            to={alt.to}
            className="font-semibold text-green-600 hover:text-green-700 transition-colors underline underline-offset-4"
          >
            {alt.linkText}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export function AuthField({ label, icon, rightAction, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            {icon}
          </span>
        )}
        {children}
        {rightAction && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10">
            {rightAction}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">
          {error.message}
        </p>
      )}
    </div>
  );
}

export function ErrorAlert({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-2xl mb-5 text-center font-medium"
    >
      {message}
    </motion.div>
  );
}

export function InfoAlert({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border border-amber-200 text-amber-700 text-xs p-4 rounded-2xl mb-5 text-center font-medium"
    >
      {message}
    </motion.div>
  );
}

export function SubmitButton({ loading, label }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type="submit"
      disabled={loading}
      className="btn-luxury w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <span className="size-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          Processing…
        </>
      ) : (
        <>
          {label} <ArrowRight size={16} />
        </>
      )}
    </motion.button>
  );
}

/* ── Login page ─────────────────────────────────────────────── */
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login, error, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPw, setShowPw] = useState(false);

  // Message passed via redirect state (e.g. "please verify email", "please sign in")
  const redirectMessage = location.state?.message;
  const redirectTo = location.state?.from?.pathname || "/checkout";

  const onSubmit = async (data) => {
    const ok = await login(data);
    if (ok) navigate(redirectTo);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your PurePuff account"
      alt={{
        label: "Don't have an account?",
        linkText: "Create one",
        to: "/register",
      }}
    >
      {redirectMessage && !error && <InfoAlert message={redirectMessage} />}
      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <AuthField
          label="Email Address"
          icon={<Mail size={15} className="text-slate-400" />}
          error={errors.email}
        >
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email",
              },
            })}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={`input-luxury pl-10 ${errors.email ? "border-red-300 focus:!border-red-400" : ""}`}
          />
        </AuthField>

        <AuthField
          label="Password"
          icon={<Lock size={15} className="text-slate-400" />}
          error={errors.password}
          rightAction={
            <button
              type="button"
              onClick={() => setShowPw((p) => !p)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        >
          <input
            {...register("password", { required: "Password is required" })}
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className={`input-luxury pl-10 pr-10 ${errors.password ? "border-red-300 focus:!border-red-400" : ""}`}
          />
        </AuthField>

        <SubmitButton loading={loading} label="Sign In" />
      </form>
    </AuthLayout>
  );
}
