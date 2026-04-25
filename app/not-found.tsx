"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0d3b2e]/10 to-[#0d3b2e]/30 p-6 text-center">
      
      {/* Animated 404 */}
      <div className="flex flex-col items-center animate-bounce-slow">
        <h1 className="text-9xl font-extrabold text-[#0d3b2e] mb-4">404</h1>
        <AlertTriangle className="text-[#0d3b2e] w-20 h-20 mb-6 animate-pulse" />
      </div>

      <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-[#0d3b2e]">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-700 mb-6 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 bg-[#0d3b2e] text-white rounded-lg shadow-lg hover:bg-[#0b3325] transition duration-300 font-medium"
      >
        Go Back Home
      </button>
    </div>
  );
}
