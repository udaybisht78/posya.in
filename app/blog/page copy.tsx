"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN;


export default function BlogListing() {

interface Post {
  id: number;
  title: string;
  slug: string;
  description?: string;
  featured_image?: string;
  created_at?: string;
  category?: string;
}

const [posts, setPosts] = useState<Post[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}posts?page=${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.posts) {
          setPosts(data.posts.data || data.posts);
          setLastPage(data.posts.last_page || 1);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [currentPage]);

  type FormatDate = (dateString?: string) => string;

  const formatDate: FormatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

const getImageUrl = (image?: string): string => {
  if (!image) return "/images/default.jpg";
  return image.startsWith("http") ? image : `${DOMAIN_URL}/uploads/posts/${image}`;
};



  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-10">All Blog Posts</h1>

        {loading ? (
          <p className="text-center">Loading posts...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={getImageUrl(post.featured_image)}
                    alt={post.title || "Post Image"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                    <a href={`/blog/${post.slug}`} className="hover:text-green-700">
                      {post.title}
                    </a>
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-2">
                    {post.description || "No description"}
                  </p>
                  <div className="text-gray-500 text-xs flex justify-between items-center">
                    <span>{formatDate(post.created_at)}</span>
                    <span>{post.category || "Uncategorized"}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-10 gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-900 text-white hover:bg-green-800"
            }`}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {lastPage}
          </span>
          <button
            disabled={currentPage === lastPage}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === lastPage
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-900 text-white hover:bg-green-800"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}