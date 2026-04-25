"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  text?: string; 
}

export default function BreadCumb({ text }: BackButtonProps) {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-[#0d3b2e] transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{text || "Back"}</span>
        </button>
      </div>
    </div>
  );
}
