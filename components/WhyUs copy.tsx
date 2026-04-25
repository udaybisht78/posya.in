"use client";

import { motion } from "framer-motion";
import { Leaf, Award, Heart, Shield } from "lucide-react";

export default function OrganicProducts() {
  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "100% Organic",
      description: "Pure Himalayan ingredients"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Certified Quality",
      description: "Tested & authenticated"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Made with Love",
      description: "Traditional methods"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safe & Natural",
      description: "No chemicals added"
    }
  ];

  return (
    <section className="relative w-full py-20 bg-[#0d3b2e] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Image with Overlay Card */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/certified-organic.jpg"
                alt="Organic Products"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Floating Badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                viewport={{ once: true }}
                className="absolute top-8 right-8 bg-white rounded-full p-6 shadow-xl"
              >
                <div className="text-center">
                  <Leaf className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-emerald-800">CERTIFIED</p>
                  <p className="text-xs text-gray-600">ORGANIC</p>
                </div>
              </motion.div>

              {/* Bottom Info Card */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
                className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
              >
                <p className="text-sm text-emerald-600 font-semibold mb-1">EST. 2020</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Born in the Himalayas, crafted with passion
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-emerald-400 font-semibold tracking-wider uppercase text-sm mb-3"
              >
                Why Choose Us?
              </motion.p>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold text-white leading-tight"
              >
                Pure Himalayan Organic Products
                <span className="block text-emerald-400">Organic Products</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="text-gray-300 text-lg leading-relaxed"
            >
              The year 2020 was a game changer for everyone. For me, it was the chance to build my dreams in the high mountains of the Himalayas. A journey that began with passion and continues with purity…
            </motion.p>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow-lg hover:shadow-2xl hover:bg-white/15 transition-all duration-300 border border-white/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-400/20 p-2 rounded-lg text-emerald-400">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              viewport={{ once: true }}
            >
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}