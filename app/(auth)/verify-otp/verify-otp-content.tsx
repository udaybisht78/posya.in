"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN;

export default function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const identifier = searchParams.get("identifier") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: any) => {
    e.preventDefault();
    if (otp.length !== 4) return toast.error("Please enter a 4-digit OTP");

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      if (data.token && data.user) {
        // Save token
        localStorage.setItem("token", data.token);

        // Role-based redirect
        const role = data.user.role.toLowerCase();
        if (role === "admin" || role === "shop_manager") {
          router.push(`${DOMAIN_URL}admin`);
        } else {
          router.push("/dashboard");
        }

        toast.success("OTP verified! Logged in successfully.");
      } else {
        toast.success("OTP verified successfully! Please login.");
        router.push("/login");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");
      toast.success("OTP resent successfully!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-50 px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Verify OTP</h2>
        <p className="text-center text-gray-600 mb-4">
          Enter the 4-digit OTP sent to <span className="font-semibold">{identifier}</span>
        </p>

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <input
            type="text"
            maxLength={4}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-center text-xl tracking-widest"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          Didn't receive OTP?{" "}
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-green-600 font-semibold hover:underline"
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
}