"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import PostsByCategory from "@/components/PostsByCategory";
import ProductsByCategory from "@/components/ProductsByCategory"; 

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN;



export default function BlogPostPage() {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const params = useParams();
  const slug = params?.slug;


  // Fetch post
  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`${BASE_URL}posts/${slug}`);
        const data = await res.json();
        if (data.status) {
          setPost(data.post);
          fetchComments(data.post.id);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  // Fetch comments by post ID
  const fetchComments = async (postId: number) => {
    try {
      const res = await fetch(`${BASE_URL}posts/${postId}/comments`);
      const data = await res.json();
      if (data.status) setComments(data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Add comment
  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post?.id) return;

    const payload = {
      name: guestName || undefined,
      email: guestEmail || undefined,
      comment: newComment,
    };

    try {
      const res = await fetch(`${BASE_URL}posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status) {
        setComments([data.comment, ...comments]);
        setNewComment("");
        setGuestName("");
        setGuestEmail("");
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const getImageUrl = (image: string | undefined) => {
    if (!image) return "/images/default.jpg";
    return image.startsWith("http") ? image : `${DOMAIN_URL}uploads/posts/${image}`;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!post) return <p className="text-center py-20">Post not found</p>;

  return (
    <div className="py-10 bg-gray-50">
      <div className="container mx-auto px-6 grid grid-cols-12 justify-center">
        <div className="col-span-12 md:col-span-12 bg-white rounded-xl shadow-lg p-6 space-y-6">
          {post.featured_image && (
            <div className="relative w-full h-auto mb-4">
              <Image
                src={getImageUrl(post.featured_image)}
                alt={post.title || "Post Image"}
                width={850}
                height={400}
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="text-sm text-gray-500 mb-4 flex gap-4">
            <span>Last Updated: {formatDate(post.created_at)}</span>
            <span>Category: {post.category?.categoryName || "Uncategorized"}</span>
          </div>

          <div
            className="prose max-w-full"
            dangerouslySetInnerHTML={{ __html: post.postContent || post.description }}
          />

          {/* Comment Form */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Leave a Comment</h2>
            <form className="space-y-4" onSubmit={addComment}>
              <input
                type="text"
                placeholder="Name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-700"
              />
              <input
                type="email"
                placeholder="Email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-700"
              />
              <textarea
                placeholder="Comment"
                rows={5}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-700"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-green-900 text-white rounded-full hover:bg-green-800 transition"
              >
                Leave a Comment
              </button>
            </form>
          </div>

          {/* Display Comments */}
            
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

          {comments.length === 0 && (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          )}

          <div className="space-y-4">
            {comments.map((c) => (
              <div
                key={c.id}
                className="flex flex-col md:flex-row items-start md:items-center border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
              >
                {/* User Avatar */}
                <div className="w-12 h-12 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-lg mr-4  commentUser">
                  {c.name ? c.name.charAt(0).toUpperCase() : "G"}
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800 cName">{c.name || "Guest"}</span>
                    {c.created_at && (
                      <span className="text-xs text-gray-400">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700">{c.comment} </p>
                </div>
              </div>
            ))}
          </div>
        </div>  
        <div className="mt-4 mb-4">
          <PostsByCategory categoryId={post.catId} />
          <ProductsByCategory categoryId={post.catId} />
        </div>
        </div>
      </div>
    </div>
  );
}
