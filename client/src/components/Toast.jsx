/**
 * Lightweight toast notification system.
 * Zero new dependencies — built on Zustand + Framer Motion (already installed).
 *
 * Usage:
 *   import { useToast } from "@/components/Toast";
 *   const { toast } = useToast();
 *   toast.success("Order placed!");
 *   toast.error("Something went wrong.");
 *   toast.info("Free shipping unlocked!");
 */

import { create } from "zustand";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useCallback } from "react";

// ── Store ─────────────────────────────────────────────────────────────────────
let idCounter = 0;

const useToastStore = create((set) => ({
  toasts: [],

  add: (toast) => {
    const id = ++idCounter;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      }, toast.duration ?? 3500);
    }
    return id;
  },

  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useToast() {
  const add = useToastStore((s) => s.add);
  const remove = useToastStore((s) => s.remove);

  const toast = useCallback(
    {
      success: (message, opts) => add({ type: "success", message, ...opts }),
      error: (message, opts) => add({ type: "error", message, ...opts }),
      info: (message, opts) => add({ type: "info", message, ...opts }),
      dismiss: (id) => remove(id),
    },
    [add, remove],
  );

  // Return as object so callers do: const { toast } = useToast()
  return { toast };
}

// ── Icons & styles per type ───────────────────────────────────────────────────
const CONFIG = {
  success: {
    icon: CheckCircle,
    bg: "bg-white border border-green-200",
    iconCls: "text-green-500",
    bar: "bg-green-400",
  },
  error: {
    icon: XCircle,
    bg: "bg-white border border-red-200",
    iconCls: "text-red-500",
    bar: "bg-red-400",
  },
  info: {
    icon: Info,
    bg: "bg-white border border-blue-200",
    iconCls: "text-blue-500",
    bar: "bg-blue-400",
  },
};

// ── Individual toast ──────────────────────────────────────────────────────────
function ToastItem({ toast }) {
  const remove = useToastStore((s) => s.remove);
  const cfg = CONFIG[toast.type] ?? CONFIG.info;
  const Icon = cfg.icon;
  const dur = toast.duration ?? 3500;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={`relative flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)] rounded-2xl px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden ${cfg.bg}`}
    >
      {/* Progress bar */}
      {dur !== Infinity && (
        <motion.div
          className={`absolute bottom-0 left-0 h-0.5 ${cfg.bar}`}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: dur / 1000, ease: "linear" }}
        />
      )}

      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${cfg.iconCls}`} />

      <p className="flex-1 text-sm font-medium text-slate-800 leading-snug">
        {toast.message}
      </p>

      <button
        onClick={() => remove(toast.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors -mr-1"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

// ── Container — mount once in App.jsx, above everything ──────────────────────
export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 items-end"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
