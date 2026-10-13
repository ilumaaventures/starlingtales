import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import * as productApi from "../services/productApi";
import { BUSINESS_CONFIG } from "../config/businessConfig";
import { PRODUCTS } from "../constants/constants";
import { CartProvider, useCart } from "./CartContext";
import { WishlistProvider, useWishlist } from "./WishlistContext";
import { AuthProvider, useAuth } from "./AuthContext";

export const StoreContext = createContext(null);

export function StoreDataProvider({ children }) {
  const [business, setBusiness] = useState(BUSINESS_CONFIG);
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(["All", "Dolls", "Soft Toys", "Nursery", "Gift Hampers"]);
  const [banners, setBanners] = useState([]);
  const [slides, setSlides] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  const fetchStoreData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Store Details
      const detailsPromise = productApi.getStoreDetails().catch(() => null);
      // 2. Fetch Live Products
      const productsPromise = productApi.getStoreProducts().catch(() => null);
      // 3. Fetch Categories
      const categoriesPromise = productApi.getStoreCategories().catch(() => null);
      // 4. Fetch Banners
      const bannersPromise = productApi.getStoreBanners().catch(() => null);
      // 5. Fetch Policies
      const policiesPromise = productApi.getStorePolicies().catch(() => null);

      const [storeRes, prodRes, catRes, banRes, polRes] = await Promise.all([
        detailsPromise,
        productsPromise,
        categoriesPromise,
        bannersPromise,
        policiesPromise,
      ]);

      if (storeRes && (storeRes._id || storeRes.businessName)) {
        setBusiness((prev) => ({
          ...prev,
          ...storeRes,
          name: storeRes.businessName || prev.name,
        }));
      }

      if (prodRes) {
        const rawList = Array.isArray(prodRes)
          ? prodRes
          : Array.isArray(prodRes?.products)
          ? prodRes.products
          : [];
        if (rawList.length > 0) {
          setProducts(rawList);
        } else {
          // Keep curated constants if empty in DB
          setProducts(PRODUCTS);
        }
      }

      if (catRes) {
        const rawCats = Array.isArray(catRes)
          ? catRes
          : Array.isArray(catRes?.categories)
          ? catRes.categories
          : [];
        if (rawCats.length > 0) {
          const names = rawCats.map((c) => (typeof c === "object" ? c.name : c)).filter(Boolean);
          setCategories(["All", ...new Set(names)]);
        }
      }

      if (banRes) {
        const rawBanners = Array.isArray(banRes)
          ? banRes
          : Array.isArray(banRes?.banners)
          ? banRes.banners
          : [];
        setBanners(rawBanners);
      }

      if (polRes) {
        const rawPolicies = Array.isArray(polRes)
          ? polRes
          : Array.isArray(polRes?.policies)
          ? polRes.policies
          : [];
        setPolicies(rawPolicies);
      }
    } catch (err) {
      console.warn("[Starling Tales] Store live data loading notice:", err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchProducts = useCallback(async () => {
    setIsProductsLoading(true);
    try {
      const prodRes = await productApi.getStoreProducts();
      const rawList = Array.isArray(prodRes)
        ? prodRes
        : Array.isArray(prodRes?.products)
        ? prodRes.products
        : [];
      if (rawList.length > 0) {
        setProducts(rawList);
      }
    } catch (e) {
      console.error("[Starling Tales] refetchProducts error", e);
    } finally {
      setIsProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  const heroBanners = useMemo(
    () => (Array.isArray(banners) ? banners.filter((b) => b.type === "hero") : []),
    [banners]
  );

  const promoBanners = useMemo(
    () =>
      Array.isArray(banners)
        ? banners.filter(
            (b) =>
              b.type === "promotion" ||
              b.type === "flashSale" ||
              b.type === "announcement"
          )
        : [],
    [banners]
  );

  const storeHomePath = "";

  const contextValue = {
    business,
    products,
    categories,
    banners,
    heroBanners,
    promoBanners,
    slides,
    reviews,
    policies,
    storeHomePath,
    loading,
    isProductsLoading,
    refetchStore: fetchStoreData,
    refetchProducts,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}

export function StoreProvider({ children }) {
  return (
    <AuthProvider>
      <StoreDataProvider>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </StoreDataProvider>
    </AuthProvider>
  );
}

export function useStore() {
  const storeCtx = useContext(StoreContext);
  let cartCtx = null;
  let wishlistCtx = null;
  let authCtx = null;

  try {
    cartCtx = useCart();
  } catch (_) {}
  try {
    wishlistCtx = useWishlist();
  } catch (_) {}
  try {
    authCtx = useAuth();
  } catch (_) {}

  return {
    ...(storeCtx || {}),
    ...(cartCtx || {}),
    ...(wishlistCtx || {}),
    ...(authCtx || {}),
  };
}

export { useCart, useWishlist, useAuth };
