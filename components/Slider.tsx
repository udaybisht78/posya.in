"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Slider() {
  const words = ["PETAL BORN WELLNESS"];
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [canLoadVideo, setCanLoadVideo] = useState(false);

  useEffect(() => {
    const current = words[0];
    const speed = isDeleting ? 40 : 90;

    const timer = setTimeout(() => {
      setText((prev) =>
        isDeleting
          ? current.substring(0, prev.length - 1)
          : current.substring(0, prev.length + 1)
      );

      if (!isDeleting && text === current) {
        setTimeout(() => setIsDeleting(true), 1500);
      }

      if (isDeleting && text === "") {
        setIsDeleting(false);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isDeleting]);

  useEffect(() => {
    const t = setTimeout(() => setCanLoadVideo(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full h-[70vh] md:h-[89vh] overflow-hidden">

      {/* Background video */}
      {canLoadVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/images/sliderVideo.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">

        <p className="uppercase tracking-[0.3em] text-xs md:text-sm text-white/80 mb-4">
          Welcome to Posya
        </p>

        <h1 className="text-3xl md:text-5xl font-bold tracking-wide drop-shadow-xl mb-6">
          {text}
          <span className="animate-pulse ml-1">|</span>
        </h1>

        <Link
          href="/our-story"
          className="slideButton group flex items-center gap-3 text-2xl md:text-base font-semibold tracking-wide uppercase text-white hover:text-[#cb8836] transition-all"
        >
          Experience POSYA
          <ArrowRight
            size={18}
            className="transform group-hover:translate-x-2 transition-transform duration-300"
          />
        </Link>

      </div>
    </div>
  );
}
