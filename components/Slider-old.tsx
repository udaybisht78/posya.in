"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function HeroSlider() {
  const slides = [
    {
      image: "/images/b1.jpg",
      title: "Discover Nature’s Beauty with Posya",
      subtitle: "Shop our eco-friendly collection",
    },
    {
       image: "/images/b2.jpg",
      title: 'Embrace Wellness, Embrace Posya',
      subtitle: "Posya provides you a gateway to Vedic Wellness and Organic Harmony.",
    },
  ];

  return (
    <Swiper
      navigation
      autoplay={{ delay: 4000 }}
      loop
      modules={[Navigation, Autoplay]}
      className="w-full h-[80vh]"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div
            className="relative w-full h-[100vh] bg-cover bg-center slider"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
              <h2 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="mt-4 text-lg md:text-2xl drop-shadow-md">
                {slide.subtitle}
              </p>
              <a href="" className="btn mt-5 md:w-50 explore-btn">
                Explore More..
              </a>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}