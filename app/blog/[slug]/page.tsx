"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CalendarDays, Tag, MessageCircle, Send } from "lucide-react";
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
  const [submitting, setSubmitting] = useState(false);

  const params = useParams();
  const slug = params?.slug;

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      try {
        const res = await fetch(`${BASE_URL}posts/${slug}`);
        const data = await res.json();
        if (data.status) { setPost(data.post); fetchComments(data.post.id); }
      } catch (error) { console.error("Error fetching post:", error); }
      finally { setLoading(false); }
    };
    fetchPost();
  }, [slug]);

  const fetchComments = async (postId: number) => {
    try {
      const res = await fetch(`${BASE_URL}posts/${postId}/comments`);
      const data = await res.json();
      if (data.status) setComments(data.comments);
    } catch (error) { console.error("Error fetching comments:", error); }
  };

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post?.id) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName || undefined, email: guestEmail || undefined, comment: newComment }),
      });
      const data = await res.json();
      if (data.status) {
        setComments([data.comment, ...comments]);
        setNewComment(""); setGuestName(""); setGuestEmail("");
      }
    } catch (error) { console.error("Failed to add comment:", error); }
    finally { setSubmitting(false); }
  };

  const getImageUrl = (image?: string) => {
    if (!image) return "/images/default.jpg";
    return image.startsWith("http") ? image : `${DOMAIN_URL}uploads/posts/${image}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  if (loading) return (
    <div className="blogd-loading-page">
      <div className="blogd-spinner" />
      <p>Loading article...</p>
    </div>
  );

  if (!post) return (
    <div className="blogd-loading-page">
      <p style={{ color: "#a89070" }}>Post not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#f2eee9" }}>

      {/* Hero banner */}
      {post.featured_image && (
        <div className="blogd-hero-img">
          <Image src={getImageUrl(post.featured_image)} alt={post.title || "Post"} fill className="object-cover" priority />
          <div className="blogd-hero-overlay" />
          <div className="blogd-hero-meta">
            {post.category?.categoryName && <span className="blogd-hero-badge">{post.category.categoryName}</span>}
          </div>
        </div>
      )}

      {/* Single centered column */}
      <div className="blogd-container">

        {/* Article */}
        <article className="blogd-article">
          <div className="blogd-title-block">
            <h1 className="blogd-title">{post.title}</h1>
            <div className="blogd-meta-row">
              <span className="blogd-meta-item"><CalendarDays size={14} />{formatDate(post.created_at)}</span>
              {post.category?.categoryName && (
                <span className="blogd-meta-item"><Tag size={14} />{post.category.categoryName}</span>
              )}
              <span className="blogd-meta-item">
                <MessageCircle size={14} />{comments.length} Comment{comments.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="blogd-divider" />
          <div className="blogd-content prose" dangerouslySetInnerHTML={{ __html: post.postContent || post.description }} />
        </article>

        {/* Comment Form */}
        <div className="blogd-section">
          <p className="blogd-section-eyebrow">Join the Conversation</p>
          <h2 className="blogd-section-heading">Leave a Comment</h2>
          <form onSubmit={addComment} className="blogd-comment-form">
            <div className="blogd-form-row">
              <div className="blogd-field">
                <input type="text" placeholder=" " id="c-name" value={guestName}
                  onChange={(e) => setGuestName(e.target.value)} className="blogd-input peer" />
                <label htmlFor="c-name" className="blogd-label">Your Name</label>
              </div>
              <div className="blogd-field">
                <input type="email" placeholder=" " id="c-email" value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)} className="blogd-input peer" />
                <label htmlFor="c-email" className="blogd-label">Email Address</label>
              </div>
            </div>
            <div className="blogd-field">
              <textarea placeholder=" " id="c-comment" rows={4} value={newComment}
                onChange={(e) => setNewComment(e.target.value)} required
                className="blogd-input blogd-textarea peer" />
              <label htmlFor="c-comment" className="blogd-label">Your Comment</label>
            </div>
            <button type="submit" className="blogd-submit-btn" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2"><Send size={15} /> Post Comment</span>
              )}
            </button>
          </form>
        </div>

        {/* Comments List */}
        <div className="blogd-section">
          <p className="blogd-section-eyebrow">Discussion</p>
          <h2 className="blogd-section-heading">Comments ({comments.length})</h2>
          {comments.length === 0 ? (
            <p className="blogd-no-comments">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            <div className="blogd-comments-list">
              {comments.map((c) => (
                <div key={c.id} className="blogd-comment">
                  <div className="blogd-comment-avatar">{c.name ? c.name.charAt(0).toUpperCase() : "G"}</div>
                  <div className="blogd-comment-body">
                    <div className="blogd-comment-header">
                      <span className="blogd-comment-name">{c.name || "Guest"}</span>
                      {c.created_at && <span className="blogd-comment-date">{new Date(c.created_at).toLocaleDateString()}</span>}
                    </div>
                    <p className="blogd-comment-text">{c.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Related Posts — below comments, horizontal scroll ── */}
        {/* <div className="blogd-related-section">
          <div className="blogd-related-scroll">
            <PostsByCategory categoryId={post.catId} />
          </div>
        </div> */}

        {/* ── Related Products — below related posts ── */}
        {/* <div className="blogd-related-section">
          <div className="blogd-related-scroll">
            <ProductsByCategory categoryId={post.catId} />
          </div>
        </div> */}

      </div>
    </div>
  );
}