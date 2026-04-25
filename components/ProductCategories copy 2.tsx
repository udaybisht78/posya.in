"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopHeading from "./TopHeading";
import SectionLoader from "./SectionLoader";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProductCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    return (
      <p className="text-center py-8 text-gray-500 text-lg">
        No categories found
      </p>
    );
  }

  const goToShop = (categoryName: string) => {
    router.push(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  const [first, featured, ...rest] = categories;

  return (
    <section className="bg-white py-12 px-4 md:px-12 padd-bottom">
      <TopHeading heading="Discover Our Essentials" />

      <div className="flex gap-4 items-stretch max-w-6xl mx-auto">

        {/* Left small card */}
        {first && (
          <div
            onClick={() => goToShop(first.categoryName)}
            className="relative flex-1 min-w-0 rounded-2xl overflow-hidden cursor-pointer group"
            style={{ minHeight: "320px" }}
          >
            <Image
              src={first.image_url}
              alt={first.categoryName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <h3 className="text-white text-2xl font-bold leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                {first.categoryName}
              </h3>
            </div>
          </div>
        )}

        {/* Featured center card (wider) */}
        {featured && (
          <div
            onClick={() => goToShop(featured.categoryName)}
            className="relative flex-[2] min-w-0 rounded-2xl overflow-hidden cursor-pointer group"
            style={{ minHeight: "320px" }}
          >
            <Image
              src={featured.image_url}
              alt={featured.categoryName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/30" />

            {/* Centered content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-6">
              <h3 className="text-white text-3xl font-bold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {featured.categoryName}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToShop(featured.categoryName);
                }}
                className="flex items-center gap-3 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors duration-200"
                style={{ backgroundColor: "var(--theme-color, #b8860b)" }}
                onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
              >
                Shop Now
                <span className="bg-white rounded-full w-7 h-7 flex items-center justify-center text-base font-bold" style={{ color: "var(--theme-color, #b8860b)" }}>
                  →
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Right small card(s) */}
        {rest.length > 0 && (
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            {rest.map((category) => (
              <div
                key={category.id}
                onClick={() => goToShop(category.categoryName)}
                className="relative flex-1 min-w-0 rounded-2xl overflow-hidden cursor-pointer group"
                style={{ minHeight: "148px" }}
              >
                <Image
                  src={category.image_url}
                  alt={category.categoryName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="text-white text-xl font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                    {category.categoryName}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}