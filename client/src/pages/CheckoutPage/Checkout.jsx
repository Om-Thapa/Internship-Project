import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Lock,
  ShoppingBag,
  CheckCircle,
  Tag,
  Wallet,
  Banknote,
} from "lucide-react";
import { API, useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/useCartStore";
import { useCartTotal } from "@/stores/cartSelectors";
import { trackEvent } from "@/utils/analytics";
import { useToast } from "@/components/Toast";

const FREE_SHIPPING_AT = 500;
const DISCOUNT_AT = 299;
const DISCOUNT_AMOUNT = 50;

/* ── Field wrapper ───────────────────────────────────────────────────────── */
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">
          {error.message || "This field is required"}
        </p>
      )}
    </div>
  );
}

/* ── Payment method radio card ──────────────────────────────────────────── */
function PaymentOption({
  value,
  selected,
  onSelect,
  icon: Icon,
  title,
  subtitle,
  disabled,
  disabledReason,
}) {
  const isActive = selected === value;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(value)}
      className={`relative w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 ${
        disabled
          ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
          : isActive
            ? "border-green-400 bg-green-50/60 shadow-[0_4px_20px_rgba(52,201,116,0.15)]"
            : "border-slate-200 bg-white/60 hover:border-green-200 hover:bg-green-50/30"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`size-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isActive ? "bg-green-500 text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-900 text-sm">{title}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {disabled ? disabledReason : subtitle}
          </p>
        </div>
        {/* Radio indicator */}
        <div
          className={`size-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${
            isActive ? "border-green-500" : "border-slate-300"
          }`}
        >
          {isActive && <div className="size-2.5 rounded-full bg-green-500" />}
        </div>
      </div>
    </button>
  );
}

/* ── Razorpay loader ─────────────────────────────────────────────────────── */
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function Checkout() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { user } = useAuthStore();
  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartTotal();
  const navigate = useNavigate();
  const { toast } = useToast();

  const razorpayConfigured = Boolean(
    import.meta.env.VITE_RAZORPAY_KEY_ID &&
    import.meta.env.VITE_RAZORPAY_KEY_ID.trim() !== "",
  );

  // Default to online if available, otherwise COD
  const [paymentMethod, setPaymentMethod] = useState(
    razorpayConfigured ? "online" : "cod",
  );
  const [loading, setLoading] = useState(false);

  const shipping = subtotal >= FREE_SHIPPING_AT ? 0 : 50;
  const discount = subtotal >= DISCOUNT_AT ? DISCOUNT_AMOUNT : 0;
  const codFee = paymentMethod === "cod" ? 20 : 0;
  const total = subtotal + shipping - discount + codFee;

  /* ── Empty cart guard ────────────────────────────────────────────────── */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafb] flex items-center justify-center pt-28 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">
            <ShoppingBag size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Cart is empty</h1>
          <p className="mt-3 text-slate-500">
            Add products before checking out.
          </p>
          <Link
            to="/products"
            className="btn-luxury mt-7 inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-white text-sm"
          >
            Shop Products <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ── Razorpay payment flow ────────────────────────────────────────────── */
  const initPayment = async (order) => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error(
        "Payment gateway unavailable. Please try again or choose Cash on Delivery.",
      );
      setLoading(false);
      return;
    }

    try {
      const { data: razorOrder } = await API.post("/payment/create-order", {
        orderId: order._id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorOrder.amount,
        currency: razorOrder.currency,
        name: "PurePuff",
        description: "Respiratory Wellness Products",
        image: "/LOGO.jpg.jpeg",
        order_id: razorOrder.id,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: order.shippingAddress?.phone || "",
        },
        theme: { color: "#16a34a" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info(
              "Payment cancelled. Your order is saved — retry anytime from My Orders.",
            );
          },
        },
        handler: async (response) => {
          try {
            const { data } = await API.post("/payment/verify", response);
            if (data.status === "success") {
              trackEvent("purchase", {
                transaction_id: order._id,
                value: total,
                currency: "INR",
              });
              clearCart();
              toast.success("Payment successful!");
              setTimeout(() => navigate(`/order-success/${order._id}`), 600);
            }
          } catch {
            toast.error(
              "Payment verification failed. Contact support with your order ID.",
            );
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        toast.error(`Payment failed: ${resp.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not initialise payment.",
      );
      setLoading(false);
    }
  };

  /* ── Form submit ──────────────────────────────────────────────────────── */
  const onSubmit = async (formData) => {
    setLoading(true);
    trackEvent("begin_checkout", {
      value: total,
      currency: "INR",
      payment_method: paymentMethod,
    });

    try {
      const payload = {
        items: cartItems,
        paymentMethod,
        shippingAddress: {
          fullName: formData.fullName,
          email: user?.email || "",
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      };

      const { data: order } = await API.post("/orders", payload);

      if (paymentMethod === "online") {
        // setLoading(false) happens inside initPayment's handlers
        await initPayment(order);
      } else {
        // COD — order is already confirmed & stock deducted server-side.
        // Nothing further to do; navigate straight to success.
        clearCart();
        toast.success("Order placed! Pay cash when it arrives.");
        navigate(`/order-success/${order._id}`);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Order failed. Please try again.",
      );
      setLoading(false);
    }
  };

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#f8fafb] pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-5xl font-black text-slate-900">
            Check<span className="gradient-text">out</span>
          </h1>
          <p className="mt-2 text-slate-500 text-sm flex items-center gap-1.5">
            <Lock size={13} className="text-green-600" />
            Secure, encrypted checkout
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          {/* ── Left column: form + payment method ── */}
          <div className="space-y-6">
            {/* Shipping form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card rounded-3xl p-8"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-7 flex items-center gap-2">
                <span className="size-7 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                Shipping Information
              </h2>

              <form
                id="checkout-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                <Field label="Full Name" error={errors.fullName}>
                  <input
                    {...register("fullName", {
                      required: "Full name is required",
                    })}
                    autoComplete="name"
                    placeholder="Jane Doe"
                    className={`input-luxury ${errors.fullName ? "border-red-300" : ""}`}
                  />
                </Field>

                <Field label="Phone Number" error={errors.phone}>
                  <input
                    {...register("phone", {
                      required: "Phone is required",
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Valid 10-digit number",
                      },
                    })}
                    autoComplete="tel"
                    placeholder="98765 43210"
                    maxLength={10}
                    className={`input-luxury ${errors.phone ? "border-red-300" : ""}`}
                  />
                </Field>

                <Field label="Street Address" error={errors.address}>
                  <input
                    {...register("address", {
                      required: "Address is required",
                    })}
                    autoComplete="street-address"
                    placeholder="123 Green Avenue, Apt 4B"
                    className={`input-luxury ${errors.address ? "border-red-300" : ""}`}
                  />
                </Field>

                <div className="grid grid-cols-3 gap-3">
                  <Field label="City" error={errors.city}>
                    <input
                      {...register("city", { required: true })}
                      autoComplete="address-level2"
                      placeholder="Bengaluru"
                      className={`input-luxury ${errors.city ? "border-red-300" : ""}`}
                    />
                  </Field>
                  <Field label="State" error={errors.state}>
                    <input
                      {...register("state", { required: true })}
                      autoComplete="address-level1"
                      placeholder="Karnataka"
                      className={`input-luxury ${errors.state ? "border-red-300" : ""}`}
                    />
                  </Field>
                  <Field label="Pincode" error={errors.pincode}>
                    <input
                      {...register("pincode", {
                        required: true,
                        pattern: { value: /^\d{6}$/, message: "6 digits" },
                      })}
                      autoComplete="postal-code"
                      placeholder="560001"
                      maxLength={6}
                      className={`input-luxury ${errors.pincode ? "border-red-300" : ""}`}
                    />
                  </Field>
                </div>
              </form>
            </motion.div>

            {/* Payment method selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass-card rounded-3xl p-8"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="size-7 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                Payment Method
              </h2>

              <div className="space-y-3">
                <PaymentOption
                  value="online"
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                  icon={Wallet}
                  title="Pay Online"
                  subtitle="UPI, Cards, Netbanking & Wallets via Razorpay — instant confirmation"
                  disabled={!razorpayConfigured}
                  disabledReason="Online payment is temporarily unavailable. Please choose Cash on Delivery."
                />
                <PaymentOption
                  value="cod"
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                  icon={Banknote}
                  title="Cash on Delivery"
                  subtitle={`Pay ₹${total} in cash when your order arrives · ₹20 COD handling fee applies`}
                />
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-4 pt-6 mt-2 border-t border-slate-100 text-xs text-slate-500">
                {["SSL Secured", "No hidden charges", "Easy returns"].map(
                  (t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle size={12} className="text-green-500" /> {t}
                    </span>
                  ),
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="btn-luxury w-full py-5 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="size-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Processing…
                  </>
                ) : paymentMethod === "online" ? (
                  <>
                    <Lock size={16} /> Pay ₹{total} Now
                  </>
                ) : (
                  <>
                    <Banknote size={16} /> Place Order — Pay ₹{total} on
                    Delivery
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* ── Order summary ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <div className="glass-card rounded-3xl p-7 z-10 lg:sticky lg:top-28">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-1.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Qty {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <span className="text-sm font-black text-slate-900 flex-shrink-0">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="divider my-5" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">
                    ₹{subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span
                    className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-slate-800"}`}
                  >
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag size={12} /> Discount
                    </span>
                    <span className="font-semibold">−₹{discount}</span>
                  </div>
                )}
                {codFee > 0 && (
                  <div className="flex justify-between text-amber-600">
                    <span>COD Handling Fee</span>
                    <span className="font-semibold">+₹{codFee}</span>
                  </div>
                )}
              </div>

              <div className="divider my-4" />

              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{total}
                </span>
              </div>

              <p className="mt-4 text-xs text-center text-slate-400">
                {paymentMethod === "online"
                  ? "You'll be redirected to Razorpay's secure checkout"
                  : "Keep exact change ready for the delivery agent"}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-3 text-xs text-slate-600">
              {[
                ["🔒", "256-bit SSL encryption"],
                ["📦", "Delivery: 3–5 business days"],
                ["↩️", "Easy 7-day returns"],
              ].map(([e, t]) => (
                <div key={t} className="flex items-center gap-2.5">
                  <span>{e}</span>
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
