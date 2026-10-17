import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import toast from "react-hot-toast";
import { readStorage } from "../constants/constants";
import { useAuth } from "./AuthContext";
import {
  getWishlistApi,
  addToWishlistApi,
  removeFromWishlistApi,
  syncWishlistApi,
} from "../services/wishlistApi";

const WishlistContext = createContext(null);

// Normalize product structure returned from API or stored in localStorage
const normalizeWishlistProduct = (item) => {
  if (!item) return null;
  const id = item._id || item.id;
  const image =
    item.image ||
    item.images?.[0]?.url ||
    (typeof item.images?.[0] === "string" ? item.images[0] : "") ||
    "";
  const categoryName =
    typeof item.category === "object" && item.category !== null
      ? item.category?.name || item.category?.title || "General"
      : typeof item.category === "string" && !/^[0-9a-fA-F]{24}$/.test(item.category.trim())
      ? item.category.trim()
      : "General";

  return {
    ...item,
    _id: id,
    id: id,
    name: item.name || "Keepsake",
    price: Number(item.price) || 0,
    originalPrice:
      Number(item.originalPrice) || Number(item.compareAtPrice) || 0,
    image: image,
    category: categoryName,
    inStock: item.stock !== undefined ? item.stock > 0 : true,
  };
};

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(() => {
    const raw = readStorage("starling_wishlist", []);
    return Array.isArray(raw)
      ? raw.map(normalizeWishlistProduct).filter(Boolean)
      : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const hasSyncedAuthRef = useRef(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("starling_wishlist", JSON.stringify(wishlistItems));
    } catch (e) {
      console.warn("Could not sync wishlist to localStorage", e);
    }
  }, [wishlistItems]);

  // Fetch wishlist from backend API
  const fetchWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getWishlistApi();
      if (data && Array.isArray(data.products)) {
        const normalized = data.products
          .map(normalizeWishlistProduct)
          .filter(Boolean);
        setWishlistItems(normalized);
      }
    } catch (err) {
      console.error("[WishlistContext] Failed to fetch wishlist from API:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount and when authentication state changes
  useEffect(() => {
    const handleAuthSync = async () => {
      if (isAuthenticated && !hasSyncedAuthRef.current) {
        hasSyncedAuthRef.current = true;
        const local = readStorage("starling_wishlist", []);
        const localIds = local.map((p) => p._id || p.id).filter(Boolean);
        if (localIds.length > 0) {
          try {
            await syncWishlistApi(localIds);
          } catch (_) {}
        }
      }
      if (!isAuthenticated) {
        hasSyncedAuthRef.current = false;
      }
      fetchWishlist();
    };

    handleAuthSync();
  }, [isAuthenticated, fetchWishlist]);

  const isInWishlist = useCallback(
    (id) => {
      if (!id) return false;
      const strId = String(id);
      return wishlistItems.some(
        (item) => String(item._id || item.id) === strId
      );
    },
    [wishlistItems]
  );

  const addToWishlist = useCallback(
    async (product) => {
      if (!product) return;
      const pId = String(product._id || product.id);
      const normalized = normalizeWishlistProduct(product);

      setWishlistItems((prev) => {
        if (prev.some((item) => String(item._id || item.id) === pId)) {
          return prev;
        }
        return [...prev, normalized];
      });

      toast.success(
        `Saved ${product.name || "item"} to your wishlist!`,
        {
          style: { background: "#37463f", color: "#fffefc" },
        }
      );

      try {
        await addToWishlistApi(pId, product);
      } catch (err) {
        console.error("[WishlistContext] Failed to add to wishlist API:", err);
      }
    },
    []
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      if (!productId) return;
      const pId = String(productId);

      setWishlistItems((prev) =>
        prev.filter((item) => String(item._id || item.id) !== pId)
      );

      toast.success("Removed from your wishlist.", {
        style: { background: "#37463f", color: "#fffefc" },
      });

      try {
        await removeFromWishlistApi(pId);
      } catch (err) {
        console.error("[WishlistContext] Failed to remove from wishlist API:", err);
      }
    },
    []
  );

  const toggleWishlist = useCallback(
    async (product) => {
      if (!product) return;
      const pId = String(product._id || product.id);
      const exists = wishlistItems.some(
        (item) => String(item._id || item.id) === pId
      );

      if (exists) {
        await removeFromWishlist(pId);
      } else {
        await addToWishlist(product);
      }
    },
    [wishlistItems, addToWishlist, removeFromWishlist]
  );

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    isLoadingWishlist: isLoading,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

export default WishlistContext;
