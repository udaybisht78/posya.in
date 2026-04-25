"use client";

import Image from "next/image";
import { Trash2, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/components/WishlistContext";
import { useCart } from "@/components/CartContext";
import toast from "react-hot-toast";
import NotFoundItems from "@/components/ItemNotFound";
import TopHeading from "@/components/TopHeading";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  

  const moveToCart = (item: any) => {
    addToCart({ ...item, qty: 1 });
    removeFromWishlist(item.id, item.variationId);
    toast.success(`${item.name} moved to cart!`);
  };

  return (
    <main className="min-h-screen bg-[#F2EEE9] py-12 px-4 md:px-12">
      <TopHeading heading="Your Wishlist" />

      {wishlistItems.length === 0 ? (
        <NotFoundItems
          message="Your wishlist is empty"
          subMessage="Add your favorite products and start shopping!"
          icon="cart"
        />
      ) : (
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Wishlist Items */}
          <div className="flex-1 space-y-4">
            {wishlistItems.map((item) => (
              <div
                key={item.id + "-" + (item.variationId || 0)}
                className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4 w-full md:w-1/2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-xl object-cover shadow-sm"
                  />
                  <div>
                    <h3 className="text-gray-800 font-medium">{item.name}</h3>
                    {item.variationName && (
                      <p className="text-xs text-gray-500">{item.variationName}</p>
                    )}
                    <p className="text-sm text-[#0d3b2e] font-semibold">
                      ₹{item.price}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <button
                    onClick={() => moveToCart(item)}
                    className="flex items-center gap-2 bg-[#0d3b2e] hover:bg-[#145c45] text-white py-2 px-3 rounded-md transition"
                  >
                    <ShoppingCart size={16} />
                    Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id, item.variationId)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Wishlist Summary */}
          <div className="md:w-1/3 bg-white p-6 rounded-2xl shadow-md h-fit flex flex-col gap-4">
            <h2 className="text-lg font-semibold mb-4">Wishlist Summary</h2>
            <p className="text-gray-700 font-medium">
              Total Items: {wishlistItems.length}
            </p>
           <p className="text-gray-700 font-medium">
            Total Price: ₹
            {wishlistItems.reduce((acc, item) => acc + Number(item.price), 0).toLocaleString()}
          </p>
          </div>
        </div>
      )}
    </main>
  );
}
