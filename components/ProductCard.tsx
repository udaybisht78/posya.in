"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, IndianRupee } from "lucide-react";
import { useCart } from "@/components/CartContext";
import toast from "react-hot-toast";

const BASE_URL   = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN;

interface Product {
  id: number;
  name: string;
  shortDescription?: string;
  description?: string;
  price?: number;
  sale_price?: number;
  image_url?: string;
  images_data?: { image: string }[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const { addToCart } = useCart();

  const images = product.images_data?.length
    ? product.images_data.map((img) => `${DOMAIN_URL}uploads/products/` + img.image)
    : [product.image_url || "/images/placeholder.jpg"];

  const nextImage = () => setImgIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setImgIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval);
  }, [imgIndex]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price || 0,
      qty: 1,
      image: images[0],
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="flex flex-col items-center product-wrapper border rounded shadow hover:shadow-lg transition">
      {/* Image Slider */}
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full h-72">
          <Image
            key={imgIndex}
            src={images[imgIndex]}
            alt={product.name}
            fill
            className="object-cover w-full h-full transition-opacity duration-700 ease-in-out opacity-100 animate-fade"
          />
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Product Info */}
      <h3 className="mt-4 text-lg font-serif text-gray-800">{product.name}</h3>
      <p className="text-sm text-gray-600 text-center px-2">{product.shortDescription || product.description}</p>
      <div className="flex items-center mt-1 text-orange-600 font-bold">
        <IndianRupee size={20} />
        <span className="text-lg font-medium">{product.sale_price || product.price}</span>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center text-center w-full mt-2 gap-2">
        <button
          onClick={handleAddToCart}
          className="cartButton flex-1 border border-gray-800 py-2 flex justify-center items-center gap-2 hover:bg-gray-800 hover:text-white transition rounded-none"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>

        <button className="wishlistButton flex-1 border border-gray-800 py-2 flex justify-center items-center gap-2 hover:bg-gray-800 hover:text-white transition rounded-none">
          <Heart size={16} />
        </button>
      </div>
    </div>
  );
}
