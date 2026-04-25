"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useCart } from "./CartContext"; 
import { v4 as uuidv4 } from "uuid";

const BASE_URL   = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN;


interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  variationId?: number;
  variationName?: string;
  tax_rate?: number;
  tax_name?: string;
  unit?: string;
  qty?: number; // for move to cart
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number, variationId?: number) => void;
  clearWishlist: () => void;
  moveToCart: (item: WishlistItem) => void;
  refreshWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const { addToCart } = useCart();

  // Generate session_id for guest
  useEffect(() => {
    let sid = localStorage.getItem("session_id");
    if (!sid) {
      // sid = crypto.randomUUID();
      sid = uuidv4();
      localStorage.setItem("session_id", sid);
    }
    setSessionId(sid);
  }, []);

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`${BASE_URL}wishlist?session_id=${sessionId}`);
      const data = await res.json();
      if (data.wishlistItems) setWishlistItems(data.wishlistItems);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [sessionId]);

  // Add item to wishlist
const addToWishlist = async (item: WishlistItem) => {
  const exists = wishlistItems.find(p => p.id === item.id && p.variationId === item.variationId);
  if (exists) return;

  try {
    const res = await fetch(`${BASE_URL}wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": sessionId,
      },
      body: JSON.stringify({ item }),
    });
    const data = await res.json();
    if (data.item) {
      setWishlistItems(prev => [...prev, {
        id: data.item.id,
        name: data.item.name,
        price: parseFloat(data.item.price),
        image: data.item.image,
        variationId: data.item.variation_id,
        variationName: data.item.variation_name,
        unit: data.item.unit,
        tax_rate: parseFloat(data.item.tax_rate ?? 0),
        tax_name: data.item.tax_name ?? '',
      }]);
    }
  } catch (err) {
    console.error("Failed to add to wishlist:", err);
  }
};
  // Remove item from wishlist
  const removeFromWishlist = async (id: number, variationId?: number) => {
    try {
      await fetch(`${BASE_URL}wishlist/${id}`, {
        method: "DELETE",
        headers: { "X-Session-Id": sessionId },
      });
      setWishlistItems(prev => prev.filter(p => !(p.id === id && p.variationId === variationId)));
    } catch (err) {
      console.error("Failed to remove wishlist item:", err);
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      await fetch(`${BASE_URL}wishlist/clear`, {
        method: "POST",
        headers: { "X-Session-Id": sessionId },
      });
      setWishlistItems([]);
    } catch (err) {
      console.error("Failed to clear wishlist:", err);
    }
  };

  // Move item from wishlist to cart
  const moveToCart = (item: WishlistItem) => {
    addToCart({
      id: item.id,
      variationId: item.variationId,
      variationName: item.variationName,
      name: item.name,
      price: item.price,
      qty: 1,
      image: item.image,
      unit: item.unit,
      tax_rate: item.tax_rate,
      tax_name: item.tax_name,
    });
    removeFromWishlist(item.id, item.variationId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        moveToCart,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
};
