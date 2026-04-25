"use client";

import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronRight } from "lucide-react";
import { useCart } from "@/components/CartContext";
import Link from "next/link";
import NotFoundItems from "@/components/ItemNotFound";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty, totalPrice } = useCart();

  return (
    <main className="min-h-screen" style={{ background: "#f2eee9" }}>

      {/* Hero bar */}
      <div className="cart-hero">
        <div className="cart-hero-inner">
          <p className="cart-eyebrow">Your Bag</p>
          <h1 className="cart-hero-heading">Shopping Cart</h1>
        </div>
      </div>

      <div className="cart-page-wrap">

        {cartItems.length === 0 ? (
          <NotFoundItems message="Your Cart is Empty" subMessage="Add your favourite products and start shopping!" icon="cart" />
        ) : (
          <div className="cart-layout">

            {/* ── Left: Cart Items ── */}
            <div className="cart-items-col">

              {/* Header row */}
              <div className="cart-items-header">
                <span>Product</span>
                <span className="text-center">Qty</span>
                <span className="text-center">Total</span>
                <span />
              </div>

              {/* Items */}
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.variationId || 0}`} className="cart-item">

                    {/* Image + info */}
                    <div className="cart-item-info">
                      <div className="cart-item-img-wrap">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.name}</h3>
                        {item.variationName && (
                          <span className="cart-item-variation">{item.variationName}</span>
                        )}
                        <p className="cart-item-unit-price">₹{item.price} / unit</p>
                      </div>
                    </div>

                    {/* Qty controls */}
                    <div className="cart-qty-wrap">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQty(item.id, item.variationId, "decrease")}
                      >
                        <Minus size={13} />
                      </button>
                      <span className="cart-qty-num">{item.qty}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQty(item.id, item.variationId, "increase")}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Line total */}
                    <p className="cart-item-total">₹{item.price * item.qty}</p>

                    {/* Remove */}
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.id, item.variationId)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Continue shopping */}
              <Link href="/shop" className="cart-continue-link">
                ← Continue Shopping
              </Link>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="cart-summary-col">
              <div className="cart-summary-card">
                <p className="cart-eyebrow">Summary</p>
                <h2 className="cart-summary-heading">Order Summary</h2>

                <div className="cart-summary-divider" />

                <div className="cart-summary-row">
                  <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span className="cart-summary-free">
                    {totalPrice >= 599 ? "Free" : "At checkout"}
                  </span>
                </div>
                {totalPrice < 599 && (
                  <p className="cart-free-ship-note">
                    Add ₹{599 - totalPrice} more for <strong>free shipping</strong>
                  </p>
                )}

                <div className="cart-summary-divider" />

                <div className="cart-summary-total-row">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>

                <Link href="/checkout">
                  <button className="cart-checkout-btn">
                    Proceed to Checkout <ArrowRight size={16} />
                  </button>
                </Link>

                {/* Trust badges */}
                <div className="cart-trust-badges">
                  <span>🔒 Secure Checkout</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}