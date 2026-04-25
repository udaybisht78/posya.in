"use client";
import { useState } from "react";

import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN;

interface LoginRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginRegisterModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: LoginRegisterModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loginType, setLoginType] = useState<"password" | "otp">("password");
  const [form, setForm] = useState({ 
    name: "", 
    phoneOrEmail: "",
    password: "", 
    password_confirmation: "",
    otp: ""
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpStep, setOtpStep] = useState(false); // For login OTP flow

  if (!isOpen) return null;

  // ✅ Login with Password Handler
  const handlePasswordLogin = async () => {
    if (!form.phoneOrEmail || !form.password) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({
          email: form.phoneOrEmail,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
      onSuccess();
      onClose();
      
    } catch (err: any) {
      console.error("Login Error:", err);
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Send OTP for Login
  const handleSendLoginOTP = async () => {
    if (!form.phoneOrEmail) {
      return toast.error("Please enter email or phone");
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}send-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({ 
          identifier: form.phoneOrEmail 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Cannot send OTP");
      }

      setOtpStep(true);
      toast.success("OTP sent! Please check your email/phone.");
      
    } catch (err: any) {
      console.error("Send OTP Error:", err);
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP for Login
  const handleVerifyLoginOTP = async () => {
    if (!form.otp || form.otp.length !== 4) {
      return toast.error("Please enter valid 4-digit OTP");
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}verify-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({ 
          identifier: form.phoneOrEmail, 
          otp: form.otp 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      if (!data.token) {
        throw new Error("Token not received");
      }

      localStorage.setItem("token", data.token);
      toast.success("OTP verified! Login successful.");
      onSuccess();
      onClose();
      
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Register Handler (sends OTP)
  const handleRegister = async () => {
    if (!form.name || !form.phoneOrEmail || !form.password) {
      return toast.error("Please fill all fields");
    }

    if (form.password !== form.password_confirmation) {
      return toast.error("Passwords don't match");
    }

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({
          name: form.name,
          phoneOrEmail: form.phoneOrEmail,
          password: form.password,
          password_confirmation: form.password_confirmation,
          role: "customer"
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setOtpSent(true);
      toast.success(`OTP sent to ${form.phoneOrEmail}`);
      
    } catch (err: any) {
      console.error("Register Error:", err);
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP for Registration
  const handleVerifyRegisterOTP = async () => {
    if (!form.otp || form.otp.length !== 4) {
      return toast.error("Please enter valid 4-digit OTP");
    }

    setLoading(true);
    try {
      const verifyRes = await fetch(`${BASE_URL}verify-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({ 
          identifier: form.phoneOrEmail, 
          otp: form.otp 
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(verifyData.message || "OTP verification failed");
      }

      toast.success("OTP verified!");

      const loginRes = await fetch(`${BASE_URL}login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({
          email: form.phoneOrEmail,
          password: form.password,
        }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok || !loginData.token) {
        throw new Error("Auto-login failed after verification");
      }

      localStorage.setItem("token", loginData.token);
      toast.success("Registration & Login successful!");
      onSuccess();
      onClose();
      
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl font-bold"
        >
          ✕
        </button>

        {/* Registration OTP Verification Screen */}
        {otpSent ? (
          <>
            <h3 className="text-center font-bold text-xl mb-2 text-gray-800">
              Verify OTP
            </h3>
            <p className="text-center text-gray-500 mb-6 text-sm">
              Enter the 4-digit OTP sent to <strong>{form.phoneOrEmail}</strong>
            </p>
            
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              maxLength={4}
              className="border border-gray-300 p-3 w-full mb-6 rounded-lg text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
            />
            
            <button
              onClick={handleVerifyRegisterOTP}
              disabled={loading || form.otp.length !== 4}
              className="bg-green-600 text-white w-full p-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <button
              onClick={() => {
                setOtpSent(false);
                setForm({ ...form, otp: "" });
              }}
              className="text-gray-500 text-sm mt-4 w-full hover:text-gray-700"
            >
              Back to Register
            </button>
          </>
        ) : (
          <>
            {/* Login/Register Tabs */}
            <div className="flex mb-6 border-b">
              <button
                className={`flex-1 pb-3 font-semibold transition ${
                  tab === "login" 
                    ? "text-[#0d3b2e] border-b-2 border-[#0d3b2e]" 
                    : "text-gray-500"
                }`}
                onClick={() => {
                  setTab("login");
                  setOtpStep(false);
                  setForm({ ...form, otp: "" });
                }}
              >
                Login
              </button>
              <button
                className={`flex-1 pb-3 font-semibold transition ${
                  tab === "register" 
                    ? "text-[#0d3b2e] border-b-2 border-[#0d3b2e]" 
                    : "text-gray-500"
                }`}
                onClick={() => {
                  setTab("register");
                  setLoginType("password");
                  setOtpStep(false);
                  setForm({ ...form, otp: "" });
                }}
              >
                Register
              </button>
            </div>

            {/* LOGIN TAB */}
            {tab === "login" && (
              <>
                {/* Email or Phone */}
                <input
                  type="text"
                  placeholder="Email or Phone"
                  value={form.phoneOrEmail}
                  onChange={(e) => setForm({ ...form, phoneOrEmail: e.target.value })}
                  className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
                />

                {/* Password Field (only for password login) */}
                {loginType === "password" && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
                  />
                )}

                {/* OTP Input (only after OTP sent) */}
                {loginType === "otp" && otpStep && (
                  <input
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    value={form.otp}
                    onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                    maxLength={4}
                    className="border border-gray-300 p-3 w-full mb-4 rounded-lg text-center text-xl font-bold tracking-widest focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
                  />
                )}

                {/* Submit Button */}
                <button
                  onClick={
                    loginType === "password" 
                      ? handlePasswordLogin 
                      : otpStep 
                        ? handleVerifyLoginOTP 
                        : handleSendLoginOTP
                  }
                  disabled={loading}
                  className="bg-[#0d3b2e] text-white w-full p-3 rounded-lg font-semibold hover:bg-[#145c45] transition disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                >
                  {loading
                    ? "Processing..."
                    : loginType === "password"
                      ? "Login with Password"
                      : otpStep
                        ? "Verify OTP"
                        : "Send OTP"}
                </button>

                {/* Toggle Login Method */}
                <p
                  className="text-center text-blue-600 cursor-pointer text-sm hover:underline reverseLoginButton"
                  onClick={() => {
                    setLoginType(loginType === "password" ? "otp" : "password");
                    setOtpStep(false);
                    setForm({ ...form, otp: "", password: "" });
                  }}
                >
                  {loginType === "password" 
                    ? "Login with OTP instead" 
                    : "Login with Password instead"}
                </p>
              </>
            )}

            {/* REGISTER TAB */}
            {tab === "register" && (
              <>
                {/* Name */}
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
                />

                {/* Email or Phone */}
                <input
                  type="text"
                  placeholder="Email or Phone"
                  value={form.phoneOrEmail}
                  onChange={(e) => setForm({ ...form, phoneOrEmail: e.target.value })}
                  className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
                />

                {/* Password */}
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
                />

                {/* Confirm Password */}
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  className="border border-gray-300 p-3 w-full mb-6 rounded-lg focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
                />

                {/* Register Button */}
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="bg-[#0d3b2e] text-white w-full p-3 rounded-lg font-semibold hover:bg-[#145c45] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Please wait..." : "Register & Send OTP"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Demo Component
function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Checkout Page Demo
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0d3b2e] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#145c45] transition shadow-lg"
        >
          Open Login/Register Modal
        </button>

        <LoginRegisterModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            toast.success("Login successful! User is now authenticated.");
            setShowModal(false);
          }}
        />
      </div>
    </div>
  );
}
