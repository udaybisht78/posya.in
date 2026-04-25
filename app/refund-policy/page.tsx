"use client";

import React, { useState } from "react";
import { ChevronDown, PackageX, CheckCircle, Clock } from "lucide-react";

const sections = [
  {
    icon: <PackageX size={18} />,
    title: "Damaged or Incorrect Items",
    content:
      "If your product arrives damaged or is incorrect, contact us within 48 hours of delivery with clear photos of the item and packaging. Eligible claims will be reviewed and processed promptly. We take full responsibility for errors on our end.",
  },
  {
    icon: <CheckCircle size={18} />,
    title: "Conditions for Refund",
    list: [
      "Opened or perishable items are non-returnable unless defective",
      "Refunds will be issued to the original payment method only",
      "Processing times: 7–10 business days after approval",
      "Items must be reported within 48 hours of delivery to be eligible",
    ],
  },
  {
    icon: <Clock size={18} />,
    title: "Refund Timeline",
    content:
      "Once your refund request is approved, the amount will be credited back to your original payment method within 7–10 business days. Bank processing times may vary. You will receive an email confirmation once the refund is initiated.",
  },
];

export default function RefundPolicyPage() {
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
            Refund &amp; Returns
          </h1>
          <p className="text-base md:text-lg text-white/80">
            We stand behind every product we send your way.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Intro */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#cb8836" }}>
            Updated: November 5, 2025
          </p>
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#2b1a06", fontFamily: "'Libre Baskerville', serif" }}>
            Our Refund Policy
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#7a6a58" }}>
            Your satisfaction is our priority. If something isn't right, we're here to make it better.
            Please review the conditions below to understand how we handle returns and refunds.
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
                  {sec.content && <p>{sec.content}</p>}
                  {sec.list && (
                    <ul className="pp-list">
                      {sec.list.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="faq-cta">
          <p className="faq-cta-text">Need help with a return?</p>
          <p className="faq-cta-sub">
            Email us within 48 hours of delivery and we'll sort it out.
          </p>
          <a href="mailto:help@posya.in" className="faq-cta-btn">
            Email help@posya.in
          </a>
        </div>

      </div>
    </div>
  );
}