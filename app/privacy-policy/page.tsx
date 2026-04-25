"use client";

import React, { useState } from "react";
import { ChevronDown, Shield, Eye, Cookie, Share2, Lock, UserCheck } from "lucide-react";

const sections = [
  {
    icon: <Eye size={18} />,
    title: "Information We Collect",
    content: null,
    list: [
      "Personal info during checkout or account creation (name, contact, address)",
      "Payment details securely processed via trusted third-party gateways",
      "Device & usage data for analytics and experience improvement",
    ],
  },
  {
    icon: <Shield size={18} />,
    title: "How We Use Information",
    content:
      "We use your data to process orders, communicate about your purchases, personalize offers, and comply with legal obligations. We never sell your personal information to any third party.",
    list: null,
  },
  {
    icon: <Cookie size={18} />,
    title: "Cookies & Tracking",
    content:
      "We use cookies for essential functionality, analytics, and marketing purposes. You can manage cookie preferences in your browser settings at any time.",
    list: null,
  },
  {
    icon: <Share2 size={18} />,
    title: "Third-Party Services",
    content:
      "We share data with trusted service providers (payment processors, shipping companies, analytics) only as required to fulfill orders and improve operations.",
    list: null,
  },
  {
    icon: <Lock size={18} />,
    title: "Data Security",
    content:
      "We implement reasonable security measures to protect your data. However, no method of transmission over the internet is 100% secure. Please exercise caution when sharing sensitive information.",
    list: null,
  },
  {
    icon: <UserCheck size={18} />,
    title: "Your Rights",
    content: null,
    list: [
      "Access or review your personal data at any time",
      "Request correction of inaccurate information",
      "Request deletion of your account and associated data",
      "Contact us at help@posya.in for any privacy-related inquiries",
    ],
    hasEmail: true,
  },
];

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-base md:text-lg text-white/80">
            Your trust matters. Here's how we protect your information.
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
            How We Handle Your Data
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#7a6a58" }}>
            At Posya, we collect your personal information to provide a seamless shopping experience,
            improve our services, and ensure your data is always protected.
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
                        <li key={j}>
                          {sec.hasEmail && item.includes("help@posya.in") ? (
                            <>
                              Contact us at{" "}
                              <a href="mailto:help@posya.in" className="faq-link">
                                help@posya.in
                              </a>{" "}
                              for any privacy-related inquiries
                            </>
                          ) : (
                            item
                          )}
                        </li>
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
          <p className="faq-cta-text">Have a privacy concern?</p>
          <p className="faq-cta-sub">
            Reach out to us and we'll respond within 24 hours.
          </p>
          <a href="mailto:help@posya.in" className="faq-cta-btn">
            Email Us
          </a>
        </div>

      </div>
    </div>
  );
}