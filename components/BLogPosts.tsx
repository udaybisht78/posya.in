"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TopHeading from "./TopHeading";
import { useEffect, useState } from "react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function BlogSection() {
  const [posts, setPosts] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any>(null);

  useEffect(() => {
    fetch(`${BASE_URL}home-posts`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.posts.length) {
          setFeatured(data.posts[0]);
          setPosts(data.posts.slice(1));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (!featured) return <p className="text-center py-20">Loading posts...</p>;

  const formatDate = (dateString: string) => {
    const options = { year: "numeric", month: "short", day: "numeric" } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section className="relative py-20 bg-[url('/images/texture-bg.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-white/70" />
      <div className="relative z-10 max-w-[1150px] mx-auto px-6">
        <div className="text-center mb-12">
          <TopHeading heading="Our Latest Articles" />
          <p className="text-gray-700">
            Read our recent blogs to know more about organic products and why people choose them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Featured Post */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition"
          >
            <Link href={`/blog/${featured.slug}`} className="block relative w-full h-80">
              <Image
                src={featured.featured_image || "/images/b1.jpg"}
                alt={featured.title}
                fill
                className="object-cover"
              />
            </Link>
            <div className="p-6 flex flex-col justify-between h-[200px]">
              <Link href={`/blog/${featured.slug}`}>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 hover:text-green-900">
                  {featured.title}
                </h3>
              </Link>
              <p className="text-gray-600 line-clamp-3">{featured.description || "No description"}</p>
              <div className="flex items-center justify-between">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="px-6 py-2 text-sm bg-green-900 text-white rounded-full hover:bg-green-800 transition"
                >
                  Continue Reading...
                </Link>
                <div className="flex items-center text-sm text-gray-600 gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(featured.created_at)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Post List */}
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4 bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden"
              >
                <Link href={`/blog/${post.slug}`} className="relative w-28 h-24 flex-shrink-0">
                  <Image
                    src={post.featured_image || "/images/b2.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-col justify-between p-3">
                  <Link href={`/blog/${post.slug}`}>
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-green-900">
                      {post.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-1">{post.description || "No description"}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}