import { useAuthStore } from "@/stores/authStore";
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function AuthLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="size-12 rounded-full border-2 border-green-200 border-t-green-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium animate-pulse">
          Checking session…
        </p>
      </motion.div>
    </div>
  );
}

/**
 * ProtectedRoute — guards routes behind authentication.
 *
 * @param {boolean} requireVerified - if true, also requires the user's
 *   email to be verified (e.g. for checkout). Redirects to /login with
 *   a message if the user is logged in but unverified.
 */
export function ProtectedRoute({ children, requireVerified = false }) {
  const { token, user } = useAuthStore();
  const location = useLocation();

  // Give the auth store one render cycle to hydrate from localStorage
  // before deciding to redirect — prevents false logout flash on hard refresh
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // After mount, the Zustand persist middleware has already rehydrated.
    // A single microtask tick is enough before we gate on `token`.
    const id = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!ready) return <AuthLoader />;

  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: "Please sign in to continue." }}
        replace
      />
    );
  }

  if (requireVerified && user && !user.isEmailVerified) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message:
            "Please verify your email before checking out. Check your inbox for the verification link.",
        }}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
