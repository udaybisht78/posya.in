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
    <div className="min-h-screen bg-gradient-to-r from-[#0d3b2e]/10 to-[#0d3b2e]/30 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Column: Form */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 p-10 bg-[#0d3b2e] text-white relative"
        >
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="mb-8 text-[#a0d8b2]">
            Have a question or want to collaborate? Fill out the form and we'll respond promptly.
          </p>

          {submitted && (
            <div className="bg-green-100 text-green-800 p-3 rounded mb-6 text-center text-sm text-black">
              Thank you! Your message has been sent.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {["name", "email"].map((field) => (
              <div key={field} className="relative z-0 w-full">
                <motion.input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  whileFocus={{ scale: 1.02 }}
                  className="peer block w-full px-3 pt-5 pb-2 text-white placeholder-transparent border-b-2 border-[#a0d8b2] focus:outline-none focus:border-[#0d3b2e] bg-transparent transition-all duration-300"
                />
                <label className="absolute left-3 top-2 text-[#a0d8b2] text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-white peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-[#0d3b2e] peer-focus:text-sm">
                  {field === "name" ? "Full Name" : "Email Address"}
                </label>
              </div>
            ))}

            <div className="relative z-0 w-full">
              <motion.textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder=" "
                required
                rows={5}
                whileFocus={{ scale: 1.02 }}
                className="peer block w-full px-3 pt-5 pb-2 text-white placeholder-transparent border-b-2 border-[#a0d8b2] focus:outline-none focus:border-[#0d3b2e] bg-transparent resize-none transition-all duration-300"
              ></motion.textarea>
              <label className="absolute left-3 top-2 text-[#a0d8b2] text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-white peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-[#0d3b2e] peer-focus:text-sm">
                Your Message
              </label>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.3)" }}
              className="w-full bg-[#a0d8b2] text-[#0d3b2e] font-bold py-3 rounded-lg hover:bg-white hover:text-[#0d3b2e] transition duration-300 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-[#0d3b2e]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : null}
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>

          <div className="mt-10 flex gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2, y: -3 }}
                className="text-white cursor-pointer hover:text-[#a0d8b2] transition duration-300"
              >
                <Icon className="w-6 h-6" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Contact Info + Map */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 p-10 bg-gray-50 flex flex-col justify-center"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Contact Info</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>support@posya.in</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>+91 9919917516</p>
            </div>
            <div>
              <h3 className="font-semibold">Address</h3>
              <p>Rishikesh Dehradun, Uttarakhand, India</p>
            </div>
          </div>

          <motion.div
            className="mt-8 h-64 w-full rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3496.123456789!2d78.0421!3d30.3165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39090123456789%3A0xabcdef123456!2sDehradun%2C+Uttarakhand!5e0!3m2!1sen!2sin!4v1698555555555!5m2!1sen!2sin"
              loading="lazy"
              title="Google Maps"
            ></iframe>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}