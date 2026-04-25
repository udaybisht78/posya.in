"use client";

import Image from "next/image";
import { Trash2, ShoppingCart, Heart, ChevronRight } from "lucide-react";
import { useWishlist } from "@/components/WishlistContext";
import { useCart } from "@/components/CartContext";
import toast from "react-hot-toast";
import NotFoundItems from "@/components/ItemNotFound";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const moveToCart = (item: any) => {
    addToCart({ ...item, qty: 1 });
    removeFromWishlist(item.id, item.variationId);
    toast.success(`${item.name} moved to cart!`);
  };

  const totalPrice = wishlistItems.reduce((acc, item) => acc + Number(item.price), 0);

  return (
    <main className="min-h-screen" style={{ background: "#f2eee9" }}>

      {/* Hero */}
      <div className="wish-hero">
        <p className="wish-eyebrow">Saved for Later</p>
        <h1 className="wish-hero-heading">Your Wishlist</h1>
      </div>

      <div className="wish-page-wrap">

        {wishlistItems.length === 0 ? (
          <NotFoundItems message="Your Wishlist is Empty" subMessage="Save your favourite products and shop later!" icon="cart" />
        ) : (
          <div className="wish-layout">

            {/* ── Left: Items ── */}
            <div className="wish-items-col">

              {/* Header */}
              <div className="wish-items-header">
                <span>Product</span>
                <span className="text-center">Price</span>
                <span className="text-center">Actions</span>
              </div>

              <div className="wish-items-list">
                {wishlistItems.map((item) => (
                  <div key={item.id + "-" + (item.variationId || 0)} className="wish-item">

                    {/* Image + Info */}
                    <div className="wish-item-info">
                      <div className="wish-item-img-wrap">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="wish-item-details">
                        <h3 className="wish-item-name">{item.name}</h3>
                        {item.variationName && (
                          <span className="wish-item-variation">{item.variationName}</span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <p className="wish-item-price">₹{Number(item.price).toLocaleString()}</p>

                    {/* Actions */}
                    <div className="wish-item-actions">
                      <button className="wish-move-btn" onClick={() => moveToCart(item)}>
                        <ShoppingCart size={14} /> Move to Cart
                      </button>
                      <button className="wish-remove-btn" onClick={() => removeFromWishlist(item.id, item.variationId)} aria-label="Remove">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/shop" className="wish-continue-link">← Continue Shopping</Link>
            </div>

            {/* ── Right: Summary ── */}
            <div className="wish-summary-col">
              <div className="wish-summary-card">

                <div className="wish-summary-icon-wrap">
                  <Heart size={22} className="wish-summary-icon" />
                </div>

                <p className="wish-eyebrow" style={{ textAlign: "center" }}>Summary</p>
                <h2 className="wish-summary-heading">Wishlist Summary</h2>

                <div className="wish-summary-divider" />

                <div className="wish-summary-row">
                  <span>Total Items</span>
                  <span><strong>{wishlistItems.length}</strong></span>
                </div>
                <div className="wish-summary-row">
                  <span>Total Value</span>
                  <span className="wish-summary-price">₹{totalPrice.toLocaleString()}</span>
                </div>

                <div className="wish-summary-divider" />

                <button
                  className="wish-move-all-btn"
                  onClick={() => { wishlistItems.forEach((item) => moveToCart(item)); }}
                >
                  <ShoppingCart size={16} /> Move All to Cart
                </button>

                <Link href="/shop">
                  <button className="wish-shop-btn">Explore More Products</button>
                </Link>

              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}