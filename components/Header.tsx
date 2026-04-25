"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, Heart, ShoppingBag, Menu, X, LogOut, User } from "lucide-react";
import PosysLogo from "../public/images/l1.png";
import Link from "next/link";
import SearchPopUp from "./SearchPopUp";
import CartDrawer from "./CartDrawer";
import { useCart } from "./CartContext";
import WishlistDrawer from "./WishlistDrawer";
import { useWishlist } from "./WishlistContext";
import { usePathname } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


// JWT decode alternative (no default import)
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function Header() {
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showSearchBar, setSearchbar] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { cartItems } = useCart();
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const { wishlistItems } = useWishlist();
  const totalWishlist = wishlistItems.length;

  // Token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Instant initials load
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    token ? parseJwt(token) : null
  );


const [offerText, setOfferText] = useState("");

useEffect(() => {
  const fetchOffer = async () => {
    try {
      const res = await fetch(`${BASE_URL}getOfferText`);
      const json = await res.json();
      setOfferText(json.data.text);
    } catch (error) {
      console.error("Failed to fetch offer text", error);
    }
  };
  fetchOffer();
}, []);

// Fetch fresh user data (optional)
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    };

    fetchUser();
  }, [token]);

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setShowUserMenu(false);
  };

  // Navigation links
  const navLinks = [
    { href: "/our-story", label: "Brand Essence" },
    { href: "/shop", label: "Our Collection" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <>
      {/* Top Banner
      <div
        className={`bg-[#cb8836] text-white text-center text-xs tracking-wide py-2 transition-all duration-300 ${
          isSticky ? "hidden" : ""
        }`}
      >
        {offerText || "Welcome to POSYA!"}
      </div>
      */}
     <header
    className={`px-6 shadow-sm flex items-center z-50 bg-white transition-all duration-300 ease-in-out ${
    isSticky
      ? "fixed top-0 left-0 right-0 shadow-lg py-2"
      : "relative py-1"
  }`}
>
  {/* LEFT – LOGO */}
  <div className="flex items-center gap-4 flex-1">
    {/* Mobile Menu Button */}
    <button className="lg:hidden z-50" onClick={() => setMobileMenu(!mobileMenu)}>
      {mobileMenu ? <X size={28} /> : <Menu size={28} />}
    </button>
    <Link href="/">
      <Image
        src={PosysLogo}
        alt="Posya Logo"
        width={isSticky ? 45 : 65}
        height={isSticky ? 45 : 65}
        className="transition-all duration-300"
      />
    </Link>
  </div>

  {/* CENTER – NAVIGATION */}
  <nav className="hidden lg:flex flex-1 justify-center gap-8 text-sm uppercase tracking-wide primary-nav">
    {navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={`transition-colors ${
          pathname === link.href
            ? "text-green-600"
            : "text-[#0d3b2e] hover:text-gray-700 nav-link"
        }`}
      >
        {link.label}
      </Link>
    ))}
  </nav>

  {/* RIGHT – LOGIN / ICONS */}
  <div className="flex items-center gap-3 lg:gap-5 flex-1 justify-end">
    {/* User Menu */}
    <div className="relative hidden md:block">
      {user ? (
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-7 h-7 rounded-full bg-[#0d3b2e] flex items-center justify-center text-white font-semibold text-[14px]">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm font-semibold login-buttons">
          <Link href="/login" className="hover:underline">
            Login
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="/register" className="hover:underline">
            Register
          </Link>
        </div>
      )}
    </div>

    <Search onClick={() => setSearchbar(true)} className="cursor-pointer" size={22} />

    <div className="relative cursor-pointer" onClick={() => setShowWishlist(true)}>
      <Heart size={22} />
      {totalWishlist > 0 && (
        <span className="absolute -top-2 -right-2 primart-bg text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalWishlist}
        </span>
      )}
    </div>

    <div className="relative cursor-pointer" onClick={() => setShowCart(true)}>
      <ShoppingBag size={22} />
      {totalQty > 0 && (
        <span className="absolute -top-2 -right-2 primart-bg text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalQty}
        </span>
      )}
    </div>
  </div>
</header>


      {/* Mobile Side Drawer */}
      <div
        className={`fixed mobNav inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
          mobileMenu ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileMenu(false)}
      >
        <div
          className={`fixed top-0 left-0 h-full w-[85%] bg-[#fcf9f2] shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
            mobileMenu ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-[#0d3b2e]">Menu</h2>
              <button onClick={() => setMobileMenu(false)}>
                <X size={24} className="text-[#0d3b2e]" />
              </button>
            </div>

            {/* User Info in Mobile Menu - Only if logged in */}
            {user && (
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#0d3b2e] flex items-center justify-center text-white font-semibold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="block w-full text-center py-2.5 text-sm font-medium text-[#0d3b2e] border border-[#0d3b2e] rounded-lg hover:bg-[#0d3b2e] hover:text-white transition-colors mb-2"
                  onClick={() => setMobileMenu(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenu(false);
                  }}
                  className="w-full text-center py-2.5 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}

            <nav className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block text-lg py-2 border-b border-gray-300 transition-colors ${
                    pathname === link.href
                      ? "text-green-600 font-semibold"
                      : "text-[#0d3b2e] hover:text-gray-700"
                  }`}
                  onClick={() => setMobileMenu(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Login/Register at Bottom - Only if not logged in */}
          {!user && (
            <div className="p-6 bg-white border-t border-gray-200 space-y-3">
              <p className="text-xs text-center text-gray-600 mb-3">Join Posya Community</p>
              <Link
                href="/login"
                className="block w-full text-center py-3 text-sm font-semibold text-white bg-[#0d3b2e] rounded-lg hover:bg-[#0a2e23] transition-all shadow-md"
                onClick={() => setMobileMenu(false)}
              >
                Login to Your Account
              </Link>
              <Link
                href="/register"
                className="block w-full text-center py-3 text-sm font-semibold text-[#0d3b2e] bg-white border-2 border-[#0d3b2e] rounded-lg hover:bg-[#0d3b2e] hover:text-white transition-all"
                onClick={() => setMobileMenu(false)}
              >
                Create New Account
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Spacer when sticky */}
      {isSticky && <div className="h-[55px]"></div>}

      <WishlistDrawer isOpen={showWishlist} onClose={() => setShowWishlist(false)} />
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
      <SearchPopUp isOpen={showSearchBar} onClose={() => setSearchbar(false)} />
    </>
  );
}