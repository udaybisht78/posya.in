"use client";

import { Instagram, Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import PosysLogo from "../public/images/12.png";
import Image from "next/image";

export default function Footer() {
  return (
    <footer style={{ background: "#2b1a06" }} className="relative text-gray-300 overflow-hidden">

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Col 1 — Quick Links */}
          <div>
            <h3 className="footer-col-heading">Quick Links</h3>
            <ul className="footer-link-list">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/shop">Shop Now</Link></li>
              <li><Link href="/our-story">About Us</Link></li>
              <li><Link href="/blog">Blogs</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 2 — Customer */}
          {/* <div>
            <h3 className="footer-col-heading">Customer</h3>
            <ul className="footer-link-list">
              <li><Link href="/dashboard">My Profile</Link></li>
              <li><Link href="/dashboard">My Orders</Link></li>
              <li><Link href="/cart">My Cart</Link></li>
              <li><Link href="/track-order">Track My Orders</Link></li>
              <li><Link href="/login">Log In</Link></li>
            </ul>
          </div> */}

          {/* Col 2 — Support */}
          <div>
            <h3 className="footer-col-heading">Support</h3>
            <ul className="footer-link-list">
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link href="/faqs">FAQ's</Link></li>
              <li><Link href="/refund-policy">Refund Policy</Link></li>
              <li><Link href="/shipping-policy">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Col 3 — Quick Links */}
          <div>
            <Link href="/">
              <Image
                src={PosysLogo}
                alt="Posya Logo"
                width={120}
                height={40}
                className="transition-all duration-300"
              />
            </Link>
          </div>

          {/* Col 4 — Get in Touch */}
          <div>
            <h3 className="footer-col-heading">Get in Touch</h3>
            <ul className="footer-contact-list">
              <li>
                <Mail className="footer-contact-icon" />
                <Link href="mailto:support@posya.in">support@posya.in</Link>
              </li>
              <li>
                <Phone className="footer-contact-icon" />
                <Link href="tel:+919919917516">+91 9919917516</Link>
              </li>
              <li>
                <MapPin className="footer-contact-icon" />
                <Link href="https://maps.app.goo.gl/rAuUKFz1FuJG8Lo37" target="_blank">
                  Vistapith, Rishikesh, Dehradun, UK.
                </Link>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="footer-socials">
              <Link href="#" aria-label="Instagram"><Instagram size={18} /></Link>
              <Link href="#" aria-label="Facebook"><Facebook size={18} /></Link>
              <Link href="#" aria-label="Twitter"><Twitter size={18} /></Link>
              <Link href="#" aria-label="LinkedIn"><Linkedin size={18} /></Link>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Posya ® All Rights Reserved.</span>
          <span className="footer-bottom-sep">|</span>
          <span>
            Powered by{" "}
            <Link href="https://techsupportindia.com" target="_blank" rel="noopener noreferrer" className="footer-bottom-link">
              TSI - Tech Support India
            </Link>
          </span>
        </div>
      </div>

      {/* Big brand name at bottom — Ranavat style */}
      <div className="footer-brand-name" aria-hidden="true">
        POSYA
      </div>

    </footer>
  );
}