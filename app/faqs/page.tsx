"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Are Posya products 100% natural?",
    a: "Yes, all our products are made traditionally using natural ingredients with no artificial additives. Every product is crafted with care using pure Himalayan and floral ingredients.",
  },
  {
    q: "How long does delivery take?",
    a: "Delivery typically takes 5–7 business days depending on your location. Remote areas may take a little longer. You'll receive a tracking link once your order is shipped.",
  },
  {
    q: "Can I place bulk orders?",
    a: "Absolutely! Email us at help@posya.in for bulk pricing and minimum order quantity details. Our team will get back to you within 24 hours.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently, we ship within India only. International shipping may be added in the future — stay tuned to our newsletters for updates.",
  },
  {
    q: "What is your return & refund policy?",
    a: "We accept returns within 7 days of delivery if the product is unused and in its original packaging. Please visit our Refund Policy page or contact support for assistance.",
  },
  {
    q: "Are your products safe for sensitive skin?",
    a: "Our products are made with natural ingredients and no harsh chemicals, making them suitable for most skin types. However, we recommend doing a patch test before first use.",
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            Help Center
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Frequently Asked<br />Questions
          </h1>
          <p className="text-base md:text-lg text-white/80">
            Everything you need to know about Posya products & orders.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Section label */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#cb8836" }}>
            FAQ's
          </p>
          <h2 className="text-3xl font-bold" style={{ color: "#2b1a06", fontFamily: "'Libre Baskerville', serif" }}>
            Got Questions? We've Got Answers.
          </h2>
        </div>

        {/* Accordion */}
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="faq-item"
              style={{ borderColor: openIndex === i ? "#cb8836" : "rgba(203,136,54,0.2)" }}
            >
              <button
                className="faq-question"
                onClick={() => toggle(i)}
              >
                <span>{faq.q}</span>
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
                  {faq.a}
                  {faq.q.includes("bulk") && (
                    <span>
                      {" "}Email us at{" "}
                      <a href="mailto:help@posya.in" className="faq-link">
                        help@posya.in
                      </a>
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="faq-cta">
          <p className="faq-cta-text">Still have questions?</p>
          <p className="faq-cta-sub">
            Our team is happy to help you with anything.
          </p>
          <Link href="/contact" className="faq-cta-btn">
            Contact Us
          </Link>
        </div>

      </div>
    </div>
  );
}