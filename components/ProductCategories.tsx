"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopHeading from "./TopHeading";
import SectionLoader from "./SectionLoader";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProductCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1); // center card starts at index 1
  const router = useRouter();

  useEffect(() => {
    fetch(`${BASE_URL}categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) setCategories(data.categories);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SectionLoader count={3} shape="circle" />;

  if (categories.length === 0) {
    return <p className="text-center py-8 text-gray-500 text-lg">No categories found</p>;
  }

  const goToShop = (categoryName: string) => {
    router.push(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  const prev = () => setActiveIndex((i) => (i - 1 + categories.length) % categories.length);
  const next = () => setActiveIndex((i) => (i + 1) % categories.length);

  // Get visible indices: left, center, right
  const leftIdx = (activeIndex - 1 + categories.length) % categories.length;
  const centerIdx = activeIndex;
  const rightIdx = (activeIndex + 1) % categories.length;

  const visibleCards = [
    { cat: categories[leftIdx], pos: "left" },
    { cat: categories[centerIdx], pos: "center" },
    { cat: categories[rightIdx], pos: "right" },
  ];

  return (
    <section className="bg-white py-12 px-4 md:px-12">
      <TopHeading heading="Discover Our Essentials" />

      <div className="cat-slider-wrap">

        {/* Prev button */}
        <button className="cat-slider-btn cat-slider-btn--left" onClick={prev} aria-label="Previous">
          <ChevronLeft size={22} />
        </button>

        {/* Cards track */}
        <div className="cat-slider-track">
          {visibleCards.map(({ cat, pos }) => (
            <div
              key={`${cat.id}-${pos}`}
              onClick={() => pos === "center" ? goToShop(cat.categoryName) : (pos === "left" ? prev() : next())}
              className={`cat-card cat-card--${pos}`}
            >
              <Image
                src={cat.image_url}
                alt={cat.categoryName}
                fill
                className="object-cover cat-card-img"
              />
              {/* Dark overlay */}
              <div className="cat-card-overlay" />

              {/* Label */}
              <div className="cat-card-label">
                <h3 className="cat-card-name">{cat.categoryName}</h3>
                {pos === "center" && (
                  <button
                    className="cat-card-shop-btn"
                    onClick={(e) => { e.stopPropagation(); goToShop(cat.categoryName); }}
                  >
                    Shop Now →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Next button */}
        <button className="cat-slider-btn cat-slider-btn--right" onClick={next} aria-label="Next">
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Dots */}
      <div className="cat-dots">
        {categories.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`cat-dot ${i === activeIndex ? "cat-dot--active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}