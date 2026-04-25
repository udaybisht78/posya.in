"use client";

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: '#fcf9f2' }}>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{ color: '#0d3b2e' }}>Privacy Policy</h1>
           <p className="text-sm text-gray-500">Last updated: November 5, 2025</p>
        </div>
        <main className="text-gray-800 leading-relaxed space-y-6">
          <p>At Posya, we collect your personal information to provide a seamless shopping experience, improve our services, and ensure your data is protected.</p>

          <section>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>Information We Collect</h2>
            <ul className="list-disc ml-5 space-y-2">
              <li>Personal info during checkout or account creation (name, contact, address)</li>
              <li>Payment details securely via third-party gateways</li>
              <li>Device & usage data for analytics and experience improvement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>How We Use Information</h2>
            <p>We use your data to process orders, communicate about your purchases, personalize offers, and comply with legal obligations. We never sell your personal information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>Cookies & Tracking</h2>
            <p>We use cookies for essential functionality, analytics, and marketing purposes. You can manage cookie preferences in your browser settings.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>Third-Party Services</h2>
            <p>We share data with trusted service providers (payment processors, shipping companies, analytics) only as required to fulfill orders and improve operations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>Data Security</h2>
            <p>We implement reasonable security measures to protect your data. However, no method of transmission over the internet is 100% secure. Please exercise caution when sharing sensitive information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>Your Rights</h2>
            <p>You may access, correct, or request deletion of your personal data. Contact us at <a href="mailto:help@posya.in" className="font-medium" style={{ color: '#0d3b2e' }}>help@posya.in</a> for any inquiries.</p>
          </section>
        </main>
      </div>
    </div>
  );
}