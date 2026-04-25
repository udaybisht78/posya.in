"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setSubmitted(true);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      toast.error("Failed to send message. Try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
            Reach Out
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Get in Touch
          </h1>
          <p className="text-base md:text-lg text-white/80">
            Have a question or want to collaborate? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── Left: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="contact-form-card"
          >
            <p className="contact-eyebrow">Send a Message</p>
            <h2 className="contact-heading">We'll respond promptly.</h2>

            {submitted && (
              <div className="contact-success">
                ✓ Thank you! Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-field">
                <input
                  type="text"
                  name="name"
                  id="contact-name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  className="contact-input peer"
                />
                <label htmlFor="contact-name" className="contact-label">Full Name</label>
              </div>

              <div className="contact-field">
                <input
                  type="email"
                  name="email"
                  id="contact-email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  className="contact-input peer"
                />
                <label htmlFor="contact-email" className="contact-label">Email Address</label>
              </div>

              <div className="contact-field">
                <textarea
                  name="message"
                  id="contact-message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  rows={5}
                  className="contact-input contact-textarea peer"
                ></textarea>
                <label htmlFor="contact-message" className="contact-label">Your Message</label>
              </div>

              <button type="submit" className="contact-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending...
                  </span>
                ) : "Send Message →"}
              </button>
            </form>

            {/* Socials */}
            <div className="contact-socials">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="contact-social-btn" aria-label="social">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Info + Map ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-5"
          >
            {[
              { icon: <Mail size={20} />, label: "Email Us", value: "support@posya.in", href: "mailto:support@posya.in" },
              { icon: <Phone size={20} />, label: "Call Us", value: "+91 9919917516", href: "tel:+919919917516" },
              { icon: <MapPin size={20} />, label: "Visit Us", value: "Vistapith, Rishikesh, Dehradun, Uttarakhand, India", href: "https://maps.app.goo.gl/rAuUKFz1FuJG8Lo37" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={i === 2 ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="contact-info-card"
              >
                <div className="contact-info-icon">{item.icon}</div>
                <div>
                  <p className="contact-info-label">{item.label}</p>
                  <p className="contact-info-value">{item.value}</p>
                </div>
              </a>
            ))}

            {/* Map */}
            <div className="contact-map-wrap">
              <iframe
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3496.123456789!2d78.0421!3d30.3165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39090123456789%3A0xabcdef123456!2sDehradun%2C+Uttarakhand!5e0!3m2!1sen!2sin!4v1698555555555!5m2!1sen!2sin"
                loading="lazy"
                title="Google Maps"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}