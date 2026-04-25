"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;



export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phoneOrEmail: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!form.phoneOrEmail.trim()) newErrors.phoneOrEmail = "Email or Phone is required";
    else if (!emailRegex.test(form.phoneOrEmail) && !phoneRegex.test(form.phoneOrEmail)) {
      newErrors.phoneOrEmail = "Enter a valid email or 10-digit phone number";
    }

    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return toast.error("Please fix the highlighted errors");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          role: "customer",
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      toast.success("OTP sent to your email/phone. Please verify.");

      // Redirect to OTP verify page with role info
      router.push(`/verify-otp?identifier=${form.phoneOrEmail}&role=customer`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-50 px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Email or Phone Number"
              value={form.phoneOrEmail}
              onChange={(e) => setForm({ ...form, phoneOrEmail: e.target.value })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.phoneOrEmail ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"
              }`}
            />
            {errors.phoneOrEmail && <p className="text-red-500 text-sm mt-1">{errors.phoneOrEmail}</p>}
          </div>

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

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.password_confirmation}
              onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password_confirmation ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-400"
              }`}
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-green-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
