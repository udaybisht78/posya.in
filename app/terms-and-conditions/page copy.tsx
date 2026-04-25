"use client";


import React from 'react';
import Link from 'next/link';


export default function TermsConditionsPage() {
return (
<div className="min-h-screen py-10 px-4" style={{ backgroundColor: '#fcf9f2' }}>
<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
<div className="mb-8">
<h1 className="text-4xl font-bold" style={{ color: '#0d3b2e' }}>Terms & Conditions</h1>
<p className="text-sm text-gray-500">Last updated: November 5, 2025</p>
</div>
<main className="text-gray-800 leading-relaxed space-y-6">
<section>
<h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>1. Products & Orders</h2>
<p>All our products are crafted traditionally; natural variations are normal. We reserve the right to cancel or modify orders due to stock or pricing errors.</p>
</section>


<section>
<h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>2. Shipping</h2>
<p>We dispatch orders through reliable couriers. Delivery timelines depend on your location and courier availability.</p>
</section>


<section>
<h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>3. Payment</h2>
<p>All payments are securely processed via trusted gateways. We do not store your payment card information.</p>
</section>


<section>
<h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>4. Intellectual Property</h2>
<p>All content and imagery on the Posya platform are owned by Posya. Unauthorized use of any material is prohibited.</p>
</section>


<section>
<h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d3b2e' }}>5. Governing Law</h2>
<p>These terms are governed by the laws of India. Any disputes shall be handled in competent courts within India.</p>
</section>

</main>
</div>
</div>
);
}