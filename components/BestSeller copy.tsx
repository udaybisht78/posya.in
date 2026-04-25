"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, IndianRupee } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import toast from "react-hot-toast";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import { useRouter } from "next/navigation";
import TopHeading from "./TopHeading";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const PRODUCTS_PER_PAGE = 8;

export default function Bestseller() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Sirf 8 products backend se fetch karo
    fetch(`${BASE_URL}products?limit=8`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.products) {
          setDisplayedProducts(data.products);
          setHasMore(data.has_more); // Backend se check karo ke aur products hain
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLoadMore = () => {
    router.push('/shop');
  };

  const handleAddToCart = (product: any, variation: any = null) => {
    const price = variation?.price || product?.variations?.[0]?.price || 0;
    const image = product.all_images?.[0] || product.image_url;

    addToCart({
      id: product.id,
      name: product.name,
      price,
      qty: 1,
      image,
      variationId: variation?.id,
      variationName: variation?.formatted_quantity,
      tax_rate: variation?.tax_rate,
      tax_name: variation?.tax_name,
    });
    toast.success(`${product.name} added to cart!`);
    setCartOpen(true);
  };

  const handleAddToWishlist = (product: any, variation: any = null) => {
    const image = product.all_images?.[0] || product.image_url;
    const price = variation?.price || product.sale_price || product?.variations?.[0]?.price || 0;

    addToWishlist({
      id: product.id,
      name: product.name,
      price,
      image,
      variationId: variation?.id,
      variationName: variation?.formatted_quantity,
      tax_rate: variation?.tax_rate,
      tax_name: variation?.tax_name,
    });

    toast.success(`${product.name} added to wishlist!`);
    setWishlistOpen(true);
  };

  return (
    <section className="bg-[#F2EEE9] py-12 px-4 md:px-12">
      <TopHeading heading="Featured Products" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          : displayedProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddCart={handleAddToCart}
                onAddWishlist={handleAddToWishlist}
              />
            ))}
      </div>

      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-[#0d3b2e] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#0a2a20] transition"
          >
            Load More Products
          </button>
        </div>
      )}

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </section>
  );
}

function ProductSkeleton() {
  return (
    <div className="flex flex-col items-center bg-white shadow-md rounded-xl overflow-hidden animate-pulse">
      <div className="w-full h-50 sm:h-56 bg-gray-200" />
      <div className="w-full px-3 py-3 flex flex-col items-center space-y-2">
        <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
        <div className="flex flex-wrap justify-center gap-1 mt-2">
          <div className="h-5 w-10 bg-gray-200 rounded"></div>
          <div className="h-5 w-10 bg-gray-200 rounded"></div>
          <div className="h-5 w-10 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <div className="h-5 w-6 bg-gray-200 rounded"></div>
          <div className="h-5 w-10 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between items-center w-full mt-3 gap-2">
          <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAddCart, onAddWishlist }: any) {
  const [imgIndex, setImgIndex] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<any>(product?.variations?.[0] || null);
  const images = product.all_images?.length ? product.all_images : [product.image_url];
  const router = useRouter();

  const nextImage = () => setImgIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setImgIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(nextImage, 3500);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const goToProductPage = () => router.push(`/product/${product.slug}`);

  return (
    <div className="relative flex flex-col items-center bg-white shadow-md rounded-xl overflow-hidden group hover:shadow-xl transition cursor-pointer">
      <div className="relative w-full overflow-hidden h-50 sm:h-56 cursor-pointer" onClick={goToProductPage}>
        <div className="flex transition-transform duration-700 ease-in-out h-full" style={{ transform: `translateX(-${imgIndex * 100}%)` }}>
          {images.map((img: string, i: number) => (
            <div key={i} className="relative flex-shrink-0 w-full h-full">
              <Image src={img} alt={`${product.name}-${i}`} fill className="object-cover w-full h-full" />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-1 rounded-full hover:bg-gray-100">
              <ChevronLeft size={18} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-1 rounded-full hover:bg-gray-100">
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); goToProductPage(); }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#0d3b2e] text-white py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transition viewProductButton"
        >
          View Product
        </button>
      </div>

      <div className="w-full px-3 py-3 flex flex-col items-center">
        <h3 onClick={goToProductPage} className="mt-2 text-lg font-semibold text-gray-800 text-center cursor-pointer hover:text-[#0d3b2e]">
          {product.name}
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 text-center mt-1">
          {product.productDescription}
        </p>

        {product.variations?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {product.variations.map((v: any) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariation(v)}
                className={`px-2 py-1 text-xs border rounded transition ${
                  selectedVariation?.id === v.id
                    ? "bg-[#0d3b2e] text-white border-[#0d3b2e]"
                    : "border-gray-300 hover:bg-[#0d3b2e] hover:text-white"
                }`}
              >
                {v.formatted_quantity}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center mt-2 gap-1 text-[#0d3b2e] font-bold text-base sm:text-lg">
          <IndianRupee size={18} className="text-[#0d3b2e]" />
          <span>{selectedVariation?.price || product.sale_price || product.variations?.[0]?.price || 0}</span>
        </div>

        <div className="flex justify-between items-center w-full mt-3 gap-2">
          <button onClick={() => onAddCart(product, selectedVariation)} className="flex-1 border border-[#0d3b2e] py-2 flex justify-center items-center gap-2 hover:bg-[#0d3b2e] hover:text-white transition rounded-md text-sm">
            <ShoppingCart size={16} /> Cart
          </button>
          <button onClick={() => onAddWishlist(product, selectedVariation)} className="flex-1 border border-[#0d3b2e] py-2 flex justify-center items-center gap-2 hover:bg-[#0d3b2e] hover:text-white transition rounded-md text-sm wishListButton">
            <Heart size={16} /> Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}