"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function OurStorySection() {
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
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-green-900 font-ubantu">
            Our Story
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
           The year 2020 was a game changer for everyone, for me it was the card to get out and build my dreams in the high mountains of Himalayas. The journey starts after the first lockdown with a panache for trekking the rugged mountains but instantaneously turns into a spiritual trek  which leads me to the high peaks of Nanda Devi sanctuary.
          </p>
          <a
            href="#"
            className="inline-block px-8 py-3 text-lg font-medium text-white bg-green-900 rounded-full shadow-lg hover:bg-green-800 transition"
          >
            Discover Our Journey
          </a>
        </motion.div>

        {/* Right Image with Overlay */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl"
        >
          <Image
            src="/images/video-thumbnail.jpg" // <-- replace with your premium image
            alt="Our Story"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </motion.div>
      </div>
    </section>
  );
}
