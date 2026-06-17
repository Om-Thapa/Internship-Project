import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { API } from "@/stores/authStore";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      API.get(`/auth/verify?token=${token}`)
        .then(() => setStatus("success"))
        .catch(() => setStatus("failed"));
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 flex items-center justify-center text-slate-900 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full bg-white/70 border border-slate-200/60 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.08)] text-center"
      >
        {status === "processing" && (
          <p className="text-slate-700 tracking-widest animate-pulse font-medium">
            Verifying your email...
          </p>
        )}
        {status === "success" && (
          <div>
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-semibold tracking-[-0.02em] mb-4 text-slate-900">
              Email Verified
            </h3>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-emerald-400 text-white font-semibold uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-emerald-500 transition shadow-[0_18px_60px_rgba(16,185,129,0.22)]"
            >
              Sign In Now
            </Link>
          </div>
        )}
        {status === "failed" && (
          <div>
            <div className="w-16 h-16 bg-red-100 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-semibold tracking-[-0.02em] mb-4 text-slate-900">
              Verification Failed
            </h3>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
              The verification link is invalid or has expired. Please try again.
            </p>
            <Link to="/" className="text-emerald-600 font-semibold hover:text-emerald-700 transition">
              Return Home
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
