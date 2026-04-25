"use client";

import { Instagram, Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative primart-bg text-gray-200">
    
      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Column 1 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/shop" className="hover:text-white">Shop Now</Link></li>
            <li><Link href="/our-story" className="hover:text-white">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blogs</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Customer</h3>
          <ul className="space-y-2">
            <li><Link href="/dashboard" className="hover:text-white">My Profile</Link></li>
            <li><Link href="/dashboard" className="hover:text-white">My Orders</Link></li>
            <li><Link href="/cart" className="hover:text-white">My Cart</Link></li>
            <li><Link href="/track-order" className="hover:text-white">Track My Orders</Link></li>
            <li><Link href="/login" className="hover:text-white">Log In</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-white">Terms & Conditions</Link></li>
             <li><Link href="/faqs" className="hover:text-white">FAQ’s</Link></li>
            <li><Link href="/refund-policy" className="hover:text-white">Refund Policy</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-white">Shipping Policy</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
          <div className="flex items-center mb-2 space-x-2">
            <Mail className="w-5 h-5" />
            <Link href="mail-to:support@posya.in" className="text-white">support@posya.in</Link>
          </div>
          <div className="flex items-center mb-2 space-x-2">
            <Phone className="w-5 h-5" />
            <Link href="tel:+91 9919917516" className="text-white">+91 9919917516</Link>
          </div>
          <div className="flex items-center mb-4 space-x-2">
            <MapPin className="w-5 h-5" />
            <Link href="https://maps.app.goo.gl/rAuUKFz1FuJG8Lo37"className="text-white">Vistapith, Rishikesh, Dehradun, UK.</Link>
          </div>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-white"><Instagram /></Link>
            <Link href="#" className="hover:text-white"><Facebook /></Link>
            <Link href="#" className="hover:text-white"><Twitter /></Link>
            <Link href="#" className="hover:text-white"><Linkedin /></Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 flex justify-center items-center py-6 text-sm text-gray-400 gap-2 flex-wrap footerSpan">
          <span>© {new Date().getFullYear()} Posya ® All Rights Reserved.</span>
          <span>|</span>
          <span>
            Design & Develop by{" "}
            <Link               href="https://techsupportindia.com"
              className="hover:text-white underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TSI - Tech Support India
            </Link>
          </span>
        </div>
    </footer>
  );
}
