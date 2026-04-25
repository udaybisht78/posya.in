"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function FounderNote() {
  return (
    <section className="relative py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 items-center gap-12">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="text-sm font-bold tracking-widest uppercase" style={{ color: "#cb8836" }}>
            Note from the Founder
          </p>

          <h2 className="text-4xl md:text-5xl font-serif font-bold" style={{ color: "#2b1a06" }}>
            A Journey Born<br />in the Himalayas
          </h2>

          {/* Decorative quote line */}
          <div className="flex items-start gap-3">
            <span className="text-6xl leading-none font-serif" style={{ color: "#cb8836", lineHeight: "1" }}>"</span>
            <p className="text-lg text-gray-700 leading-relaxed pt-2">
              The year 2020 was a game changer for everyone, for me it was the card to get out and build my dreams in the high mountains of Himalayas. The journey starts after the first lockdown with a panache for trekking the rugged mountains but instantaneously turns into a spiritual trek which leads me to the high peaks of Nanda Devi sanctuary.
            </p>
          </div>

          {/* Founder signature */}
          <div className="flex items-center gap-4 pt-2">
            <div className="w-12 h-px" style={{ background: "#cb8836" }} />
            <div>
              <p className="font-bold text-sm" style={{ color: "#2b1a06" }}>Founder, Posya</p>
              <p className="text-xs text-gray-500">Est. 2020</p>
            </div>
          </div>

          <a
            href="/our-story"
            className="inline-block px-8 py-3 text-sm font-semibold text-white rounded-full shadow-lg transition"
            style={{ background: "#cb8836" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#a06a20")}
            onMouseLeave={e => (e.currentTarget.style.background = "#cb8836")}
          >
            Discover Our Journey
          </a>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-xl"
        >
          <Image
            src="/images/video-thumbnail.jpg"
            alt="Note from the Founder"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Overlay label */}
          {/* <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl px-5 py-4">
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#cb8836" }}>
              Est. 2020
            </p>
            <p className="text-sm font-semibold" style={{ color: "#2b1a06", fontFamily: "'Libre Baskerville', serif" }}>
              Born in the Himalayas, crafted with passion
            </p>
          </div> */}
        </motion.div>

      </div>
    </section>
  );
}