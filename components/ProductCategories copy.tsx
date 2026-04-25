"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopHeading from "./TopHeading";
import SectionLoader from "./SectionLoader";

const BASE_URL   = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN;



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
    return <p className="text-center py-8 text-gray-500 text-lg">No categories found</p>;
  }

  const goToShop = (categoryName: string) => {
    // Redirect to /shop with query param for selected category
    router.push(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="bg-[#F2EEE9] py-12 px-4 md:px-12">
      <TopHeading heading="Discover Our Essentials" />

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => goToShop(category.categoryName)}
              className="relative group w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full overflow-hidden shadow-lg border-4 border-gray-200 transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              {/* Image */}
              <Image
                src={category.image_url}
                alt={category.categoryName}
                fill
                className="object-cover w-full h-full"
              />

              {/* Default overlay */}
              <div className="absolute inset-0 bg-black/40 rounded-full"></div>

              {/* Centered Name */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white text-lg sm:text-2xl font-semibold text-center categoryNameButton">
                  {category.categoryName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
