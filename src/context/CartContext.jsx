import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import * as cartApi from "../services/cartApi";
import { validateCouponApi } from "../services/couponApi";
import { checkPincodeServiceabilityApi } from "../services/shippingApi";
import { FREE_SHIPPING_THRESHOLD, readStorage } from "../constants/constants";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, openLoginModal } = useAuth();

  const [cartItems, setCartItems] = useState(() =>
    readStorage("starling_cart", [])
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(() =>
    readStorage("starling_coupon", null)
  );

  // Delivery Pincode verification state
  const [deliveryPincode, setDeliveryPincode] = useState(() =>
    readStorage("starling_pincode", "")
  );
  const [pincodeInfo, setPincodeInfo] = useState(() =>
    readStorage("starling_pincode_info", null)
  );
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("starling_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.warn("Could not sync cart to localStorage", e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem("starling_coupon", JSON.stringify(appliedCoupon));
    } catch (_) {}
  }, [appliedCoupon]);

  useEffect(() => {
    try {
      localStorage.setItem("starling_pincode", deliveryPincode);
      localStorage.setItem("starling_pincode_info", JSON.stringify(pincodeInfo));
    } catch (_) {}
  }, [deliveryPincode, pincodeInfo]);

  // Sync with backend when user authenticates
  useEffect(() => {
    const handleUserAuthenticated = async () => {
      const token =
        localStorage.getItem("starling_token") || localStorage.getItem("token");
      if (!token) return;

      try {
        setIsSyncing(true);
        const local = readStorage("starling_cart", []);

        // Filter valid Mongo ObjectIDs for backend sync
        const validBackendItems = local
          .filter((it) => /^[a-f\d]{24}$/i.test(it._id || it.id))
          .map((it) => ({
            product: it._id || it.id,
            quantity: it.quantity || 1,
            variant: it.selectedVariant?.sku || undefined,
          }));

        if (validBackendItems.length > 0) {
          await cartApi.syncCartApi(validBackendItems);
        }

        // Fetch refreshed cart from server
        const serverCart = await cartApi.getCartApi();
        if (serverCart?.items && Array.isArray(serverCart.items)) {
          const customHampers = local.filter(
            (it) => !/^[a-f\d]{24}$/i.test(it._id || it.id)
          );

          const mappedServerItems = serverCart.items.map((it) => {
            const prod = it.product || {};
            const pId = prod._id || it._id;
            const img =
              prod.images?.[0]?.url ||
              (typeof prod.images?.[0] === "string" ? prod.images[0] : "") ||
              prod.image ||
              "https://via.placeholder.com/400x300?text=Starling+Product";

            return {
              _id: pId,
              id: pId,
              name: prod.name || it.name || "Treasured Keepsake",
              title: prod.name || it.name || "Treasured Keepsake",
              price: Number(it.price || prod.price) || 0,
              image: img,
              quantity: it.quantity || 1,
              selectedVariant: it.variant || null,
              selectedVariantKey: it.variant?.sku || "",
              customGiftMessage: it.customGiftMessage || "",
              product: prod,
            };
          });

          setCartItems([...mappedServerItems, ...customHampers]);
        }
      } catch (err) {
        console.warn("Background cart sync failed, retaining local cart:", err);
      } finally {
        setIsSyncing(false);
      }
    };

    window.addEventListener(
      "starling_user_authenticated",
      handleUserAuthenticated
    );
    return () =>
      window.removeEventListener(
        "starling_user_authenticated",
        handleUserAuthenticated
      );
  }, []);

  /**
   * Add To Cart - GATED strictly by Authentication!
   * Without login, items cannot be added into the cart.
   */
  const addToCart = useCallback(
    (
      product,
      qty = 1,
      selectedVariant = null,
      customGiftMessage = ""
    ) => {
      if (!product) return false;

      // STRICT AUTH GATE: Gated by user authentication
      if (!isAuthenticated) {
        toast.error(
          "Please sign in to add treasured keepsakes to your cart ✨",
          {
            icon: "🔒",
            style: {
              background: "#37463f",
              color: "#fffefc",
              fontFamily: "'Outfit', sans-serif",
            },
            duration: 4000,
          }
        );

        if (openLoginModal) {
          openLoginModal(() => {
            // Once logged in, automatically finish adding the item
            addToCart(product, qty, selectedVariant, customGiftMessage);
          });
        }
        return false;
      }

      const pId = product._id || product.id;
      const variantKey = selectedVariant
        ? selectedVariant.sku || selectedVariant.label || ""
        : "";

      setCartItems((prev) => {
        const existingIdx = prev.findIndex(
          (item) =>
            (item._id === pId || item.id === pId) &&
            item.selectedVariantKey === variantKey
        );

        const resolvedPrice = Number(product.price) || 0;
        const resolvedImage =
          product.image ||
          product.images?.[0]?.url ||
          (typeof product.images?.[0] === "string" ? product.images[0] : "") ||
          "https://via.placeholder.com/400x300?text=Starling+Tales";

        if (existingIdx > -1) {
          const next = [...prev];
          next[existingIdx] = {
            ...next[existingIdx],
            quantity: next[existingIdx].quantity + qty,
          };
          return next;
        }

        return [
          ...prev,
          {
            _id: pId,
            id: pId,
            name: product.name || product.title || "Handcrafted Tale",
            title: product.name || product.title || "Handcrafted Tale",
            price: resolvedPrice,
            image: resolvedImage,
            quantity: qty,
            selectedVariant,
            selectedVariantKey: variantKey,
            customGiftMessage: customGiftMessage || "",
            product,
          },
        ];
      });

      // Background API sync for valid backend MongoDB product IDs
      const token =
        localStorage.getItem("starling_token") || localStorage.getItem("token");
      if (token && /^[a-f\d]{24}$/i.test(pId)) {
        cartApi
          .addToCartApi(pId, qty, {
            variantId: selectedVariant?._id || undefined,
            sku: selectedVariant?.sku || undefined,
          })
          .catch((err) =>
            console.warn("Backend addToCart background sync failed:", err)
          );
      }

      toast.success(
        `Added "${product.name || "Item"}" to your keepsake cart!`,
        {
          style: {
            background: "#37463f",
            color: "#fffefc",
            fontFamily: "'Outfit', sans-serif",
          },
        }
      );
      setIsCartOpen(true);
      return true;
    },
    [isAuthenticated, openLoginModal]
  );

  const updateCartQuantity = useCallback((id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id || item.id === id ? { ...item, quantity: qty } : item
      )
    );

    const token =
      localStorage.getItem("starling_token") || localStorage.getItem("token");
    if (token && /^[a-f\d]{24}$/i.test(id)) {
      cartApi
        .updateCartQuantityApi(id, qty)
        .catch((err) => console.warn("Backend update quantity sync failed:", err));
    }
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) =>
      prev.filter((item) => item._id !== id && item.id !== id)
    );

    const token =
      localStorage.getItem("starling_token") || localStorage.getItem("token");
    if (token && /^[a-f\d]{24}$/i.test(id)) {
      cartApi
        .removeFromCartApi(id)
        .catch((err) => console.warn("Backend remove item sync failed:", err));
    }

    toast.success("Item removed from cart.", {
      style: {
        background: "#37463f",
        color: "#fffefc",
      },
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
    const token =
      localStorage.getItem("starling_token") || localStorage.getItem("token");
    if (token) {
      cartApi
        .clearCartApi()
        .catch((err) => console.warn("Backend clear cart sync failed:", err));
    }
  }, []);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) =>
        acc + (Number(item.price) || 0) * (item.quantity || 1),
      0
    );
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cartItems]);

  // Coupon calculations
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return Math.min(cartSubtotal, Number(appliedCoupon.discountAmount) || 0);
  }, [appliedCoupon, cartSubtotal]);

  const applyCoupon = useCallback(
    async (code) => {
      try {
        const result = await validateCouponApi({
          code,
          cartItems,
          subtotal: cartSubtotal,
        });
        setAppliedCoupon(result);
        toast.success(result.message, {
          style: {
            background: "#37463f",
            color: "#fffefc",
          },
        });
        return result;
      } catch (err) {
        toast.error(err.message || "Failed to apply coupon.");
        throw err;
      }
    },
    [cartItems, cartSubtotal]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    toast.success("Coupon removed from your cart.");
  }, []);

  // Pincode Delivery Check
  const verifyDeliveryPincode = useCallback(
    async (pin) => {
      setIsCheckingPincode(true);
      try {
        const result = await checkPincodeServiceabilityApi(pin, {
          subtotal: cartSubtotal,
        });
        setDeliveryPincode(pin);
        setPincodeInfo(result);
        if (result.serviceable) {
          toast.success(result.message, {
            icon: "📍",
          });
        } else {
          toast.error(result.message);
        }
        return result;
      } finally {
        setIsCheckingPincode(false);
      }
    },
    [cartSubtotal]
  );

  const clearPincode = useCallback(() => {
    setDeliveryPincode("");
    setPincodeInfo(null);
  }, []);

  const freeShippingRemaining = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - cartSubtotal
  );
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const isShippingWaived = appliedCoupon?.code === "HEIRLOOM";
  const shadowfaxRate =
    pincodeInfo?.shippingFee != null ? Number(pincodeInfo.shippingFee) : 69;
  const shippingFee =
    isFreeShipping || cartSubtotal === 0 || isShippingWaived ? 0 : shadowfaxRate;

  const value = {
    cartItems,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    freeShippingRemaining,
    isFreeShipping,
    isShippingWaived,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    isSyncing,
    // Coupon system
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    // Pincode & Shadowfax validation
    deliveryPincode,
    pincodeInfo,
    shippingFee,
    shadowfaxRate,
    courierPartner: pincodeInfo?.courierPartner || "Shadowfax Logistics",
    deliveryDate: pincodeInfo?.deliveryDate || null,
    isCheckingPincode,
    verifyDeliveryPincode,
    clearPincode,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
