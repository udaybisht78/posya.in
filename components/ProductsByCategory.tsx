"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const BASE_URL   = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN;
console.log('sdfds');
interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  image?: string;
  is_premium?: boolean;
  created_at?: string;
}

interface Props {
  categoryId: number;
}

export default function ProductsByCategory({ categoryId }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}categories/${categoryId}/products`)
      .then(res => res.json())
      .then(data => {
        if (data.status) setProducts(data.products);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, [categoryId]);

  const getImageUrl = (image?: string) => {
    if (!image) return "/images/default-product.jpg";
    return image.startsWith("http") ? image : `${DOMAIN_URL}uploads/products/${image}`;
  };

  if (loading) return <p>Loading products...</p>;
  if (products.length === 0) return <p className="text-gray-500">No products in this category.</p>;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6">Related Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div
            key={product.id}
            className={`relative rounded-lg shadow p-4 transition hover:shadow-lg ${
              product.is_premium ? "border-2 border-yellow-500" : "border border-gray-200"
            }`}
          >
            {/* Premium badge */}
            {product.is_premium && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded">
                Premium
              </div>
            )}

            {/* Product image */}
            <Link href={`/product/${product.slug}`}>
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-3 hover:scale-105 transition"
              />
            </Link>

            {/* Product details */}
            <Link href={`/product/${product.slug}`}>
              <h3 className="text-lg font-semibold hover:text-green-700 transition">{product.name}</h3>
            </Link>

            <p className="text-green-900 font-bold mt-1">₹{product.price}</p>

            {product.created_at && (
              <span className="inline-block mt-2 text-gray-400 text-xs">
                Added on: {new Date(product.created_at).toLocaleDateString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
