"use client";

import React from 'react';
import Link from 'next/link';

export default function FAQsPage() {
  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* Hero Section */}
      <section
        className="relative w-full bg-cover bg-center bg-no-repeat text-white py-20"
        style={{ backgroundImage: "url('/images/naturalBgImage.webp')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 overlay-bg" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            POSYA
          </h1>

          <p className="text-md md:text-xl text-white/90 leading-relaxed">
            Petal-born wellness, timeless glow.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{ color: '#0d3b2e' }}>Frequently Asked Questions (FAQs)</h1>
          <p className="text-sm text-gray-500">Updated: November 5, 2025</p>
        </div>

        <main className="text-gray-800 leading-relaxed space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>Are Posya products 100% natural?</h2>
            <p>Yes, all our products are made traditionally using natural ingredients with no artificial additives.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>How long does delivery take?</h2>
            <p>Delivery typically takes 5–7 business days depending on your location.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>Can I place bulk orders?</h2>
            <p>Email us at <a href="mailto:help@posya.in" className="font-medium" style={{ color: '#0d3b2e' }}>help@posya.in</a> for bulk pricing and minimum order quantity details.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>Do you ship internationally?</h2>
            <p>Currently, we ship within India only. International shipping may be added in the future.</p>
          </section>
        </main>
      </div>
    </div>
  );
}