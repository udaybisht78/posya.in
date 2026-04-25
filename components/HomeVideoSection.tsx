"use client";
import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import Link from "next/link";

export default function OrganicSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canLoadVideo, setCanLoadVideo] = useState(false);

  // Delay video load until page is stable
  useEffect(() => {
    const t = setTimeout(() => {
      setCanLoadVideo(true);
    }, 1500); // VERY IMPORTANT

    return () => clearTimeout(t);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative w-full h-[550px] md:h-[650px] overflow-hidden">
      
      {/* Video loads ONLY after delay */}
      {canLoadVideo && (
        <video
          ref={videoRef}
          src="/images/honeymaking.mp4"
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Overlay */}
      <div
        className={`absolute inset-0 transition duration-500 ${
          isPlaying ? "bg-black/30" : "bg-black/60"
        }`}
      />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={togglePlay}
          className="bg-white/80 p-4 rounded-full hover:bg-white transition"
        >
          {isPlaying ? (
            <Pause size={22} className="text-black" />
          ) : (
            <Play size={22} className="text-black" />
          )}
        </button>
      </div>

      {/* Text */}
      <div className="absolute right-6 md:right-25 top-1/3 -translate-y-1/2 text-center text-white max-w-lg">
        <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-2">
          We Produce Organically
        </h2>
        <p className="text-sm md:text-base leading-relaxed mb-5">
          Explore our organic products that we produce straight from the lap of
          the Himalayas
        </p>
        <Link href="/shop" prefetch={false} className="explore-btn btn mt-5 md:w-50">
          Start Shopping Now..
        </Link>
      </div>
    </section>
  );
}
