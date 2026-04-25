'use client';

import React from 'react';
import Link from "next/link";

const logoElements = [
  {
    img: "/images/lg1.png",
    title: "Banyan",
    desc: "Symbolises strength, longevity, and deep-rooted wisdom.",
  },
  {
    img: "/images/lg2.png",
    title: "Neem",
    desc: "Represents healing, purification, and natural protection.",
  },
  {
    img: "/images/lg3.png",
    title: "Peepal",
    desc: "Embodies growth, spirituality, and the cycle of life.",
  },
  {
    img: "/images/lg4.png",
    title: "Intertwined Roots",
    desc: "Interconnected roots echo harmony of body, mind & nature.",
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen text-gray-900" style={{ background: "#f2eee9" }}>

      {/* ── Hero ── */}
      <section
        className="relative w-full bg-cover bg-center bg-no-repeat text-white py-28"
        style={{ backgroundImage: "url('/images/naturalBgImage.webp')" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(43,26,6,0.72)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#cb8836" }}>
            Our Story
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            POSYA
          </h1>
          <p className="text-lg text-white/80">Petal-born wellness, timeless glow.</p>
        </div>
      </section>

      {/* ── Brand Essence ── */}
      <section style={{ background: "#f7f3ee" }} className="py-28">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="about-eyebrow">Brand Essence</p>
            <h2 className="about-section-heading">The Bloom to Bee to Bottle Journey</h2>
            <p className="about-body">
              Posya curates floral nutrition, drawing inspiration from the quiet intelligence of nature:
              a bee sipping nectar, pollinating blossoms, and helping transform floral essence into honey
              and other nutrient-rich expressions of the flower. This celestial continuum —
              "bloom to bee to bottle" — shapes how Posya fuses with the tune of natural nutrition.
            </p>
          </div>
          <div className="about-img-wrap">
            <img src="/images/floralwater.jpg" className="w-full h-full object-cover" alt="Brand Essence" />
          </div>
        </div>
      </section>

      {/* ── Floral Nutrition ── */}
      <section style={{ background: "#ffffff" }} className="py-28">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="about-img-wrap">
            <img src="/images/herbalfloral.webp" className="w-full h-full object-cover" alt="Floral Nutrition" />
          </div>
          <div>
            <p className="about-eyebrow">Floral Nutrition Philosophy</p>
            <h2 className="about-section-heading">Flowers Are More Than Fragrance</h2>
            <div className="space-y-5 about-body">
              <p>At the heart of Posya is a belief that flowers are delicate nutritional ecosystems. POSYA aligns itself with nature to ENVISION, NOURISH and PRODUCE.</p>
              <p>Honeybees pollinate and harvest liquid gold from flora, traversing pristine landscapes — delivering you pure, nutrient-rich hydration drawn from nature's living ecosystem.</p>
              <p>Hydrosols, meticulously distilled from bee-kissed petals and herbs, preserve water-soluble phytonutrients and delicate aromatic essences.</p>
              <p>Ghee, crafted from the milk of cows grazing lush Himalayan pastures, imparts a timeless, fat-rich depth of unparalleled decadence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── From Flower to You ── */}
      <section style={{ background: "#fcf9f2" }} className="py-28">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="about-eyebrow">From Flower to You</p>
            <h2 className="about-section-heading">Nature's Alchemy, Bottled</h2>
            <div className="space-y-5 about-body">
              <p>By honouring each step — flower, bee, grazing, pollination, extraction — Posya offers nutrition products that feel alive, nuanced and naturally balanced.</p>
              <p>Each bottle of POSYA is crafted with bare minimum human intervention to translate the quiet work of nature's alchemy into natural everyday nourishment.</p>
            </div>
          </div>
          <div className="about-img-wrap">
            <img src="/images/natural.jpg" className="w-full h-full object-cover" alt="From flower to you" />
          </div>
        </div>
      </section>

      {/* ── Logo Iconography ── */}
      <section className="about-logo-section">
        <div className="max-w-7xl mx-auto px-6">

          {/* Small logo above heading */}
          <div className="flex justify-center mb-8">
            <div className="about-logo-main-img-wrap">
              <img
                src="/images/l1.png"
                alt="Posya Logo Icon"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-16">
            <p className="about-eyebrow">Sacred Symbolism</p>
            <h2 className="about-logo-main-heading">Logo Iconography</h2>
            <p className="about-logo-subtext">
              Posya's logo takes inspiration from and blends Banyan, Neem, and Peepal leaves —
              symbolising strength, healing, and growth. A warm golden shade flows through,
              evoking sunlight's nourishing energy.
            </p>
          </div>

          {/* 4 cards in a single row */}
          <div className="grid grid-cols-4 gap-5 mb-16">
            {logoElements.map((el, i) => (
              <div key={i} className="about-logo-card">
                <div className="about-logo-card-img-wrap">
                  <img src={el.img} alt={el.title} className="w-full h-full object-cover" />
                </div>
                <h4 className="about-logo-card-title">{el.title}</h4>
                <p className="about-logo-card-desc">{el.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom quote strip */}
          <div className="about-logo-quote">
            <span className="about-logo-quote-mark">"</span>
            <p>
              Interconnected roots echo harmony of body, mind, and nature — reminding us
              that our well-being is woven into the very fabric of the earth.
            </p>
          </div>

        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 text-center max-w-3xl mx-auto px-6">
        <p className="about-eyebrow text-center">Discover Posya</p>
        <h2 className="about-cta-heading">Experience the Posya Difference</h2>
        <p className="about-body text-center mb-10">
          Discover natural wellness products crafted with care and authenticity.
        </p>
        <Link href="/shop">
          <button className="about-cta-btn">Explore Our Collection</button>
        </Link>
      </section>

    </div>
  );
}