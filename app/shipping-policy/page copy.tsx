"use client";

import React from 'react';
import Link from 'next/link';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: '#fcf9f2' }}>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 md:p-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#0d3b2e' }}>Shipping & Delivery Policy</h1>
          <p className="text-lg text-gray-700 mt-4">At POSYA, we ensure every order reaches you promptly and in pristine condition.</p>
        </div>

        <main className="text-gray-800 leading-relaxed space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#0d3b2e' }}>Order Processing</h2>
            <p>All orders are processed within 1–3 business days of confirmation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#0d3b2e' }}>Delivery Timelines</h2>
            <p className="mb-2">4–7 business days after dispatch.</p>
            <p className="text-gray-600">Delays caused by external factors such as weather, strikes, or courier issues are beyond our control, though we will assist wherever possible.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#0d3b2e' }}>Shipping Charges</h2>
            <ul className="list-disc ml-5 space-y-2">
              <li>Free shipping on prepaid orders above ₹599.</li>
              <li>Orders below ₹599 will reflect applicable charges at checkout.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#0d3b2e' }}>Tracking & Packaging</h2>
            <p>Once shipped, tracking details will be shared via email/SMS. All products are securely packed in sustainable, eco-friendly materials to preserve quality and safety.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#0d3b2e' }}>Damaged or Lost Shipments</h2>
            <p>If your package arrives damaged or is lost in transit, please notify us at <a href="mailto:posyaorganics@gmail.com" className="font-medium underline" style={{ color: '#0d3b2e' }}>posyaorganics@gmail.com</a> within 48 hours of delivery. Our team will review and arrange a replacement or refund as applicable.</p>
          </section>

          <hr className="my-10 border-gray-300" />

          <div className="mb-8">
            <h1 className="text-4xl font-bold" style={{ color: '#0d3b2e' }}>Return, Refund, Exchange & Cancellation Policy</h1>
            <p className="text-lg text-gray-700 mt-4">Each POSYA product is handcrafted in small batches to ensure purity and freshness. For hygiene and safety, we maintain a strict yet fair policy.</p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#0d3b2e' }}>Returns</h2>
            <p className="mb-3">Returns are accepted only if:</p>
            <ul className="list-disc ml-5 space-y-2 mb-3">
              <li>You received the wrong item, or</li>
              <li>The product was damaged, defective, or leaked upon arrival.</li>
            </ul>
            <p>Kindly raise your concern within 48 hours of delivery at <a href="mailto:posyaorganics@gmail.com" className="font-medium underline" style={{ color: '#0d3b2e' }}>posyaorganics@gmail.com</a>, attaching your order number and product images/video. Returned items must be unused, sealed, and in their original packaging.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#0d3b2e' }}>Refunds</h2>
            <p className="mb-2">Once approved, refunds are processed within 5–7 business days to the original payment method. For COD orders, refunds will be made via bank transfer.</p>
            <p className="text-gray-600">Refunds are not applicable for used products, late claims, or purchases made during sales or promotional periods.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#0d3b2e' }}>Exchanges</h2>
            <p>Exchanges are offered only for damaged or incorrect items reported within 48 hours of delivery. Variations in texture, color, or fragrance due to natural ingredients do not qualify for exchange.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#0d3b2e' }}>Cancellations</h2>
            <p>Orders may be cancelled within 6 hours of placement, provided they have not been shipped. Post-dispatch, cancellations will not be accepted. To cancel, contact <a href="mailto:posyaorganics@gmail.com" className="font-medium underline" style={{ color: '#0d3b2e' }}>posyaorganics@gmail.com</a> with your order details.</p>
          </section>

          <section className="bg-gray-50 rounded-xl p-6 mt-10">
            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#0d3b2e' }}>Contact Us</h2>
            <p className="mb-2">For any queries or assistance, please reach out to:</p>
            <p className="mb-1">📧 <a href="mailto:posyaorganics@gmail.com" className="font-medium underline" style={{ color: '#0d3b2e' }}>posyaorganics@gmail.com</a></p>
            <p>🕐 Monday – Saturday | 10 AM – 6 PM (IST)</p>
          </section>
        </main>
      </div>
    </div>
  );
}