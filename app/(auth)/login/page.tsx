"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Phone, Lock, KeyRound, Eye, EyeOff } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "", otp: "" });
  const [loginType, setLoginType] = useState<"password" | "otp">("password");
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    if (!form.identifier.trim()) newErrors.identifier = "Email or Phone is required";
    else if (!emailRegex.test(form.identifier) && !phoneRegex.test(form.identifier))
      newErrors.identifier = "Enter a valid email or 10-digit phone number";
    if (loginType === "password") {
      if (!form.password.trim()) newErrors.password = "Password is required";
      else if (form.password.length < 6) newErrors.password = "Minimum 6 characters";
    }
    if (loginType === "otp" && otpStep) {
      if (!form.otp.trim()) newErrors.otp = "OTP is required";
      else if (form.otp.length !== 4) newErrors.otp = "OTP must be 4 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      if (loginType === "password") {
        const res = await fetch(`${BASE_URL}login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.identifier, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Invalid credentials");
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        if (!otpStep) {
          const res = await fetch(`${BASE_URL}send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: form.identifier }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Cannot send OTP");
          toast.success("OTP sent! Check your email/phone.");
          setOtpStep(true);
        } else {
          const res = await fetch(`${BASE_URL}verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: form.identifier, otp: form.otp }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Invalid OTP");
          localStorage.setItem("token", data.token);
          toast.success("Login successful!");
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-brand">
          <p className="auth-brand-name">POSYA</p>
          <p className="auth-brand-tag">Petal-born wellness</p>
        </div>

        <h1 className="auth-form-heading">Welcome Back</h1>
        <p className="auth-form-sub">
          {loginType === "otp" && otpStep
            ? "Enter the OTP sent to your email / phone"
            : "Sign in to your account"}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">

          {/* Identifier */}
          <div className="auth-field">
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                {form.identifier.includes("@") ? <Mail size={16} /> : <Phone size={16} />}
              </span>
              <input
                type="text"
                placeholder="Email or Phone number"
                value={form.identifier}
                onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                className={`auth-input ${errors.identifier ? "auth-input--error" : ""}`}
                autoComplete="username"
              />
            </div>
            {errors.identifier && <p className="auth-error">{errors.identifier}</p>}
          </div>

          {/* Password */}
          {loginType === "password" && (
            <div className="auth-field">
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Lock size={16} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`auth-input ${errors.password ? "auth-input--error" : ""}`}
                  autoComplete="current-password"
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="auth-error">{errors.password}</p>}
            </div>
          )}

          {/* OTP */}
          {loginType === "otp" && otpStep && (
            <div className="auth-field">
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><KeyRound size={16} /></span>
                <input
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  maxLength={4}
                  value={form.otp}
                  onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "") })}
                  className={`auth-input ${errors.otp ? "auth-input--error" : ""}`}
                  autoComplete="one-time-code"
                />
              </div>
              {errors.otp && <p className="auth-error">{errors.otp}</p>}
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Processing...
              </span>
            ) : loginType === "password" ? "Sign In" : otpStep ? "Verify OTP" : "Send OTP"}
          </button>
        </form>

        {/* Toggle */}
        <button
          className="auth-toggle-btn"
          onClick={() => { setLoginType(loginType === "password" ? "otp" : "password"); setOtpStep(false); setErrors({}); }}
        >
          {loginType === "password" ? "Login with OTP instead →" : "← Login with Password instead"}
        </button>

        {/* Register */}
        <p className="auth-footer-text">
          Don't have an account?{" "}
          <Link href="/register" className="auth-footer-link">Create Account</Link>
        </p>

      </div>
    </div>
  );
}