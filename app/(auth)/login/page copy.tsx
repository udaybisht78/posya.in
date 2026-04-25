"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "", otp: "" });
  const [loginType, setLoginType] = useState<"password" | "otp">("password");
  const [otpStep, setOtpStep] = useState(false); // true when OTP sent
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!form.identifier.trim()) newErrors.identifier = "Email or Phone is required";
    else if (!emailRegex.test(form.identifier) && !phoneRegex.test(form.identifier)) {
      newErrors.identifier = "Enter a valid email or 10-digit phone number";
    }

    if (loginType === "password") {
      if (!form.password.trim()) newErrors.password = "Password is required";
      else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
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
          // Step 1: Send OTP
          const res = await fetch(`${BASE_URL}send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: form.identifier }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Cannot send OTP");
          toast.success("OTP sent! Please check your email/phone.");
          setOtpStep(true);
        } else {
          // Step 2: Verify OTP
          const res = await fetch(`${BASE_URL}verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: form.identifier, otp: form.otp }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Invalid OTP");
          localStorage.setItem("token", data.token);
          toast.success("OTP verified! Login successful.");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-50 px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Email or Phone"
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.identifier ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"
              }`}
            />
            {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>}
          </div>

          {loginType === "password" && (
            <div>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
          )}

          {loginType === "otp" && otpStep && (
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.otp ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"
                }`}
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : loginType === "password"
              ? "Login with Password"
              : otpStep
              ? "Verify OTP"
              : "Send OTP"}
          </button>
        </form>

        <p
          className="text-center mt-2 text-blue-600 cursor-pointer reverseLoginButton"
          onClick={() => {
            setLoginType(loginType === "password" ? "otp" : "password");
            setOtpStep(false);
          }}
        >
          {loginType === "password" ? "Login with OTP instead" : "Login with Password instead"}
        </p>

        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="text-green-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
