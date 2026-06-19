import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

// Import shared layout pieces from Login (same directory)
import { AuthLayout, AuthField, ErrorAlert, SubmitButton } from "./Login";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { register: createAccount, error, loading } = useAuthStore();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async (data) => {
    const ok = await createAccount(data);
    if (ok) navigate("/checkout");
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join the PurePuff wellness community"
      alt={{ label: "Already have an account?", linkText: "Sign in", to: "/login" }}
    >
      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

        {/* Full Name */}
        <AuthField label="Full Name" error={errors.name}>
          <input
            {...register("name", {
              required: "Full name is required",
              minLength: { value: 2, message: "Minimum 2 characters" },
            })}
            placeholder="Jane Doe"
            autoComplete="name"
            className={`input-luxury ${errors.name ? "border-red-300 focus:!border-red-400" : ""}`}
          />
        </AuthField>

        {/* Email */}
        <AuthField
          label="Email Address"
          icon={<Mail size={15} className="text-slate-400" />}
          error={errors.email}
        >
          <input
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
            })}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={`input-luxury pl-10 ${errors.email ? "border-red-300 focus:!border-red-400" : ""}`}
          />
        </AuthField>

        {/* Phone */}
        <AuthField label="Phone Number" error={errors.phone}>
          <input
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "Enter a valid 10-digit Indian mobile number",
              },
            })}
            type="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            maxLength={10}
            className={`input-luxury ${errors.phone ? "border-red-300 focus:!border-red-400" : ""}`}
          />
        </AuthField>

        {/* Password */}
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
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters required" },
            })}
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            className={`input-luxury pl-10 pr-10 ${errors.password ? "border-red-300 focus:!border-red-400" : ""}`}
          />
        </AuthField>

        {/* Terms notice */}
        <p className="text-xs text-slate-400 leading-relaxed">
          By creating an account you agree to our{" "}
          <span className="text-green-600 font-medium cursor-pointer hover:underline">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-green-600 font-medium cursor-pointer hover:underline">
            Privacy Policy
          </span>
          .
        </p>

        <SubmitButton loading={loading} label="Create Account" />
      </form>
    </AuthLayout>
  );
}
