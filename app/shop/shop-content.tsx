"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import { Heart, ShoppingCart, Search, ChevronRight, X, IndianRupee, SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import NotFoundItems from "@/components/ItemNotFound";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/* ─────────────────────────────────────────────
   Sidebar extracted OUTSIDE the main component
   so it never remounts on parent re-render,
   which was causing the search input to lose
   focus after every keystroke.
───────────────────────────────────────────── */
interface SidebarProps {
  search: string;
  setSearch: (v: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  products: any[];
  priceRange: number[];
  setPriceRange: (v: number[]) => void;
  maxPrice: number;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  closeMobile?: () => void;
}

function SidebarPanel({
  search, setSearch, categories, selectedCategory, setSelectedCategory,
  products, priceRange, setPriceRange, maxPrice, hasActiveFilters, clearFilters, closeMobile,
}: SidebarProps) {
  return (
    <div className="shop-sidebar-inner">

      {/* Search */}
      <div className="shop-sidebar-block">
        <h4 className="shop-sidebar-block-title">Search</h4>
        <div className="shop-search-wrap">
          <Search size={14} className="shop-search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shop-search-input"
            autoComplete="off"
          />
          {search && (
            <button onClick={() => setSearch("")} className="shop-search-clear">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="shop-sidebar-block">
        <h4 className="shop-sidebar-block-title">Categories</h4>
        <ul className="shop-cat-list">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => { setSelectedCategory(cat); closeMobile?.(); }}
                className={`shop-cat-item ${selectedCategory === cat ? "shop-cat-item--active" : ""}`}
              >
                <ChevronRight size={13} className="shop-cat-arrow" />
                {cat}
                <span className="shop-cat-count">
                  {cat === "All" ? products.length : products.filter(p => p.category_name === cat).length}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="shop-sidebar-block">
        <h4 className="shop-sidebar-block-title">Price Range</h4>
        <div className="shop-price-display">
          <span className="shop-price-tag">₹{priceRange[0].toLocaleString()}</span>
          <span className="shop-price-dash">—</span>
          <span className="shop-price-tag">₹{priceRange[1].toLocaleString()}</span>
        </div>
        <div className="shop-price-slider-wrap">
          <input
            type="range" min={0} max={maxPrice} step={100}
            value={priceRange[0]}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), priceRange[1] - 100);
              setPriceRange([val, priceRange[1]]);
            }}
            className="shop-range"
          />
          <input
            type="range" min={0} max={maxPrice} step={100}
            value={priceRange[1]}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), priceRange[0] + 100);
              setPriceRange([priceRange[0], val]);
            }}
            className="shop-range"
          />
        </div>
        <div className="shop-price-minmax">
          <span>₹0</span>
          <span>₹{maxPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button onClick={clearFilters} className="shop-clear-btn">
          <X size={13} /> Clear All Filters
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main page component
───────────────────────────────────────────── */
export default function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedVariation, setSelectedVariation] = useState<{ [key: number]: any }>({});
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

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
          let max = 0;
          data.products.forEach((p: any) => p.variations?.forEach((v: any) => { if (parseFloat(v.price) > max) max = parseFloat(v.price); }));
          setMaxPrice(max || 100000);
          setPriceRange([0, max || 100000]);
          const defaultVar: { [key: number]: any } = {};
          data.products.forEach((p: any) => { defaultVar[p.id] = p.variations?.[0] || null; });
          setSelectedVariation(defaultVar);
          const catFromQuery = searchParams.get("category");
          if (catFromQuery && uniqueCats.includes(catFromQuery)) setSelectedCategory(catFromQuery);
        }
        setLoading(false);
      })
      .catch(() => { toast.error("Failed to load products"); setLoading(false); });
  }, [searchParams]);

  useEffect(() => {
    let result = [...products];
    if (search.trim()) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (selectedCategory !== "All") result = result.filter((p) => p.category_name === selectedCategory);
    result = result.filter((p) => {
      const prices = p.variations?.map((v: any) => parseFloat(v.price)) || [0];
      return Math.max(...prices) >= priceRange[0] && Math.min(...prices) <= priceRange[1];
    });
    setFiltered(result);
  }, [search, selectedCategory, priceRange, products]);

  const clearFilters = () => { setSearch(""); setSelectedCategory("All"); setPriceRange([0, maxPrice]); };
  const hasActiveFilters = !!(search || selectedCategory !== "All" || priceRange[1] < maxPrice);

  const sidebarProps: SidebarProps = {
    search, setSearch, categories, selectedCategory, setSelectedCategory,
    products, priceRange, setPriceRange, maxPrice, hasActiveFilters, clearFilters,
  };

  if (loading) return (
    <div className="shop-loading">
      <div className="shop-spinner" />
      <p>Loading products...</p>
    </div>
  );

  return (
    <main className="min-h-screen" style={{ background: "#f2eee9" }}>

      {/* Hero */}
      <section
        className="relative w-full bg-cover bg-center py-20 text-white"
        style={{ backgroundImage: "url('/images/naturalBgImage.webp')" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(43,26,6,0.70)" }} />
        <div className="relative z-10 text-center px-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#cb8836" }}>Posya Store</p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif" }}>Our Collection</h1>
          <p className="text-white/75 mt-2 text-sm">Pure, natural & handcrafted with love</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Mobile filter button */}
        <button className="shop-mobile-filter-btn" onClick={() => setMobileSidebarOpen(true)}>
          <SlidersHorizontal size={15} /> Filters
          {hasActiveFilters && <span className="shop-filter-dot" />}
        </button>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="shop-mobile-overlay" onClick={() => setMobileSidebarOpen(false)}>
            <div className="shop-mobile-sidebar" onClick={(e) => e.stopPropagation()}>
              <div className="shop-mobile-sidebar-header">
                <span>Filters</span>
                <button onClick={() => setMobileSidebarOpen(false)}><X size={18} /></button>
              </div>
              <SidebarPanel {...sidebarProps} closeMobile={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main layout */}
        <div className="shop-layout">

          {/* Left Sidebar */}
          <aside className="shop-sidebar">
            <SidebarPanel {...sidebarProps} />
          </aside>

          {/* Right: Products */}
          <div className="shop-main">
            <div className="shop-topbar">
              <p className="shop-results-count">
                <strong>{filtered.length}</strong> product{filtered.length !== 1 ? "s" : ""}
                {selectedCategory !== "All" && <> in <em>{selectedCategory}</em></>}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="shop-clear-inline">
                  <X size={12} /> Clear filters
                </button>
              )}
            </div>

            {filtered.length > 0 ? (
              <div className="shop-grid">
                {filtered.map((item) => {
                  const selectedVar = selectedVariation[item.id];
                  const multipleVariations = item.variations?.length > 1;
                  return (
                    <div key={item.id} className="shop-card group">
                      {item.category_name && <span className="shop-card-badge">{item.category_name}</span>}

                      <Link href={`/product/${item.slug}`} className="shop-card-img-wrap">
                        <Image src={item.image_url || "/placeholder.png"} alt={item.name} fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        <button className="shop-card-wish-btn" onClick={(e) => {
                          e.preventDefault();
                          if (!selectedVar) return toast.error("Select a variation");
                          addToWishlist({ id: item.id, name: item.name, variationId: selectedVar.id, variationName: selectedVar.formatted_quantity, price: selectedVar.price, image: item.image_url });
                          toast.success("Added to Wishlist");
                        }}><Heart size={15} /></button>
                      </Link>

                      <div className="shop-card-body">
                        <Link href={`/product/${item.slug}`}>
                          <h3 className="shop-card-title">{item.name}</h3>
                        </Link>
                        <p className="shop-card-desc">{item.productDescription}</p>

                        {item.variations?.length > 0 && (
                          <div className="shop-card-variations">
                            {item.variations.map((v: any) => (
                              <button key={v.id} disabled={!multipleVariations}
                                onClick={() => setSelectedVariation((prev) => ({ ...prev, [item.id]: v }))}
                                className={`shop-variation-btn ${selectedVar?.id === v.id ? "shop-variation-btn--active" : ""}`}>
                                {v.formatted_quantity}
                              </button>
                            ))}
                          </div>
                        )}

                        <p className="shop-card-price">
                          <IndianRupee size={14} className="inline" />
                          {selectedVar?.price || 0}
                        </p>

                        <div className="shop-card-actions">
                          <button className="shop-btn-cart" onClick={() => {
                            if (!selectedVar) return toast.error("Select a variation");
                            addToCart({ id: item.id, name: item.name, variationId: selectedVar.id, variationName: selectedVar.formatted_quantity, price: selectedVar.price, image: item.image_url, qty: 1 });
                            toast.success("Added to Cart");
                          }}><ShoppingCart size={14} /> Add to Cart</button>
                          <button className="shop-btn-wish" onClick={() => {
                            if (!selectedVar) return toast.error("Select a variation");
                            addToWishlist({ id: item.id, name: item.name, variationId: selectedVar.id, variationName: selectedVar.formatted_quantity, price: selectedVar.price, image: item.image_url });
                            toast.success("Added to Wishlist");
                          }}><Heart size={15} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <NotFoundItems message="No Products Found" subMessage="Try adjusting your filters" icon="cart" />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}