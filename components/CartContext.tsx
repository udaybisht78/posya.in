"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


interface CartItem {
  id: number;
  productId?: number; 
  variationId?: number;
  variationName?: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  unit?: string;
  tax_rate?: number;
  tax_name?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, variationId?: number) => void;
  updateQty: (id: number, variationId: number | undefined, action: "increase" | "decrease") => void;
  totalPrice: number;
  refreshCart: () => void;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [sessionId, setSessionId] = useState<string>("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    let sid = localStorage.getItem("session_id");
    if (!sid) {
      // sid = crypto.randomUUID();
      sid = uuidv4();
      localStorage.setItem("session_id", sid);
    }
    setSessionId(sid);
  }, []);

  const fetchCart = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`${BASE_URL}cart?session_id=${sessionId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data.cartItems) setCartItems(data.cartItems);
    } catch (err) {
      console.error("Failed to fetch cart from backend:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [sessionId, token]);

  const syncCart = async (items: CartItem[]) => {
    if (!sessionId) return;
    try {
      await fetch(`${BASE_URL}cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ cartItems: items }),
      });
    } catch (err) {
      console.error("Failed to sync cart:", err);
    }
  };

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const exist = prev.find(i => i.productId === item.productId && i.variationId === item.variationId);
      let updated: CartItem[];
      if (exist) {
        updated = prev.map(i =>
          i.productId === item.productId && i.variationId === item.variationId
            ? { ...i, qty: i.qty + item.qty }
            : i
        );
      } else {
        updated = [...prev, item];
      }
      syncCart(updated);
      return updated;
    });
  };

  const removeFromCart = async (cartItemId: number, variationId?: number) => {
    setCartItems(prev => prev.filter(
      i => !(i.id === cartItemId && (variationId === undefined || i.variationId === variationId))
    ));

    try {
      await fetch(`${BASE_URL}cart/${cartItemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      console.error("Failed to remove item from backend:", err);
    }
  };

  const updateQty = (cartItemId: number, variationId: number | undefined, action: "increase" | "decrease") => {
    setCartItems(prev => {
      const updated = prev.map(i =>
        i.id === cartItemId && i.variationId === variationId
          ? { ...i, qty: action === "increase" ? i.qty + 1 : Math.max(1, i.qty - 1) }
          : i
      );
      syncCart(updated);
      return updated;
    });
  };

  const clearCart = async () => {
    if (!sessionId) {
      console.error("Session ID not ready yet, cannot clear cart.");
      return;
    }

    setCartItems([]); 

    try {
      await fetch(`${BASE_URL}cart/clear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      console.error("Failed to clear cart on backend:", err);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        totalPrice,
        refreshCart: fetchCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
