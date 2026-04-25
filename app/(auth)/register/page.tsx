"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phoneOrEmail: "", password: "", password_confirmation: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.phoneOrEmail.trim()) newErrors.phoneOrEmail = "Email or Phone is required";
    else if (!emailRegex.test(form.phoneOrEmail) && !phoneRegex.test(form.phoneOrEmail))
      newErrors.phoneOrEmail = "Enter a valid email or 10-digit phone number";
    if (form.password.length < 6) newErrors.password = "Minimum 6 characters";
    if (form.password !== form.password_confirmation) newErrors.password_confirmation = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "customer" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      toast.success("OTP sent! Please verify your email/phone.");
      router.push(`/verify-otp?identifier=${form.phoneOrEmail}&role=customer`);
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

        <h1 className="auth-form-heading">Create Account</h1>
        <p className="auth-form-sub">Join the Posya family today</p>

        <form onSubmit={handleSubmit} className="auth-form">

          {/* Full Name */}
          <div className="auth-field">
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><User size={16} /></span>
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`auth-input ${errors.name ? "auth-input--error" : ""}`}
                autoComplete="name"
              />
            </div>
            {errors.name && <p className="auth-error">{errors.name}</p>}
          </div>

          {/* Email or Phone */}
          <div className="auth-field">
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                {form.phoneOrEmail.includes("@") ? <Mail size={16} /> : <Phone size={16} />}
              </span>
              <input
                type="text"
                placeholder="Email or Phone number"
                value={form.phoneOrEmail}
                onChange={(e) => setForm({ ...form, phoneOrEmail: e.target.value })}
                className={`auth-input ${errors.phoneOrEmail ? "auth-input--error" : ""}`}
                autoComplete="username"
              />
            </div>
            {errors.phoneOrEmail && <p className="auth-error">{errors.phoneOrEmail}</p>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><Lock size={16} /></span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`auth-input ${errors.password ? "auth-input--error" : ""}`}
                autoComplete="new-password"
              />
              <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="auth-error">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><Lock size={16} /></span>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                className={`auth-input ${errors.password_confirmation ? "auth-input--error" : ""}`}
                autoComplete="new-password"
              />
              <button type="button" className="auth-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password_confirmation && <p className="auth-error">{errors.password_confirmation}</p>}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Creating Account...
              </span>
            ) : "Create Account"}
          </button>
        </form>

        {/* Login link */}
        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link href="/login" className="auth-footer-link">Sign In</Link>
        </p>

      </div>
    </div>
  );
}