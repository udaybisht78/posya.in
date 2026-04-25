"use client";

import Image from "next/image";
import { X, Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "./CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateQty, totalPrice } = useCart();
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    onClose();
    router.push("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} className="cdrawer-overlay" />

      {/* Drawer */}
      <div className="cdrawer">

        {/* Header */}
        <div className="cdrawer-header">
          <div className="cdrawer-header-left">
            <ShoppingCart size={18} className="cdrawer-cart-icon" />
            <h2 className="cdrawer-title">Your Cart</h2>
            {cartItems.length > 0 && (
              <span className="cdrawer-count">{cartItems.length}</span>
            )}
          </div>
          <button onClick={onClose} className="cdrawer-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="cdrawer-items">
          {cartItems.length === 0 ? (
            <div className="cdrawer-empty">
              <ShoppingCart size={40} className="cdrawer-empty-icon" />
              <p className="cdrawer-empty-title">Your cart is empty</p>
              <p className="cdrawer-empty-sub">Add your favourite products and start shopping!</p>
              <button onClick={onClose} className="cdrawer-explore-btn">Explore Products</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id + "-" + item.variationId} className="cdrawer-item">
                <div className="cdrawer-item-img">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="cdrawer-item-info">
                  <h3 className="cdrawer-item-name">{item.name}</h3>
                  {item.variationName && (
                    <span className="cdrawer-item-variation">{item.variationName}</span>
                  )}
                  {/* Quantity controls */}
                  <div className="cdrawer-qty">
                    <button
                      onClick={() => updateQty(item.id, item.variationId, "decrease")}
                      className="cdrawer-qty-btn"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="cdrawer-qty-value">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.variationId, "increase")}
                      className="cdrawer-qty-btn"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="cdrawer-item-price">₹{(item.price * item.qty).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id, item.variationId)}
                  className="cdrawer-remove-btn"
                  aria-label="Remove from cart"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cdrawer-footer">
            <div className="cdrawer-footer-total">
              <span>Total</span>
              <span className="cdrawer-footer-price">₹{totalPrice.toLocaleString()}</span>
            </div>
            <button onClick={handleCheckout} className="cdrawer-checkout-btn">
              Proceed to Checkout
            </button>
            <Link href="/cart" onClick={onClose} className="cdrawer-view-btn">
              View Full Cart
            </Link>
          </div>
        )}

      </div>
    </>
  );
}