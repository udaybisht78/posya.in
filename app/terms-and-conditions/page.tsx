"use client";

import React, { useState } from "react";
import { ChevronDown, ShoppingBag, Truck, CreditCard, Copyright, Scale } from "lucide-react";

const sections = [
  {
    icon: <ShoppingBag size={18} />,
    title: "1. Products & Orders",
    content:
      "All our products are crafted traditionally; natural variations in colour, texture, or aroma are completely normal. We reserve the right to cancel or modify orders due to stock unavailability or pricing errors. You will be notified and refunded promptly in such cases.",
  },
  {
    icon: <Truck size={18} />,
    title: "2. Shipping",
    content:
      "We dispatch orders through reliable couriers. Delivery timelines depend on your location and courier availability. Typically orders are delivered within 5–7 business days. Posya is not responsible for delays caused by courier partners or unforeseen circumstances.",
  },
  {
    icon: <CreditCard size={18} />,
    title: "3. Payment",
    content:
      "All payments are securely processed via trusted third-party gateways. We do not store your payment card information on our servers. In case of a payment failure, the amount will be refunded within 5–7 business days.",
  },
  {
    icon: <Copyright size={18} />,
    title: "4. Intellectual Property",
    content:
      "All content, imagery, branding, and design on the Posya platform are the exclusive property of Posya. Unauthorized reproduction, distribution, or use of any material without prior written consent is strictly prohibited.",
  },
  {
    icon: <Scale size={18} />,
    title: "5. Governing Law",
    content:
      "These terms are governed by the laws of India. Any disputes arising out of or in connection with these terms shall be handled exclusively in competent courts within India.",
  },
];

export default function TermsConditionsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="min-h-screen" style={{ background: "#f2eee9" }}>

      {/* Hero */}
      <section
        className="relative w-full bg-cover bg-center bg-no-repeat text-white py-24"
        style={{ backgroundImage: "url('/images/naturalBgImage.webp')" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(43,26,6,0.72)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#cb8836" }}>
            Legal
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Terms &amp; Conditions
          </h1>
          <p className="text-base md:text-lg text-white/80">
            Please read these terms carefully before using our platform.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Intro */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#cb8836" }}>
            Last Updated: November 5, 2025
          </p>
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#2b1a06", fontFamily: "'Libre Baskerville', serif" }}>
            Our Terms of Use
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#7a6a58" }}>
            By accessing or using the Posya platform, you agree to be bound by the following
            terms and conditions. If you disagree with any part, please discontinue use.
          </p>
        </div>

        {/* Accordion */}
        <div className="faq-list">
          {sections.map((sec, i) => (
            <div
              key={i}
              className="faq-item"
              style={{ borderColor: openIndex === i ? "#cb8836" : "rgba(203,136,54,0.2)" }}
            >
              <button className="faq-question" onClick={() => toggle(i)}>
                <span className="flex items-center gap-3">
                  <span className="pp-icon">{sec.icon}</span>
                  {sec.title}
                </span>
                <ChevronDown
                  size={20}
                  className="faq-chevron"
                  style={{
                    transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                    color: "#cb8836",
                  }}
                />
              </button>

              {openIndex === i && (
                <div className="faq-answer">
                  <p>{sec.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="faq-cta">
          <p className="faq-cta-text">Questions about our terms?</p>
          <p className="faq-cta-sub">
            Our team is happy to clarify anything for you.
          </p>
          <a href="mailto:help@posya.in" className="faq-cta-btn">
            Contact Us
          </a>
        </div>

      </div>
    </div>
  );
}