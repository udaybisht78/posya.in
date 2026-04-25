"use client";

import { motion } from "framer-motion";
import { Leaf, Flower2, Sparkles, TreePine } from "lucide-react";

const pillars = [
  {
    icon: <Flower2 className="w-5 h-5" />,
    title: "Floral Nutrition",
    description: "Purest floral essences woven into nourishing elixirs",
  },
  {
    icon: <Leaf className="w-5 h-5" />,
    title: "Nature's Wisdom",
    description: "Inspired by the gentle hum of bees & dance of petals",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Triveni Heritage",
    description: "Rooted in the sacred trio of Peepal, Banyan & Neem",
  },
  {
    icon: <TreePine className="w-5 h-5" />,
    title: "Interconnectedness",
    description: "Well-being woven into the very fabric of nature",
  },
];

export default function PosyaPhilosophy() {
  return (
    <section className="posya-phil-section">
      <div className="posya-phil-blob posya-phil-blob--tr" />
      <div className="posya-phil-blob posya-phil-blob--bl" />

      <div className="posya-phil-container">
        <div className="posya-phil-grid">

          {/* ── LEFT: Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="posya-phil-left"
          >
            <div className="posya-phil-img-wrap">
              <img
                src="/images/video-thumbnail.jpg"
                alt="Posya Philosophy"
                className="posya-phil-img"
              />
              {/* Dark gradient overlay at bottom */}
              <div className="posya-phil-img-overlay" />

              {/* Floating badge — top right */}
              <div className="posya-phil-badge">
                <Leaf className="w-5 h-5" />
                <span>EST. 2020</span>
              </div>

              {/* Caption strip — bottom */}
              <div className="posya-phil-img-caption">
                <p className="posya-phil-img-caption-label">Born in Nature</p>
                <p className="posya-phil-img-caption-text">
                  Crafted with purity &amp; passion
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Content ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="posya-phil-right"
          >
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="posya-phil-eyebrow"
            >
              Posya Philosophy
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="posya-phil-heading"
            >
              Nature's Wisdom,<br />
              <span className="posya-phil-heading--accent">Rooted in Flowers</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="posya-phil-body"
            >
              Our floral nutrition philosophy is rooted in the belief that
              flowers are more than fragrance — they are delicate nutritional
              ecosystems that hold the power to transform and uplift. With every
              bloom, we honour the intricate ecosystems of nature and the quiet
              strength of the flowers that sustain us.
            </motion.p>

            {/* Pillars grid */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="posya-phil-pillars"
            >
              {pillars.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="posya-phil-pillar"
                >
                  <div className="posya-phil-pillar-icon">{p.icon}</div>
                  <div>
                    <h3 className="posya-phil-pillar-title">{p.title}</h3>
                    <p className="posya-phil-pillar-desc">{p.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}