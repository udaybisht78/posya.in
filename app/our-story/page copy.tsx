'use client';

import React from 'react';
import Link from "next/link";

export default function AboutUs() {
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

      <section className="bg-[#f7f3ee] py-28">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    <div>
      <h3 className="uppercase tracking-widest text-sm text-[#cb8836] mb-4">
        Brand essence
      </h3>

      <p className="text-lg text-gray-700 leading-relaxed">
        Posya curates floral nutrition, drawing inspiration from the quiet intelligence of nature:
        a bee sipping nectar, pollinating blossoms, and helping transform floral essence into honey
        and other nutrient-rich expressions of the flower. This celestial continuum-
        “bloom to bee to bottle”—shapes how Posya fuses with the tune of natural nutrition.
      </p>
    </div>

    <div className="h-[420px] rounded-3xl overflow-hidden shadow-xl">
      <img src="/images/floralwater.jpg" className="w-full h-full object-cover" />
    </div>

  </div>
</section>
<section className="bg-white py-28">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    {/* IMAGE — LEFT */}
    <div className="h-[420px] rounded-3xl overflow-hidden shadow-xl">
      <img
        src="/images/herbalfloral.webp"
        className="w-full h-full object-cover"
        alt="Floral Nutrition"
      />
    </div>

    {/* TEXT — RIGHT */}
    <div>
      <h3 className="uppercase tracking-widest text-sm text-[#cb8836] mb-4">
        Floral nutrition philosophy
      </h3>

      <div className="space-y-6 text-lg text-gray-700 leading-relaxed">

        <p>
          At the heart of Posya is a belief that flowers are more than fragrance; they are delicate nutritional ecosystems.
          POSYA aligns itself with the tunes of nature to ENVISION, NOURISH and PRODUCE : 
          We capture the delicate dance of life :
        </p>

        <p>
          Honeybees pollinate and harvest LIQUID GOLD from flora, traversing pristine landscapes and the blossoms they grace—delivering you pure, nutrient-rich hydration drawn from nature's vibrant, living ecosystem.
        </p>

        <p>
          Hydrosols, meticulously distilled from the bee-kissed petals and herbs, preserve water-soluble phytonutrients and delicate aromatic essences.
        </p>

        <p>
          Ghee, crafted from the milk of cows grazing lush, bloom-fed meadows in pristine Himalayan pastures, imparts a timeless, fat-rich depth of unparalleled decadence.
        </p>

      </div>
    </div>

  </div>
</section>
<section className="bg-[#fcf9f2] py-28">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    {/* TEXT — LEFT */}
    <div>
      <h3 className="uppercase tracking-widest text-sm text-[#cb8836] mb-4">
        From flower to you
      </h3>

      <div className="space-y-6 text-lg text-gray-700 leading-relaxed">

        <p>
          By honouring each step—flower, bee, grazing, pollination, extraction—Posya offers nutrition products that feel alive, nuanced and naturally balanced.
        </p>

        <p>
          Each bottle of POSYA is crafted with bare minimum human intervention to translate the quiet work of nature's alchemy into natural everyday nourishment, uniting nectarous pleasure with subtle floral wellness.
        </p>

      </div>
    </div>

    {/* IMAGE — RIGHT */}
    <div className="h-[420px] rounded-3xl overflow-hidden shadow-xl">
      <img
        src="/images/natural.jpg"
        className="w-full h-full object-cover"
        alt="From flower to you"
      />
    </div>

  </div>
</section>


      {/* Values Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center text-[#0d3b2e]">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl font-bold mb-4 text-[#0d3b2e]">Purity</h3>
              <p className="text-gray-700 leading-relaxed">
                We ensure every product is free from additives, chemicals, or preservatives.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl font-bold mb-4 text-[#0d3b2e]">Tradition</h3>
              <p className="text-gray-700 leading-relaxed">
                Using age-old methods passed down through generations to maintain authenticity.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl font-bold mb-4 text-[#0d3b2e]">Sustainability</h3>
              <p className="text-gray-700 leading-relaxed">
                Supporting local communities and sourcing ingredients responsibly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-6 text-[#0d3b2e]">Experience the Posya Difference</h2>
        <p className="text-xl text-gray-700 mb-10 leading-relaxed">
          Discover natural wellness products crafted with care and authenticity.
        </p>
        <Link href="/shop">
            <button className="px-10 py-4 bg-[#0d3b2e] text-white rounded-lg font-semibold hover:bg-[#0b2d21] transition text-lg">
              Explore Our Collection
            </button>
        </Link>
      </section>

    </div>
  );
}