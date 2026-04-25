"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, ShoppingCart, Star, Loader2, Check, Minus, Plus, Package, Truck, Shield, MapPin, ChevronRight, Play } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import Link from "next/link";
import howToUse from "../public/images/video-thumbnail.jpg";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProductPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 0, comment: "" });
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeReviewTab, setActiveReviewTab] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const fetchProductData = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}products/${slug}`);
      const data = await res.json();
      if (data.status && data.product) {
        setProduct(data.product);
        setSelectedVariation(data.product.variations?.[0] || null);
        setMainImage(data.product.image_url || null);
        try {
          const reviewsRes = await fetch(`${BASE_URL}product/${data.product.id}/reviews`);
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData || []);
        } catch { setReviews([]); }
        try {
          const relRes = await fetch(`${BASE_URL}products?category=${encodeURIComponent(data.product.category_name)}&exclude=${data.product.id}`);
          const relData = await relRes.json();
          if (relData.status && relData.products) setRelatedProducts(relData.products);
        } catch { setRelatedProducts([]); }
      }
    } catch { toast.error("Failed to load product"); }
    setLoading(false);
  };

  const submitReview = async () => {
    if (!reviewForm.name || !reviewForm.rating) { toast.error("Please fill in your name and select a rating."); return; }
    try {
      const res = await fetch(`${BASE_URL}product/reviews`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id, name: reviewForm.name, rating: reviewForm.rating, comment: reviewForm.comment }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Review submitted!");
        setReviewForm({ name: "", rating: 0, comment: "" });
        const reviewsRes = await fetch(`${BASE_URL}product/${product.id}/reviews`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData || []);
        setVisibleReviews(5);
      } else toast.error(data.message || "Something went wrong!");
    } catch { toast.error("Failed to submit review."); }
  };

  const loadMoreReviews = () => {
    setLoadingMoreReviews(true);
    setTimeout(() => { setVisibleReviews(prev => prev + 5); setLoadingMoreReviews(false); }, 500);
  };

  useEffect(() => { fetchProductData(); }, [slug]);

  const handleQuantity = (type: "inc" | "dec") => setQuantity(q => type === "inc" ? q + 1 : Math.max(1, q - 1));

  const calculateAvgRating = () => {
    if (reviews.length === 0) return 0;
    return (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  };

  const checkDelivery = () => {
    if (!postalCode || postalCode.length < 5) return toast.error("Enter a valid postal code");
    setCheckingDelivery(true);
    setTimeout(() => {
      const days = Math.floor(Math.random() * 3) + 3;
      const date = new Date();
      date.setDate(date.getDate() + days);
      setDeliveryInfo({ available: true, days, date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) });
      setCheckingDelivery(false);
      toast.success("Delivery available!");
    }, 1000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !isZoomed) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    setZoomPosition({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (videoPlaying) { videoRef.current.pause(); setVideoPlaying(false); }
    else { videoRef.current.play(); setVideoPlaying(true); }
  };

  if (loading || !product) return (
    <div className="flex justify-center items-center min-h-screen" style={{ background: "#f2eee9" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="pd-spinner" />
        <p style={{ color: "#a89070" }}>Loading product...</p>
      </div>
    </div>
  );

  const isOutOfStock = product.stock <= 0;
  const allImages = [product.image_url, ...(product.all_images || [])].filter(Boolean);

  // How to use steps — dynamic from product or fallback static
  const howToUseSteps = product.how_to_use || [
    { label: "APPLICATION", text: "Apply a small amount to your palm. Gently massage over cleansed face and neck in circular motions." },
    { label: "PAIR WITH", text: "For best results, pair with our natural hydrosols and pure botanical oils." },
    { label: "FOLLOW WITH", text: "Follow with your favourite moisturiser or serum to lock in the goodness." },
  ];

  // Process of making — dynamic or static
  const processSteps = product.process_steps || [
    { title: "Wild Harvest", text: "Petals and herbs are hand-picked at peak bloom from pristine Himalayan meadows, ensuring maximum potency and purity." },
    { title: "Steam Distillation", text: "Traditional copper-pot steam distillation gently coaxes the most delicate aromatic compounds from each botanical." },
    { title: "Cold Settling", text: "The distillate rests undisturbed so essential oils and hydrosol naturally separate — no centrifuges, no shortcuts." },
  ];

  return (
    <main className="min-h-screen" style={{ background: "#f2eee9" }}>

      {/* Breadcrumb */}
      <div className="pd-breadcrumb-bar">
        <nav className="pd-breadcrumb">
          <Link href="/" className="pd-breadcrumb-link">Home</Link>
          <ChevronRight size={13} className="pd-breadcrumb-sep" />
          <Link href="/shop" className="pd-breadcrumb-link">Shop</Link>
          <ChevronRight size={13} className="pd-breadcrumb-sep" />
          <button onClick={() => router.push(`/shop?category=${encodeURIComponent(product.category_name)}`)} className="pd-breadcrumb-link">
            {product.category_name}
          </button>
          <ChevronRight size={13} className="pd-breadcrumb-sep" />
          <span className="pd-breadcrumb-current">{product.name}</span>
        </nav>
      </div>

      <div className="pd-page-wrap">

        {/* ── TOP: Gallery + Info ── */}
        <div className="pd-product-grid">

          {/* Gallery */}
          <div className="pd-gallery">
            {allImages.length > 1 && (
              <div className="pd-thumbs-rail">
                {allImages.map((img: string, idx: number) => (
                  <button key={idx} onClick={() => setMainImage(img)}
                    className={`pd-thumb ${mainImage === img ? "pd-thumb--active" : ""}`}>
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="pd-main-img-wrap" ref={imageContainerRef}
              onMouseEnter={() => setIsZoomed(true)} onMouseLeave={() => setIsZoomed(false)} onMouseMove={handleMouseMove}>
              {mainImage && (
                <Image src={mainImage} alt={product.name} fill priority className="object-contain pd-main-img"
                  style={isZoomed ? { transform: `scale(2.2)`, transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}} />
              )}
              {product.stock > 0
                ? <div className="pd-badge pd-badge--instock"><Check size={12} /> In Stock</div>
                : <div className="pd-badge pd-badge--outofstock">Out of Stock</div>}
            </div>
          </div>

          {/* Info */}
          <div className="pd-info-col">
            <button onClick={() => router.push(`/shop?category=${encodeURIComponent(product.category_name)}`)} className="pd-category-tag">
              {product.category_name}
            </button>
            <h1 className="pd-product-title">{product.name}</h1>
            <div className="pd-thin-divider" />

            <div className="pd-flex-box">
              <div className="pd-price-row">
                <span className="pd-price">₹{selectedVariation?.price || 0}</span>
                {selectedVariation?.original_price && selectedVariation.original_price > selectedVariation.price && (
                  <><span className="pd-price-original">₹{selectedVariation.original_price}</span>
                  <span className="pd-discount-badge">{Math.round(((selectedVariation.original_price - selectedVariation.price) / selectedVariation.original_price) * 100)}% OFF</span></>
                )}
              </div>
              <div className="pd-rating-row">
                <div className="pd-stars">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < Math.floor(Number(calculateAvgRating())) ? "pd-star--filled" : "pd-star--empty"} />)}
                </div>
                <span className="pd-rating-text">{calculateAvgRating()} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
              </div>
            </div>

            {product.variations?.length > 0 && (
              <div className="pd-variations-block">
                <p className="pd-variations-label">Select Size</p>
                <div className="pd-variations-row">
                  {product.variations.map((v: any) => (
                    <button key={v.id} onClick={() => setSelectedVariation(v)}
                      className={`pd-variation-btn ${selectedVariation?.id === v.id ? "pd-variation-btn--active" : ""}`}>
                      <span>{v.formatted_quantity}</span>
                      <span className="pd-variation-price">₹{v.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pd-actions-row">
              <div className="pd-qty-control">
                <button className="pd-qty-btn" onClick={() => handleQuantity("dec")} disabled={quantity <= 1 || isOutOfStock}><Minus size={14} /></button>
                <span className="pd-qty-num">{quantity}</span>
                <button className="pd-qty-btn" onClick={() => handleQuantity("inc")} disabled={isOutOfStock}><Plus size={14} /></button>
              </div>
              <button onClick={() => {
                if (!selectedVariation) return toast.error("Please select a variation");
                addToCart({ id: product.id, name: product.name, price: selectedVariation?.price || 0, qty: quantity, image: mainImage || product.image_url, variationId: selectedVariation?.id, variationName: selectedVariation?.formatted_quantity || "", tax_rate: selectedVariation?.tax_rate || 0, tax_name: selectedVariation?.tax_name || "" });
                toast.success("Added to cart!");
              }} disabled={isOutOfStock} className="pd-add-cart-btn">
                <ShoppingCart size={18} /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
              <button onClick={() => {
                if (!selectedVariation) return toast.error("Please select a variation");
                addToWishlist({ id: product.id, name: product.name, price: selectedVariation?.price || 0, image: mainImage || product.image_url, variationId: selectedVariation?.id || null, variationName: selectedVariation?.formatted_quantity || "", tax_rate: selectedVariation?.tax_rate || 0, tax_name: selectedVariation?.tax_name || "" });
                setIsWishlisted(!isWishlisted);
                toast.success("Added to wishlist!");
              }} className={`pd-wish-btn ${isWishlisted ? "pd-wish-btn--active" : ""}`}>
                <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
              </button>
            </div>

            {product.stock > 0 && <p className="pd-stock-note"><Package size={14} /> {product.stock} units available</p>}

            <div className="pd-thin-divider" />

            <div className="pd-delivery-block">
              <p className="pd-delivery-label"><MapPin size={14} /> Check Delivery</p>
              <div className="pd-delivery-row">
                <input type="text" placeholder="Enter Postal Code" value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)} maxLength={10} className="pd-postal-input" />
                <button onClick={checkDelivery} disabled={checkingDelivery} className="pd-check-btn">
                  {checkingDelivery ? <Loader2 size={14} className="animate-spin" /> : "Check"}
                </button>
              </div>
              {deliveryInfo && (
                <div className="pd-delivery-result"><Truck size={14} /><span>Expected by <strong>{deliveryInfo.date}</strong></span></div>
              )}
            </div>

            <div className="pd-trust-row">
              <div className="pd-trust-item"><span>Taxes and duties included and calculated at checkout</span></div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            DESCRIPTION + INGREDIENTS — 2 Column Side by Side
        ══════════════════════════════════════════════════ */}
        <div className="pd-desc-ing-section">

          {/* Left: Description */}
          <div className="pd-desc-col">
            <p className="pd-section-eyebrow">About This Product</p>
            <h2 className="pd-desc-heading">Description</h2>
            <div className="pd-description prose" dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available.</p>" }} />
          </div>

          {/* Vertical separator */}
          <div className="pd-vert-divider" />

          {/* Right: Key Ingredients */}
          <div className="pd-ing-col">
            <p className="pd-section-eyebrow">What's Inside</p>
            <h2 className="pd-desc-heading">Key Ingredients</h2>

            {(!product.ingredients || product.ingredients.length === 0) ? (
              <p style={{ color: "#a89070", fontSize: "14px" }}>No ingredients listed for this product.</p>
            ) : (
              <div className="pd-ingredients-list">
                {product.ingredients.map((ing: any, idx: number) => (
                  <div key={ing.id || idx}>
                    <div className="pd-ingredient-row">
                      {ing.featured_image && (
                        <div className="pd-ing-img-wrap">
                          <Image src={ing.featured_image} alt={ing.name || "Ingredient"} fill className="object-cover rounded-full" />
                        </div>
                      )}
                      <div className="pd-ing-text">
                        <h4 className="pd-ing-name">{ing.name}</h4>
                        {ing.content && (
                          <div className="pd-ing-desc" dangerouslySetInnerHTML={{ __html: ing.content }} />
                        )}
                      </div>
                    </div>
                    {idx < product.ingredients.length - 1 && <div className="pd-ing-row-divider" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            HOW TO USE — Text left, Image right
        ══════════════════════════════════════════════════ */}
        <div className="pd-howto-section">
          {/* Left: Steps */}
          <div className="pd-howto-text-col">
            <p className="pd-section-eyebrow">Usage Guide</p>
            <h2 className="pd-howto-heading">How To Use</h2>
            <div className="pd-howto-steps">
              {howToUseSteps.map((step: any, idx: number) => (
                <div key={idx}>
                  <div className="pd-howto-step">
                    <p className="pd-howto-step-label">{step.label}</p>
                    <p className="pd-howto-step-text">{step.text}</p>
                  </div>
                  {idx < howToUseSteps.length - 1 && <div className="pd-howto-divider" />}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="pd-howto-img-col">
            {howToUse ? (
              <div className="pd-howto-img-wrap">
                <Image src={howToUse} alt="How to use" fill className="object-cover" />
              </div>
            ) : (
              <div className="pd-howto-img-wrap pd-howto-img-placeholder">
                <div style={{ textAlign: "center", color: "rgba(203,136,54,0.4)" }}>
                  <Package size={48} />
                  <p style={{ fontSize: "13px", marginTop: "8px", color: "#a89070" }}>Add how-to-use image</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            PROCESS OF MAKING — Image left, Text right
        ══════════════════════════════════════════════════ */}
        <div className="pd-howto-section pd-howto-section--light">
          {/* Left: Image / Video */}
          <div className="pd-howto-img-col">
            {product.process_video_url ? (
              <div className="pd-process-video-wrap" onClick={toggleVideo}>
                <video ref={videoRef} src={product.process_video_url} loop playsInline className="pd-process-video"
                  onEnded={() => setVideoPlaying(false)} />
                {!videoPlaying && (
                  <div className="pd-play-overlay">
                    <div className="pd-play-btn"><Play size={28} className="pd-play-icon" /></div>
                  </div>
                )}
              </div>
            ) : product.process_image ? (
              <div className="pd-howto-img-wrap">
                <Image src={product.process_image} alt="Our Process" fill className="object-cover" />
              </div>
            ) : (
              /* Demo placeholder image */
              <div className="pd-howto-img-wrap">
                <Image src={product.image_url || "/images/default.jpg"} alt="Our Process" fill className="object-cover" />
              </div>
            )}
          </div>

          {/* Right: Text */}
          <div className="pd-howto-text-col pd-howto-text-col--light">
            <p className="pd-section-eyebrow">Crafted with Care</p>
            <h2 className="pd-howto-heading pd-howto-heading--dark">
              {product.process_title || "Our Process"}
            </h2>
            <div className="pd-howto-steps">
              <div className="pd-howto-step">
                <p className="pd-howto-step-text pd-howto-step-text--dark">
                  {product.process_description ||
                    "Each of our products is handcrafted in small batches using traditional methods passed down through generations. From sourcing the finest natural ingredients from pristine Himalayan meadows to bottling with minimal human intervention — every step is guided by our commitment to purity, potency and sustainability."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            REVIEWS
        ══════════════════════════════════════════════════ */}
        <div className="pd-reviews-section">
          <p className="pd-section-eyebrow">What Our Customers Say</p>
          <h2 className="pd-reviews-main-heading">Customer Reviews</h2>

          <div className="pd-reviews-layout">
            {/* Review form */}
            <div className="pd-review-form-block">
              <h3 className="pd-review-form-title">Write a Review</h3>
              <div className="pd-review-form">
                <input type="text" placeholder="Your Name" value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  className="pd-review-input" />
                <div>
                  <p className="pd-review-label">Rating</p>
                  <div className="pd-stars-input">
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                        <Star size={28} className={star <= reviewForm.rating ? "pd-star--filled" : "pd-star--empty"} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea placeholder="Share your experience..." value={reviewForm.comment} rows={4}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="pd-review-input pd-review-textarea" />
                <button onClick={submitReview} className="pd-review-submit">Submit Review</button>
              </div>
            </div>

            {/* Reviews list */}
            <div className="pd-reviews-list">
              {reviews.length === 0 ? (
                <div className="pd-empty-state">
                  <Star size={36} className="pd-empty-icon" />
                  <p>No reviews yet. Be the first!</p>
                </div>
              ) : (
                <>
                  {reviews.slice(0, visibleReviews).map((r: any) => (
                    <div key={r.id} className="pd-review-card">
                      <div className="pd-review-card-header">
                        <div>
                          <p className="pd-reviewer-name">{r.name}</p>
                          {r.date && <p className="pd-review-date">{r.date}</p>}
                        </div>
                        <div className="pd-stars">
                          {[...Array(5)].map((_, j) => <Star key={j} size={15} className={j < r.rating ? "pd-star--filled" : "pd-star--empty"} />)}
                        </div>
                      </div>
                      <p className="pd-review-comment">{r.comment}</p>
                    </div>
                  ))}
                  {visibleReviews < reviews.length && (
                    <button onClick={loadMoreReviews} disabled={loadingMoreReviews} className="pd-load-more-btn">
                      {loadingMoreReviews ? <><Loader2 size={16} className="animate-spin" /> Loading...</> : "Load More Reviews"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pd-related-section">
            <p className="pd-section-eyebrow">You May Also Like</p>
            <h2 className="pd-related-title">Related Products</h2>
            <div className="pd-related-grid">
              {relatedProducts.slice(0, 4).map((item) => (
                <div key={item.id} onClick={() => router.push(`/product/${item.slug}`)} className="pd-related-card group">
                  <div className="pd-related-img-wrap">
                    {item.image_url && <Image src={item.image_url} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />}
                  </div>
                  <div className="pd-related-info">
                    <h3 className="pd-related-name">{item.name}</h3>
                    <p className="pd-related-price">₹{item.variations?.[0]?.price || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}