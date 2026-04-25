"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function OrderSuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order_number");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0d3b2e] via-[#145c45] to-[#0d3b2e] px-4 text-white">
      {/* Confetti effect */}
      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          {[...Array(25)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{
                y: "100vh",
                opacity: [1, 0.8, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white text-gray-800 shadow-2xl rounded-3xl p-10 max-w-md text-center z-10"
      >
        {/* Icon with filled style */}
        <motion.div
          className="flex justify-center mb-5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 120"
            className="w-18 h-18 text-[#0d3b2e]"
          >
            <motion.circle
              cx="60"
              cy="60"
              r="58"
              fill="#0d3b2e"
              stroke="white"
              strokeWidth="4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.path
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M35 63l15 15 35-35"
              strokeDasharray="80"
              strokeDashoffset="80"
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            />
          </motion.svg>
        </motion.div>

        {/* Text Section */}
        <motion.h1
          className="text-2xl font-semibold text-[#0d3b2e] mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          Order Placed Successfully!
        </motion.h1>

        <motion.p
          className="text-base text-gray-700 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          Your Order ID:{" "}
          <span className="font-mono font-semibold text-gray-900">
            #{orderNumber || "N/A"}
          </span>
        </motion.p>

        <motion.p
          className="text-gray-500 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          We'll notify you when your order is shipped.
        </motion.p>

        <motion.a
          href="/shop"
          className="inline-block bg-[#0d3b2e] hover:bg-[#145c45] text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
        >
          Continue Shopping
        </motion.a>
      </motion.div>
    </div>
  );
}