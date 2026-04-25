// components/NotFoundItems.tsx
"use client";

import { FC } from "react";
import { ShoppingCart, Box, AlertCircle } from "lucide-react";

interface NotFoundItemsProps {
  message: string;          
  subMessage?: string;    
  icon?: "cart" | "box" | "alert"; 
}

const NotFoundItems: FC<NotFoundItemsProps> = ({ message, subMessage, icon = "alert" }) => {
  const renderIcon = () => {
    switch (icon) {
      case "cart":
        return <ShoppingCart size={48} className="text-gray-400" />;
      case "box":
        return <Box size={48} className="text-gray-400" />;
      case "alert":
      default:
        return <AlertCircle size={48} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {renderIcon()}
      <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-700">{message}</h2>
      {subMessage && <p className="mt-2 text-gray-500 text-sm sm:text-base">{subMessage}</p>}
    </div>
  );
};

export default NotFoundItems;
