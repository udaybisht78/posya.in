"use client";

import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/components/CartContext";
import Link from "next/link";
import TopHeading from "@/components/TopHeading";
import NotFoundItems from "@/components/ItemNotFound";


export default function CartPage() {
  const { cartItems, removeFromCart, updateQty, totalPrice } = useCart();

  return (
    <main className="min-h-screen bg-[#F2EEE9] py-12 px-4 md:px-12">
      <TopHeading heading="Your Cart"/>
      {cartItems.length === 0 ? (
        <NotFoundItems message="Cart is Empty" subMessage="Add your favorite products and start shopping!" icon="cart"/>
      ) : (
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.variationId || 0}`}
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
                      <p className="text-sm text-gray-500">{item.variationName}</p>
                    )}
                    <p className="text-gray-600 text-sm">₹{item.price}</p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQty(item.id, item.variationId, "decrease")}
                    className="border p-1 rounded hover:bg-gray-100 transition"
                    ><Minus size={16} />
                  </button>
                  <span className="font-medium">{item.qty}</span>
                  <button 
                     onClick={() => updateQty(item.id, item.variationId, "increase")}
                     className="border p-1 rounded hover:bg-gray-100 transition"> 
                     <Plus size={16} />
                  </button>
                </div>

                {/* Total Price */}
                <div className="text-gray-800 font-semibold">
                  ₹{item.price * item.qty}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id, item.variationId)}
                  className="bg-[#0d3b2e] hover:bg-[#145c45] text-white p-2 rounded-full transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="md:w-1/3 bg-white p-6 rounded-2xl shadow-md h-fit flex flex-col gap-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 font-medium">Subtotal</span>
              <span className="text-gray-900 font-bold text-lg">₹{totalPrice}</span>
            </div>
            <Link href="/checkout">
            <button className="w-full bg-[#0d3b2e] text-white py-3 rounded-md font-medium hover:bg-[#145c45] transition">
              Proceed to Checkout
            </button>
            </Link>
            <Link href="/shop">
            <button className="w-full mt-3 text-[#0d3b2e] border border-[#0d3b2e] py-3 rounded-md font-medium hover:bg-[#0d3b2e] hover:text-white transition">
              Continue Shopping
            </button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
