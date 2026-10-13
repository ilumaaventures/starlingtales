import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { readStorage } from "../constants/constants";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => readStorage("starling_wishlist", []));

  useEffect(() => {
    try {
      localStorage.setItem("starling_wishlist", JSON.stringify(wishlistItems));
    } catch (e) {
      console.warn("Could not sync wishlist to localStorage", e);
    }
  }, [wishlistItems]);

  const isInWishlist = useCallback((id) => {
    return wishlistItems.some((item) => (item._id === id || item.id === id));
  }, [wishlistItems]);

  const toggleWishlist = useCallback((product) => {
    if (!product) return;
    const pId = product._id || product.id;

    setWishlistItems((prev) => {
      const exists = prev.some((item) => item._id === pId || item.id === pId);
      if (exists) {
        toast.success(`Removed ${product.name || "item"} from your wishlist.`, {
          style: { background: "#37463f", color: "#fffefc" },
        });
        return prev.filter((item) => item._id !== pId && item.id !== pId);
      } else {
        toast.success(`Saved ${product.name || "item"} to your wishlist!`, {
          style: { background: "#37463f", color: "#fffefc" },
        });
        return [...prev, product];
      }
    });
  }, []);

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    toggleWishlist,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
