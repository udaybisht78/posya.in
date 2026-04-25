"use client";

import { useEffect, useState, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BASE_URL   = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN;

interface SearchPopUpProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchPopUp({ isOpen, onClose }: SearchPopUpProps) {
  const [show, setShow] = useState(isOpen);
  const [animating, setAnimating] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false); // <-- For live search loader
  const [category, setCategory] = useState("All");
  const router = useRouter();

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setAnimating(false);
    } else {
      setAnimating(true);
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Fetch products once
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.products) setProducts(data.products);
        setFiltered(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Live search with debounce
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    setSearching(true); // start loader
    searchTimeout.current = setTimeout(() => {
      let result = [...products];

      if (category !== "All") {
        result = result.filter((p) => p.category_name === category);
      }

      if (search.trim() !== "") {
        result = result.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setFiltered(result);
      setSearching(false); // stop loader
    }, 300);
  }, [search, category, products]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      {/* Drawer */}
      <div
        className={`${
          animating ? "translate-x-full" : "translate-x-0"
        } transition-transform duration-300 w-full max-w-[500px] sm:max-w-[600px] bg-white h-full p-6 flex flex-col overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Search Products</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-800" />
          </button>
        </div>

        {/* Search Input */}
        <div className="flex gap-2 mb-6">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-sm w-1/3"
          >
            <option value="All">All categories</option>
            {[...new Set(products.map((p) => p.category_name).filter(Boolean))].map(
              (cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              )
            )}
          </select>
          <input
            type="text"
            placeholder="Search for products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm"
          />
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          {loading || searching ? (
            <div className="flex items-center gap-3 animate-pulse p-2">
              <div className="w-16 h-16 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition shadow-sm"
                  onClick={() => {
                    router.push(`/product/${p.slug}`);
                    onClose();
                  }}
                >
                  <Image
                    src={p.image_url || "/placeholder.png"}
                    alt={p.name}
                    width={70}
                    height={70}
                    className="object-cover rounded-lg"
                  />
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-[#0d3b2e] mt-1 font-semibold">
                      ₹{p.variations?.[0]?.price || 0}
                    </p>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {p.shortDescription || ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No products found
            </p>
          )}
        </div>

        {/* Categories at Bottom */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <div className="grid grid-cols-2 gap-3">
            {[...new Set(products.map((p) => p.category_name).filter(Boolean))].map(
              (cat) => (
                <div
                  key={cat}
                  className="p-3 bg-[#fdf5f1] rounded-lg cursor-pointer text-center hover:bg-[#f5e6d9] font-medium"
                  onClick={() => {
                    router.push(`/shop?category=${encodeURIComponent(cat)}`);
                    onClose();
                  }}
                >
                  {cat}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
