"use client";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "./CartContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  const handleViewCart = () => {
    onClose();
    router.push("/cart");
  };

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
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
      ></div>

      {/* Drawer */}
      <div className="fixed top-0 right-0 w-80 md:w-96 h-full bg-white z-50 flex flex-col shadow-2xl rounded-l-2xl animate-slideIn">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
          <button
            onClick={onClose}
            className="bg-[#0d3b2e] hover:bg-[#145c45] text-white rounded-full p-1 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id + "-" + item.variationId}
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
                    <p className="text-xs text-gray-500">Variation: {item.variationName}</p>
                  )}

                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateQty(item.id, item.variationId, "decrease")}
                      className="p-1 rounded border hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-2">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.variationId, "increase")}
                      className="p-1 rounded border hover:bg-gray-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-[#0d3b2e] mt-1">
                    ₹{item.price * item.qty}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id, item.variationId)}
                  className="bg-[#0d3b2e] hover:bg-[#145c45] text-white p-1.5 rounded-full transition"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-12 text-sm">
              Your cart is empty. Add your favorite products and start shopping!
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-5 bg-gray-50 shadow-inner rounded-b-2xl space-y-2">
          <div className="flex justify-between items-center text-gray-800 font-semibold mb-3">
            <span>Total</span>
            <span className="text-lg text-[#0d3b2e]">₹{totalPrice}</span>
          </div>
          <button
              onClick={handleCheckout}
              className="w-full bg-[#0d3b2e] hover:bg-[#145c45] text-white py-2.5 rounded-lg font-medium transition"
            >
              Proceed to Checkout
          </button>
          <button
            onClick={handleViewCart}
            className="w-full border border-[#0d3b2e] text-[#0d3b2e] py-2.5 rounded-lg font-medium hover:bg-[#0d3b2e] hover:text-white transition"
          >
            View Cart
          </button>
        </div>
      </div>
    </>
  );
}