"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Tag, ArrowRight } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN;

interface Post {
  id: number;
  title: string;
  slug: string;
  description?: string;
  featured_image?: string;
  created_at?: string;
  category?: string;
}

export default function BlogListing() {
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

  const formatDate = (dateString?: string): string => {
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
    <div className="min-h-screen" style={{ background: "#f2eee9" }}>

      {/* Hero */}
      <section
        className="relative w-full bg-cover bg-center bg-no-repeat text-white py-24"
        style={{ backgroundImage: "url('/images/naturalBgImage.webp')" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(43,26,6,0.72)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#cb8836" }}>
            Stories & Insights
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Our Blog
          </h1>
          <p className="text-base md:text-lg text-white/80">
            Nature, wellness and the Posya way of life.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center mb-12">
          <p className="blog-eyebrow">Latest Posts</p>
          <h2 className="blog-section-heading">From Our Journal</h2>
        </div>

        {loading ? (
          /* Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="blog-card animate-pulse">
                <div className="blog-card-img-wrap bg-gray-200" />
                <div className="blog-card-body">
                  <div className="h-4 w-1/3 bg-gray-200 rounded mb-3" />
                  <div className="h-5 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded mb-4" />
                  <div className="h-3 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-5/6 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center py-16" style={{ color: "#a89070" }}>No posts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                viewport={{ once: true }}
                className="blog-card group"
              >
                {/* Image */}
                <a href={`/blog/${post.slug}`} className="blog-card-img-wrap">
                  <Image
                    src={getImageUrl(post.featured_image)}
                    alt={post.title || "Post Image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category badge */}
                  {post.category && (
                    <span className="blog-card-badge">{post.category}</span>
                  )}
                </a>

                {/* Body */}
                <div className="blog-card-body">
                  {/* Meta */}
                  <div className="blog-card-meta">
                    <span className="blog-card-meta-item">
                      <CalendarDays size={13} />
                      {formatDate(post.created_at)}
                    </span>
                    {post.category && (
                      <span className="blog-card-meta-item">
                        <Tag size={13} />
                        {post.category}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <a href={`/blog/${post.slug}`}>
                    <h2 className="blog-card-title">{post.title}</h2>
                  </a>

                  {/* Description */}
                  <p className="blog-card-desc">
                    {post.description || "Read more about this topic..."}
                  </p>

                  {/* Read more */}
                  <a href={`/blog/${post.slug}`} className="blog-read-more">
                    Read More <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && lastPage > 1 && (
          <div className="blog-pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`blog-page-btn ${currentPage === 1 ? "blog-page-btn--disabled" : "blog-page-btn--active"}`}
            >
              ← Previous
            </button>

            <span className="blog-page-info">
              Page <strong>{currentPage}</strong> of <strong>{lastPage}</strong>
            </span>

            <button
              disabled={currentPage === lastPage}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`blog-page-btn ${currentPage === lastPage ? "blog-page-btn--disabled" : "blog-page-btn--active"}`}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}