"use client";

import React, { useState } from "react";
import { ChevronDown, Package, Clock, Truck, MapPin, PackageX, RefreshCcw, RotateCcw, XCircle } from "lucide-react";

const shippingSections = [
  {
    icon: <Package size={18} />,
    title: "Order Processing",
    content: "All orders are processed within 1–3 business days of confirmation. You will receive an email notification once your order is confirmed and being prepared for dispatch.",
  },
  {
    icon: <Clock size={18} />,
    title: "Delivery Timelines",
    content: "Delivery takes 4–7 business days after dispatch. Delays caused by external factors such as weather, strikes, or courier issues are beyond our control, though we will assist wherever possible.",
  },
  {
    icon: <Truck size={18} />,
    title: "Shipping Charges",
    list: [
      "Free shipping on all prepaid orders above ₹599",
      "Orders below ₹599 will reflect applicable charges at checkout",
    ],
  },
  {
    icon: <MapPin size={18} />,
    title: "Tracking & Packaging",
    content: "Once shipped, tracking details will be shared via email/SMS. All products are securely packed in sustainable, eco-friendly materials to preserve quality and safety.",
  },
  {
    icon: <PackageX size={18} />,
    title: "Damaged or Lost Shipments",
    content: "If your package arrives damaged or is lost in transit, notify us at posyaorganics@gmail.com within 48 hours of delivery. Our team will review and arrange a replacement or refund as applicable.",
    hasEmail: true,
  },
];

const returnSections = [
  {
    icon: <RotateCcw size={18} />,
    title: "Returns",
    content: "Kindly raise your concern within 48 hours of delivery at posyaorganics@gmail.com, attaching your order number and product images/video. Returned items must be unused, sealed, and in their original packaging.",
    list: [
      "You received the wrong item, or",
      "The product was damaged, defective, or leaked upon arrival",
    ],
    listLabel: "Returns are accepted only if:",
    hasEmail: true,
  },
  {
    icon: <RefreshCcw size={18} />,
    title: "Refunds",
    content: "Once approved, refunds are processed within 5–7 business days to the original payment method. For COD orders, refunds will be made via bank transfer. Refunds are not applicable for used products, late claims, or purchases made during sales or promotional periods.",
  },
  {
    icon: <Package size={18} />,
    title: "Exchanges",
    content: "Exchanges are offered only for damaged or incorrect items reported within 48 hours of delivery. Variations in texture, colour, or fragrance due to natural ingredients do not qualify for exchange.",
  },
  {
    icon: <XCircle size={18} />,
    title: "Cancellations",
    content: "Orders may be cancelled within 6 hours of placement, provided they have not been shipped. Post-dispatch, cancellations will not be accepted. To cancel, contact posyaorganics@gmail.com with your order details.",
    hasEmail: true,
  },
];

function AccordionSection({
  sections,
  startIndex = 0,
  openIndex,
  toggle,
}: {
  sections: any[];
  startIndex?: number;
  openIndex: number | null;
  toggle: (i: number) => void;
}) {
  return (
    <div className="faq-list">
      {sections.map((sec, i) => {
        const idx = startIndex + i;
        return (
          <div
            key={idx}
            className="faq-item"
            style={{ borderColor: openIndex === idx ? "#cb8836" : "rgba(203,136,54,0.2)" }}
          >
            <button className="faq-question" onClick={() => toggle(idx)}>
              <span className="flex items-center gap-3">
                <span className="pp-icon">{sec.icon}</span>
                {sec.title}
              </span>
              <ChevronDown
                size={20}
                className="faq-chevron"
                style={{
                  transform: openIndex === idx ? "rotate(180deg)" : "rotate(0deg)",
                  color: "#cb8836",
                }}
              />
            </button>

            {openIndex === idx && (
              <div className="faq-answer">
                {sec.listLabel && (
                  <p className="mb-3" style={{ color: "#6b5a42" }}>{sec.listLabel}</p>
                )}
                {sec.list && (
                  <ul className="pp-list mb-3">
                    {sec.list.map((item: string, j: number) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                )}
                {sec.content && (
                  <p>
                    {sec.hasEmail
                      ? sec.content.replace("posyaorganics@gmail.com", "").trim().split(/(?=\bposya)/i)[0]
                      : sec.content}
                    {sec.hasEmail && (
                      <>
                        {" "}
                        <a href="mailto:posyaorganics@gmail.com" className="faq-link">
                          posyaorganics@gmail.com
                        </a>
                        {sec.content.split("posyaorganics@gmail.com")[1] || ""}
                      </>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ShippingPolicyPage() {
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
            Shipping &amp; Delivery
          </h1>
          <p className="text-base md:text-lg text-white/80">
            Every Posya order reaches you promptly and in pristine condition.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">

        {/* ── Shipping Section ── */}
        <div>
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#cb8836" }}>
              Shipping Policy
            </p>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "#2b1a06", fontFamily: "'Libre Baskerville', serif" }}>
              How We Ship Your Order
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#7a6a58" }}>
              At POSYA, we ensure every order is handled with care from our hands to your doorstep.
            </p>
          </div>
          <AccordionSection
            sections={shippingSections}
            startIndex={0}
            openIndex={openIndex}
            toggle={toggle}
          />
        </div>

        {/* CTA */}
        <div className="faq-cta">
          <p className="faq-cta-text">Need help with your order?</p>
          <p className="faq-cta-sub">
            Mon – Sat &nbsp;|&nbsp; 10 AM – 6 PM IST
          </p>
          <a href="mailto:posyaorganics@gmail.com" className="faq-cta-btn">
            posyaorganics@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}