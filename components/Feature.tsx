"use client";

import { HeartPulse, FlaskConical, Leaf, Wheat } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    { icon: <HeartPulse size={36} />, title: "Better Health" },
    { icon: <FlaskConical size={36} />, title: "No Chemicals" },
    { icon: <Leaf size={36} />, title: "Eco Friendly" },
    { icon: <Wheat size={36} />, title: "Nutrient Rich" },
  ];

  return (
    <section className="relative py-20">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/naturalBgImage.webp')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="text-green-800">{item.icon}</div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
