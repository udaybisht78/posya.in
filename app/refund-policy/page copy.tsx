"use client";

import React from 'react';
import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: '#fcf9f2' }}>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{ color: '#0d3b2e' }}>Refund & Returns Policy</h1>
          <p className="text-sm text-gray-500">Updated: November 5, 2025</p>
        </div>

        <main className="text-gray-800 leading-relaxed space-y-6">
          <section>
            <p>If your product is damaged or incorrect, contact us within 48 hours of delivery with photos of the item. Eligible claims will be processed promptly.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>Conditions for Refund</h2>
            <ul className="list-disc ml-5 space-y-2">
              <li>Opened or perishable items are non-returnable unless defective</li>
              <li>Refunds will be issued to the original payment method</li>
              <li>Processing times: 7–10 business days after approval</li>
            </ul>
          </section>

          <section>
            <p>For assistance, contact: <a href="mailto:help@posya.in" className="font-medium" style={{ color: '#0d3b2e' }}>help@posya.in</a></p>
          </section>
        </main>
      </div>
    </div>
  );
}
