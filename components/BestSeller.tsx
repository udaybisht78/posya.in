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

export default function Bestseller() {
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`${BASE_URL}products?limit=8`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.products) {
          setDisplayedProducts(data.products);
          setHasMore(data.has_more);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLoadMore = () => router.push("/shop");

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
    <section className="bs-section">
      <TopHeading heading="Featured Products" />

      <div className="bs-grid">
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
        <div className="bs-loadmore-wrap">
          <button onClick={handleLoadMore} className="bs-loadmore-btn">
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
    <div className="bs-card animate-pulse">
      <div className="bs-card-img-wrap bg-gray-200" />
      <div className="bs-card-body">
        <div className="h-5 w-3/4 bg-gray-200 rounded mx-auto mb-2" />
        <div className="h-3 w-5/6 bg-gray-200 rounded mx-auto mb-3" />
        <div className="flex flex-wrap justify-center gap-1 mb-3">
          <div className="h-6 w-12 bg-gray-200 rounded" />
          <div className="h-6 w-12 bg-gray-200 rounded" />
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded mx-auto mb-3" />
        <div className="flex gap-2">
          <div className="h-9 flex-1 bg-gray-200 rounded" />
          <div className="h-9 flex-1 bg-gray-200 rounded" />
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
    <div className="bs-card group">
      {/* Image Slider */}
      <div className="bs-card-img-wrap" onClick={goToProductPage}>
        <div
          className="bs-card-img-slider"
          style={{ transform: `translateX(-${imgIndex * 100}%)` }}
        >
          {images.map((img: string, i: number) => (
            <div key={i} className="bs-card-img-slide">
              <Image src={img} alt={`${product.name}-${i}`} fill className="object-cover" />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button className="bs-img-nav bs-img-nav--left" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
              <ChevronLeft size={16} />
            </button>
            <button className="bs-img-nav bs-img-nav--right" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
              <ChevronRight size={16} />
            </button>
          </>
        )}

        <button
          className="bs-view-btn"
          onClick={(e) => { e.stopPropagation(); goToProductPage(); }}
        >
          View Product
        </button>
      </div>

      {/* Card Body */}
      <div className="bs-card-body">
        <h3 className="bs-product-name" onClick={goToProductPage}>
          {product.name}
        </h3>

        {product.productDescription && (
          <p className="bs-product-desc">{product.productDescription}</p>
        )}

        {product.variations?.length > 0 && (
          <div className="bs-variations">
            {product.variations.map((v: any) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariation(v)}
                className={`bs-variation-btn ${selectedVariation?.id === v.id ? "bs-variation-btn--active" : ""}`}
              >
                {v.formatted_quantity}
              </button>
            ))}
          </div>
        )}

        <div className="bs-price">
          <IndianRupee size={16} />
          <span>{selectedVariation?.price || product.sale_price || product.variations?.[0]?.price || 0}</span>
        </div>

        <div className="bs-card-actions">
          <button className="bs-btn-cart" onClick={() => onAddCart(product, selectedVariation)}>
            <ShoppingCart size={15} /> Cart
          </button>
          <button className="bs-btn-wishlist" onClick={() => onAddWishlist(product, selectedVariation)}>
            <Heart size={15} /> Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}