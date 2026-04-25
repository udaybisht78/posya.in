"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const BASE_URL   = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN;

interface Post {
  id: number;
  title: string;
  slug: string;
  featured_image?: string;
  created_at: string;
  is_premium?: boolean;
}

interface Props {
  categoryId: number;
}

export default function PostsByCategory({ categoryId }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${BASE_URL}categories/${categoryId}/posts`);
        const data = await res.json();
        if (data.status) setPosts(data.posts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [categoryId]);

  if (loading) return <p className="text-center py-4">Loading posts...</p>;
  if (posts.length === 0) return <p className="text-gray-500 text-center py-4">No posts in this category.</p>;

  return (
    <div className="mt-8 space-y-6 mb-4">
      <h3 className="text-2xl font-bold mb-4">Related Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`relative overflow-hidden rounded-lg shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg ${
              post.is_premium ? "bg-yellow-50" : "bg-white"
            }`}
          >
            {/* Post Image */}
            <Link href={`/blog/${post.slug}`} className="block relative w-full h-48 overflow-hidden">
              <Image
                src={
                  post.featured_image
                    ? post.featured_image.startsWith("http")
                      ? post.featured_image
                      : `${DOMAIN_URL}uploads/posts/${post.featured_image}`
                    : "/images/default.jpg"
                }
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
              />
            </Link>

            {/* Date Box */}
            <div className="absolute top-2 left-2 bg-green-900 text-white px-3 py-1 rounded-lg text-sm shadow-md z-10">
              {new Date(post.created_at).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
            </div>

            {/* Post Content */}
            <div className="p-4">
              <Link href={`/blog/${post.slug}`}>
                <h4 className="font-semibold text-lg mb-2 hover:text-green-800 transition">
                  {post.title}
                </h4>
              </Link>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-block px-4 py-2 bg-green-900 text-white rounded-full hover:bg-green-800 transition"
              >
                Read More..
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
