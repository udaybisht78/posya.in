import { Suspense } from "react";
import ShopContent from "./shop-content";
import { Loader2 } from "lucide-react";

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-[#F2EEE9]">
        <Loader2 className="animate-spin text-4xl text-gray-600" />
        <span className="ml-2 text-gray-600">Loading products...</span>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}