"use client";

import Image from "next/image";
import { X, Trash2 } from "lucide-react";
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
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
      ></div>

      {/* Drawer */}
      <div className="fixed top-0 right-0 w-80 md:w-96 h-full bg-white z-50 flex flex-col shadow-2xl rounded-l-2xl animate-slideIn">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Your Wishlist</h2>
          <button
            onClick={onClose}
            className="bg-[#0d3b2e] hover:bg-[#145c45] text-white rounded-full p-1 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {wishlistItems.length === 0 ? (
            <p className="text-center text-gray-500 mt-12 text-sm">
              Your wishlist is empty<br />
              Add your favorite products and start shopping!
            </p>
          ) : (
            wishlistItems.map((item) => (
              <div
                key={item.id + "-" + (item.variationId || 0)}
                className="flex items-center gap-3 bg-white shadow-md hover:shadow-lg transition rounded-xl p-3"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={70}
                  height={90}
                  className="rounded-lg object-cover shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>
                  {item.variationName && (
                    <p className="text-xs text-gray-500">{item.variationName}</p>
                  )}
                  <p className="text-sm text-[#0d3b2e] font-semibold">₹{item.price}</p>
                </div>
                <button
                  onClick={() => removeFromWishlist(item.id, item.variationId)}
                  className="bg-[#0d3b2e] hover:bg-[#145c45] text-white p-1.5 rounded-full transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="border-t border-gray-200 p-5 bg-gray-50 shadow-inner rounded-b-2xl flex flex-col gap-2">
            <Link
              href="/wishlist"
              onClick={onClose}
              className="w-full text-center bg-[#0d3b2e] hover:bg-[#145c45] text-white py-2.5 rounded-lg font-medium transition"
            >
              View Wishlist
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
