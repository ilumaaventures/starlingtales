import React, { useEffect, useMemo, useState } from "react";
import "../styles/StarlingTales.css";
import {
  PRODUCTS,
  RESIDENTS,
  navLinks,
  pillars,
  FREE_SHIPPING_THRESHOLD,
  formatPrice,
  readStorage,
} from "../constants/constants";
import Icon from "../components/Icon";
import Botanical from "../components/Botanical";
import HeartDivider from "../components/HeartDivider";
import ButtonLink from "../components/ButtonLink";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import ResidentCard from "../components/ResidentCard";
import ResidentModal from "../components/ResidentModal";
import CartDrawer from "../components/CartDrawer";

function Residents() {
  // Cart, wishlist and dialog states
  const [cart, setCart] = useState(() => readStorage("starling_cart", []));
  const [wishlist, setWishlist] = useState(() =>
    readStorage("starling_wishlist", []),
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [quickViewId, setQuickViewId] = useState(null);
  const [activeResident, setActiveResident] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("starling_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("starling_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Derived variables
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const categories = useMemo(() => {
    const list = new Set(PRODUCTS.map((p) => p.category));
    return ["All", ...Array.from(list)];
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const quickViewProduct = useMemo(() => {
    if (!quickViewId) return null;
    return PRODUCTS.find((p) => p.id === quickViewId) || null;
  }, [quickViewId]);

  // Cart operations
  const handleAddToCart = (productId, sku, qty = 1) => {
    setCart((prev) => {
      const product = PRODUCTS.find((p) => p.id === productId);
      const variant = product?.variants.find((v) => v.sku === sku);
      const label = variant ? variant.label : "";

      const existIndex = prev.findIndex(
        (item) => item.productId === productId && item.sku === sku,
      );
      if (existIndex > -1) {
        const next = [...prev];
        next[existIndex] = {
          ...next[existIndex],
          quantity: next[existIndex].quantity + qty,
        };
        return next;
      }

      return [...prev, { productId, sku, variantLabel: label, quantity: qty }];
    });

    // Automatically trigger cart drawer view when adding items
    setCartOpen(true);
  };

  const handleUpdateQty = (productId, sku, newQty) => {
    if (newQty < 1) {
      handleRemoveFromCart(productId, sku);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.sku === sku
          ? { ...item, quantity: newQty }
          : item,
      ),
    );
  };

  const handleRemoveFromCart = (productId, sku) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.sku === sku),
      ),
    );
  };

  const handleWishlistToggle = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const handleAdoptResident = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      handleAddToCart(productId, product.variants[0]?.sku, 1);
      setActiveResident(null);
    }
  };

  const handleCheckout = () => {
    alert(
      "Thank you for shopping with Starling Tales! Checkout is currently simulated.",
    );
    setCart([]);
    setCartOpen(false);
  };

  return (
    <section
      id="our-residents"
      className="py-10 px-6 max-w-7xl mx-auto space-y-12 scroll-mt-20 mb-20"
    >
      <div className="text-center space-y-3.5">
        <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-blue-soft block">
          Meet the Storytellers
        </span>
        <h2 className="text-3xl font-display font-semibold text-text-dark">
          Our Beloved Residents
        </h2>
        <HeartDivider />
        <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed font-light">
          Every creation has their own unique personality, favorite quirks, and
          whimsical background stories. Meet our residents!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {RESIDENTS.map((resident) => (
          <ResidentCard
            key={resident.id}
            resident={resident}
            onOpenStory={setActiveResident}
          />
        ))}
      </div>
      {activeResident ? (
        <ResidentModal
          resident={activeResident}
          onClose={() => setActiveResident(null)}
          onAdopt={(productId) => {
            setActiveResident(null);
            setActiveProductId(productId);
          }}
        />
      ) : null}
    </section>
  );
}

export default Residents;
