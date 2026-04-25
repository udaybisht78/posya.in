import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import { WishlistProvider } from "@/components/WishlistContext"; 
import { Toaster } from "react-hot-toast";
import GlobalProgress from "@/components/GlobalProgress";

export const metadata: Metadata = {
  title: "posya.in | Pure. Organic. Sensitive. Young. Adapt",
  description: "Posya provides you a gateway to Vedic Wellness and Organic Harmony.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap');
        </style>
      </head>
      <body
        className=""
      >
        <GlobalProgress />
        <CartProvider>
          <WishlistProvider>
        <Header />
        {children}
         <Footer />
         <Toaster position="top-right" />
         </WishlistProvider>
      </CartProvider>
      </body>
    </html>
  );
}
