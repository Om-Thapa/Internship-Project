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
    <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full bg-white/[0.02] border border-white/[0.1] p-8 rounded-xl backdrop-blur-2xl text-center"
      >
        {status === "processing" && (
          <p className="text-neutral-400 tracking-widest animate-pulse">
            VALIDATING SECURE SIGNATURE SEQUENCE...
          </p>
        )}
        {status === "success" && (
          <div>
            <h3 className="text-2xl font-light tracking-widest mb-4 text-emerald-400">
              ACCESS LOOP VALIDATED
            </h3>
            <p className="text-neutral-400 text-sm mb-6">
              Your network signature has successfully authenticated
              configuration access vectors.
            </p>
            <Link
              to="/login"
              className="px-6 py-3 bg-white text-black font-medium tracking-wider text-xs uppercase rounded"
            >
              Deploy Matrix Dashboard
            </Link>
          </div>
        )}
        {status === "failed" && (
          <div>
            <h3 className="text-2xl font-light tracking-widest mb-4 text-red-400">
              SIGNATURE INTEGRITY CORRUPTED
            </h3>
            <p className="text-neutral-400 text-sm mb-6">
              The parameter tokens could not be parsed or are expired.
            </p>
            <Link to="/" className="text-xs text-white underline tracking-wide">
              Return to Mainframe Root
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
