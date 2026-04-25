"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import { Heart, ShoppingCart, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import TopHeading from "@/components/TopHeading";
import { useSearchParams } from "next/navigation";
import NotFoundItems from "@/components/ItemNotFound";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN;

export default function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedVariation, setSelectedVariation] = useState<{ [key: number]: any }>({});
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  // Fetch products
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.products) {
          setProducts(data.products);
          setFiltered(data.products);

          const uniqueCats = ["All", ...new Set(data.products.map((p: any) => p.category_name as string).filter(Boolean))] as string[];
          setCategories(uniqueCats);

          // Default variation
          const defaultVar: { [key: number]: any } = {};
          data.products.forEach((p: any) => {
            defaultVar[p.id] = p.variations?.[0] || null;
          });
          setSelectedVariation(defaultVar);

          // Category from query
          const categoryFromQuery = searchParams.get("category");
          if (categoryFromQuery && uniqueCats.includes(categoryFromQuery)) {
            setSelectedCategory(categoryFromQuery);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load products");
        setLoading(false);
      });
  }, [searchParams]);

  // Filters
  useEffect(() => {
    let result = [...products];

    if (search.trim() !== "") result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (selectedCategory !== "All") result = result.filter((p) => p.category_name === selectedCategory);
    result = result.filter((p) => {
      const minPrice = Math.min(...p.variations.map((v: any) => parseFloat(v.price)));
      const maxPrice = Math.max(...p.variations.map((v: any) => parseFloat(v.price)));
      return maxPrice >= priceRange[0] && minPrice <= priceRange[1];
    });

    setFiltered(result);
  }, [search, selectedCategory, priceRange, products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-4xl text-gray-600" />
        &nbsp;Loading....
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F2EEE9] py-12 px-4 md:px-12">
      <TopHeading heading="Our Products" />

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-10 bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full md:w-1/3"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full md:w-1/4"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-gray-600">₹{priceRange[0]}</span>
          <input
            type="range"
            min="0"
            max="100000"
            step="500"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-32"
          />
          <input
            type="range"
            min="0"
            max="100000"
            step="500"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-32"
          />
          <span className="text-gray-600">₹{priceRange[1]}</span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const selectedVar = selectedVariation[item.id];
            const multipleVariations = item.variations?.length > 1;

            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 p-3 flex flex-col relative">
                <div className="absolute top-3 right-3 bg-[#0d3b2e] text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md z-10">
                  {item.category_name}
                </div>

                <a href={`/product/${item.slug}`} className="relative w-full h-44 overflow-hidden rounded-xl mb-3">
                  <Image
                    src={item.image_url || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                  />
                </a>

                <a href={`/product/${item.slug}`}>
                  <h3 className="mt-1 font-bold text-gray-800 line-clamp-2">{item.name}</h3>
                </a>
                <p className="text-gray-600 text-sm mt-2 text-justify line-clamp-3">{item.productDescription}</p>

                {/* Variations */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.variations?.map((v: any) => (
                    <button
                      key={v.id}
                      disabled={!multipleVariations}
                      onClick={() =>
                        setSelectedVariation((prev) => ({ ...prev, [item.id]: v }))
                      }
                      className={`px-2 py-0.5 rounded-md border text-xs ${
                        selectedVar?.id === v.id
                          ? "bg-[#0d3b2e] text-white border-[#0d3b2e]"
                          : "bg-white text-gray-700 border-gray-300"
                      } hover:bg-[#0d3b2e] hover:text-white transition`}
                    >
                      {v.formatted_quantity}
                    </button>
                  ))}
                </div>

                {/* Price */}
                <p className="mt-3 font-semibold text-[#0d3b2e] text-base">₹{selectedVar?.price || 0}</p>

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      if (!selectedVar) return toast.error("Select a variation");
                      addToCart({
                        id: item.id,
                        name: item.name,
                        variationId: selectedVar.id,
                        variationName: selectedVar.formatted_quantity,
                        price: selectedVar.price,
                        image: item.image_url,
                        qty: 1,
                      });
                      toast.success("Added to Cart");
                    }}
                    className="flex-1 bg-[#0d3b2e] text-white py-1 rounded-md hover:bg-[#145c45] transition flex items-center justify-center gap-1 text-sm"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>

                  <button
                    onClick={() => {
                      if (!selectedVar) return toast.error("Select a variation");
                      addToWishlist({
                        id: item.id,
                        name: item.name,
                        variationId: selectedVar.id,
                        variationName: selectedVar.formatted_quantity,
                        price: selectedVar.price,
                        image: item.image_url,
                      });
                      toast.success("Added to Wishlist");
                    }}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition flex items-center justify-center"
                  >
                    <Heart size={18} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <NotFoundItems message="Product Not Found" subMessage="" icon="cart" />
        )}
      </div>
    </main>
  );
}