import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { API } from "@/stores/authStore";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("failed");
      return;
    }
    API.get(`/auth/verify?token=${token}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("failed"));
  }, [token]);

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 py-28 relative overflow-hidden">
      <div className="orb orb-green w-[400px] h-[400px] -top-20 left-1/2 -translate-x-1/2 opacity-40 absolute pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md glass-card rounded-3xl p-10 text-center"
      >
        {status === "processing" && (
          <>
            <div className="size-16 rounded-full border-2 border-green-200 border-t-green-500 animate-spin mx-auto mb-5" />
            <p className="text-slate-600 font-medium animate-pulse">
              Verifying your email…
            </p>
          </>
        )}

        {status === "success" && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(52,201,116,0.30)]">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900">
              Email Verified!
            </h3>
            <p className="text-slate-500 text-sm mt-3 mb-8 leading-relaxed">
              Your email has been successfully verified. You can now sign in.
            </p>
            <Link
              to="/login"
              className="btn-luxury inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-sm"
            >
              Sign In Now
            </Link>
          </motion.div>
        )}

        {status === "failed" && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900">
              Verification Failed
            </h3>
            <p className="text-slate-500 text-sm mt-3 mb-8 leading-relaxed">
              The link is invalid or has expired. Please register again.
            </p>
            <Link
              to="/"
              className="text-green-600 font-semibold hover:text-green-700 transition-colors underline underline-offset-4"
            >
              Return Home
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
