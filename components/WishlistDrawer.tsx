"use client";

import Image from "next/image";
import { X, Trash2, Heart } from "lucide-react";
import { useEffect } from "react";
import { useWishlist } from "./WishlistContext";
import Link from "next/link";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} className="wdrawer-overlay" />

      {/* Drawer */}
      <div className="wdrawer">

        {/* Header */}
        <div className="wdrawer-header">
          <div className="wdrawer-header-left">
            <Heart size={18} className="wdrawer-heart-icon" />
            <h2 className="wdrawer-title">Wishlist</h2>
            {wishlistItems.length > 0 && (
              <span className="wdrawer-count">{wishlistItems.length}</span>
            )}
          </div>
          <button onClick={onClose} className="wdrawer-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="wdrawer-items">
          {wishlistItems.length === 0 ? (
            <div className="wdrawer-empty">
              <Heart size={40} className="wdrawer-empty-icon" />
              <p className="wdrawer-empty-title">Your wishlist is empty</p>
              <p className="wdrawer-empty-sub">Save your favourite products here</p>
              <button onClick={onClose} className="wdrawer-explore-btn">Explore Products</button>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div key={item.id + "-" + (item.variationId || 0)} className="wdrawer-item">
                <div className="wdrawer-item-img">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="wdrawer-item-info">
                  <h3 className="wdrawer-item-name">{item.name}</h3>
                  {item.variationName && (
                    <span className="wdrawer-item-variation">{item.variationName}</span>
                  )}
                  <p className="wdrawer-item-price">₹{Number(item.price).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => removeFromWishlist(item.id, item.variationId)}
                  className="wdrawer-remove-btn"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="wdrawer-footer">
            <div className="wdrawer-footer-total">
              <span>Total Value</span>
              <span className="wdrawer-footer-price">
                ₹{wishlistItems.reduce((acc, item) => acc + Number(item.price), 0).toLocaleString()}
              </span>
            </div>
            <Link href="/wishlist" onClick={onClose} className="wdrawer-view-btn">
              View Full Wishlist
            </Link>
          </div>
        )}
      </div>
    </>
  );
}