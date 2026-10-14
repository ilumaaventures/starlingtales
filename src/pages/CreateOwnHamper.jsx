import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Gift,
  Heart,
  Sparkles,
  ShoppingBag,
  Check,
  Trash2,
  CheckCircle2,
  Info,
  Feather,
  Plus,
  Minus,
  Search,
  ArrowRight,
  Package,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";

import "../styles/StarlingTales.css";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../constants/constants";
import { ProductGridSkeleton } from "../components/StarlingSkeletons";
import HeartDivider from "../components/HeartDivider";
import CartDrawer from "../components/CartDrawer";

// Local Hamper Packaging Assets
import hamper1 from "../assets/hamper-1 (1).jpeg";
import hamper2 from "../assets/hamper-1 (2).jpeg";
import hamper3 from "../assets/hamper-1 (3).jpeg";
import hamper4 from "../assets/hamper-1 (4).jpeg";

// Baskets Available for Hamper Styling
const BASKET_OPTIONS = [
  {
    id: "basket-woven",
    name: "Heirloom Woven Rope Basket",
    subtitle:
      "Organic cotton rope basket with handles. Everyday nursery storage.",
    price: 0,
    capacity: 6,
    dimensions: "32cm × 24cm × 16cm",
    image: hamper1,
    badge: "Most Popular",
  },
  {
    id: "basket-wooden",
    name: "Artisanal Pinewood Keepsake Trunk",
    subtitle:
      "Solid pine wood with antique brass latch for milestone memories.",
    price: 0,
    capacity: 8,
    dimensions: "36cm × 26cm × 18cm",
    image: hamper2,
    badge: "Luxury Trunk",
  },
  {
    id: "basket-velvet",
    name: "Forest Emerald Keepsake Chest",
    subtitle: "Tactile forest emerald velvet box with satin ribbon closure.",
    price: 0,
    capacity: 5,
    dimensions: "30cm × 22cm × 14cm",
    image: hamper4,
    badge: "Festive Box",
  },
  {
    id: "basket-linen",
    name: "Minimalist Linen Nursery Caddy",
    subtitle: "Multi-pocket organizer crafted in soft woven oatmeal linen.",
    price: 0,
    capacity: 5,
    dimensions: "28cm × 20cm × 15cm",
    image: hamper3,
    badge: "Nursery Caddy",
  },
];

export default function CreateOwnHamper() {
  const navigate = useNavigate();
  const {
    products: apiProducts,
    storeHomePath: contextHomePath,
    business,
    loading = false,
    isProductsLoading = false,
    addToCart,
    clearCart,
  } = useStore();

  const storeHomePath =
    contextHomePath ||
    (business?.subdomain
      ? `/${encodeURIComponent(business.subdomain)}`
      : business?.slug
        ? `/${encodeURIComponent(business.slug)}`
        : business?.businessName
          ? `/${encodeURIComponent(business.businessName)}`
          : "");

  // Builder State: Direct & Simple
  const [selectedBasket, setSelectedBasket] = useState(BASKET_OPTIONS[0]);
  const [selectedItems, setSelectedItems] = useState([]); // [{ product, quantity }]
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBasketSelector, setShowBasketSelector] = useState(false);
  const [showNoteOptions, setShowNoteOptions] = useState(false);

  // Optional Note
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [cardMessage, setCardMessage] = useState(
    "Welcome to the world, precious little one! May your days be filled with wonder and love.",
  );

  // Cart Drawer
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Filter Nursery Collection Products directly
  const nurseryProducts = useMemo(() => {
    const rawList = Array.isArray(apiProducts) ? apiProducts : [];

    return rawList
      .filter((p) => {
        const catName = (
          p.category?.name ||
          p.category?.title ||
          (typeof p.category === "string" ? p.category : "") ||
          p.categoryName ||
          ""
        ).toLowerCase();

        const name = (p.name || "").toLowerCase();
        const tags = Array.isArray(p.tags)
          ? p.tags.map((t) => String(t).toLowerCase())
          : [];

        // Exclude pre-made hampers
        const isPreMadeHamper =
          catName.includes("hamper") ||
          catName.includes("gift set") ||
          tags.includes("all hampers") ||
          name.includes("hamper") ||
          name.includes("gift set") ||
          name.includes("trunk set") ||
          name.includes("basket set");

        return !isPreMadeHamper;
      })
      .map((p) => {
        const img =
          p.image ||
          p.images?.[0]?.url ||
          (typeof p.images?.[0] === "string" ? p.images[0] : null) ||
          "https://starlingtales.vercel.app/11.jpeg";

        const rawCat = (
          p.category?.name ||
          p.category?.title ||
          (typeof p.category === "string" ? p.category : "") ||
          p.categoryName ||
          ""
        ).toLowerCase();

        let groupCat = "Nursery Essentials";
        if (
          rawCat.includes("doll") ||
          rawCat.includes("toy") ||
          rawCat.includes("companion")
        ) {
          groupCat = "Plush & Companions";
        } else if (
          rawCat.includes("swaddle") ||
          rawCat.includes("quilt") ||
          rawCat.includes("blanket") ||
          rawCat.includes("textile")
        ) {
          groupCat = "Swaddles & Quilts";
        } else if (
          rawCat.includes("storage") ||
          rawCat.includes("caddy") ||
          rawCat.includes("decor") ||
          rawCat.includes("accessories")
        ) {
          groupCat = "Storage & Decor";
        }

        return {
          id: p._id || p.id,
          name: p.name,
          tagline:
            p.tagline ||
            (p.description
              ? p.description.split(".")[0] + "."
              : "Handcrafted nursery keepsake."),
          price: Number(p.price) || 1499,
          image: img,
          groupCategory: groupCat,
        };
      });
  }, [apiProducts]);

  const categories = [
    "All",
    "Plush & Companions",
    "Swaddles & Quilts",
    "Storage & Decor",
  ];

  const filteredProducts = useMemo(() => {
    return nurseryProducts.filter((p) => {
      const matchesCat =
        selectedCategory === "All" || p.groupCategory === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [nurseryProducts, selectedCategory, searchQuery]);

  // Capacity & Total Calculations
  const totalItemCount = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [selectedItems]);

  const maxCapacity = selectedBasket?.capacity || 6;
  const isFull = totalItemCount >= maxCapacity;
  const remainingSlots = Math.max(0, maxCapacity - totalItemCount);

  const itemsCost = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
  }, [selectedItems]);

  const grandTotal = itemsCost;

  // Add / Decrease / Remove items
  const handleAddItem = (product) => {
    if (isFull) {
      toast.error(
        `Your ${selectedBasket.name} can hold up to ${maxCapacity} items.`,
        {
          icon: "🧺",
        },
      );
      return;
    }

    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    toast.success(`Added ${product.name} to hamper!`, {
      icon: "✨",
      duration: 1500,
    });
  };

  const handleDecreaseItem = (productId) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.product.id === productId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((i) => i.product.id !== productId);
      }
      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  };

  const handleRemoveItem = (productId) => {
    setSelectedItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // One-click Create Hamper Order action
  // One-click Create Hamper Order action (adds real single products with hamper metadata)
  const handleCreateOrder = async (goToCheckout = false) => {
    if (selectedItems.length === 0) {
      toast.error(
        "Please select at least 1 nursery product to create your hamper!",
        {
          icon: "🧺",
        },
      );
      return;
    }

    // When "Order as Hamper" is clicked, clear old cart items so only this hamper is added and ordered
    if (goToCheckout) {
      try {
        clearCart();
      } catch (_) {
        // continue
      }
    }

    const hamperId = `hamper-${Date.now()}`;
    const hamperName = `${selectedBasket.name} Hamper`;

    // 1. Add each selected single nursery product with hamper tags sequentially
    for (const item of selectedItems) {
      addToCart(
        {
          _id: item.product.id || item.product._id,
          id: item.product.id || item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          category: "Nursery",
          isHamperItem: true,
          hamperId,
          hamperName,
          hamperBasket: selectedBasket.name,
          hamperRecipient: recipientName || "Special Someone",
          hamperSender: senderName || "",
          hamperNote: cardMessage || "",
          source: "store",
          storeName: "Starling Tales",
          storeSlug: "starlingtales",
        },
        item.quantity,
      );
    }

    toast.success("Bespoke Hamper created and added to your bag!", {
      icon: "🎁",
      duration: 3500,
    });

    if (goToCheckout) {
      navigate("/cart");
    } else {
      setCartDrawerOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C3E35] font-sans selection:bg-[#EAE2D2] selection:text-[#2C3E35] pb-28">
      {/* Header Section */}
      <header className="bg-gradient-to-b from-[#FAF6F0] via-[#FAF7F2] to-[#FAF7F2] pt-10 pb-6 px-4 sm:px-6 lg:px-8 text-center border-b border-[#E8DFC8]/50">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2D8C3] text-[11px] font-bold tracking-[0.22em] uppercase text-[#7A695B] shadow-2xs">
            <Gift size={13} className="text-[#C5A880]" />
            <span>The Gifting Atelier</span>
          </div>

          <div className="py-0.5">
            <HeartDivider centered={true} />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#2C3E35] tracking-tight">
            Create Your Nursery Hamper
          </h1>

          <p className="text-[14px] sm:text-[15px] font-light text-[#5B5B5B] max-w-xl mx-auto leading-relaxed">
            Choose your favourite nursery treasures below. We’ll beautifully
            wrap them in our signature keepsake basket with a complimentary
            handwritten card and wax seal.
          </p>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT: NURSERY PRODUCTS COLLECTION (8 COLS) ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Products Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-normal text-[#2C3E35]">
                  Select Items from Nursery Collection
                </h2>
                <span className="text-xs text-[#7A695B] font-light">
                  Click "+ Add to Hamper" on any product
                </span>
              </div>

              {loading || isProductsLoading ? (
                <ProductGridSkeleton count={6} />
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#E8DFC8]/60 p-6 space-y-2">
                  <p className="text-sm text-[#5B5B5B] font-light">
                    No nursery products found matching "{searchQuery}".
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                    }}
                    className="text-xs text-[#2C3E35] font-semibold underline cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((prod) => {
                    const inHamper = selectedItems.find(
                      (i) => i.product.id === prod.id,
                    );
                    const qty = inHamper ? inHamper.quantity : 0;

                    return (
                      <div
                        key={prod.id}
                        className={`rounded-2xl border p-3.5 flex flex-col justify-between transition-all duration-200 bg-white ${
                          qty > 0
                            ? "border-[#2C3E35] shadow-sm bg-[#FAF8F5] ring-1 ring-[#2C3E35]/20"
                            : "border-[#EAE3D2] hover:border-[#C5A880]/70"
                        }`}
                      >
                        <div>
                          {/* Image */}
                          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF7F2] mb-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-[#6B5E51] border border-[#EAE3D2]">
                              {prod.groupCategory}
                            </span>
                            {qty > 0 && (
                              <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#2C3E35] text-white text-xs font-bold flex items-center justify-center shadow-md">
                                {qty}
                              </span>
                            )}
                          </div>

                          {/* Info */}
                          <h4 className="font-display text-sm font-semibold text-[#2C3E35] line-clamp-1">
                            {prod.name}
                          </h4>
                          <p className="text-[11px] text-[#5B5B5B] font-light line-clamp-2 mt-0.5 leading-relaxed">
                            {prod.tagline}
                          </p>
                        </div>

                        {/* Bottom Action */}
                        <div className="mt-3 pt-2.5 border-t border-[#EAE3D2]/70 flex items-center justify-between">
                          <span className="font-display font-bold text-sm text-[#2C3E35]">
                            {formatPrice(prod.price)}
                          </span>

                          {qty > 0 ? (
                            <div className="flex items-center gap-2 bg-white rounded-full border border-[#2C3E35] px-2 py-0.5 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleDecreaseItem(prod.id)}
                                className="text-[#2C3E35] hover:bg-[#FAF7F2] p-0.5 rounded-full cursor-pointer transition-colors"
                                title="Decrease"
                              >
                                <Minus size={13} strokeWidth={2.5} />
                              </button>
                              <span className="text-xs font-bold text-[#2C3E35] min-w-3 text-center">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddItem(prod)}
                                disabled={isFull}
                                className="text-[#2C3E35] hover:bg-[#FAF7F2] p-0.5 rounded-full disabled:opacity-30 cursor-pointer transition-colors"
                                title="Increase"
                              >
                                <Plus size={13} strokeWidth={2.5} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddItem(prod)}
                              disabled={isFull}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2C3E35] hover:bg-[#1E2B25] disabled:opacity-40 text-white text-[11px] font-bold rounded-full transition-all duration-150 shadow-2xs cursor-pointer"
                            >
                              <Plus size={12} strokeWidth={3} />
                              <span>Add to Hamper Bag</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT: LIVE HAMPER ORDER SUMMARY (4 COLS) ================= */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-xs space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]/60">
                <div>
                  <h3 className="font-display text-base font-semibold text-[#2C3E35]">
                    Your Hamper Order
                  </h3>
                  <p className="text-[11px] text-[#6B5E51] font-light">
                    {totalItemCount === 0
                      ? "Select items to begin"
                      : `${totalItemCount} items selected`}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-[10px] font-bold text-[#7A695B] border border-[#E2D8C3] uppercase tracking-wider">
                  {isFull ? "Full" : `${remainingSlots} slots left`}
                </span>
              </div>

              {/* Basket Card Preview */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D2] space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedBasket?.image}
                    alt={selectedBasket?.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[#E2D8C3] shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="font-display font-semibold text-xs text-[#2C3E35] truncate">
                      {selectedBasket?.name}
                    </h4>
                    <p className="text-[11px] font-bold text-[#2C3E35]">
                      {formatPrice(selectedBasket?.price)}
                    </p>
                    <span className="text-[10px] text-[#7A695B] block truncate">
                      Holds up to {selectedBasket?.capacity} items
                    </span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-[#EAE2D2] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFull ? "bg-amber-600" : "bg-[#2C3E35]"
                      }`}
                      style={{
                        width: `${Math.min(100, (totalItemCount / maxCapacity) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Hamper Items List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#5B5B5B]">
                  <span>Hamper Items ({totalItemCount})</span>
                  {selectedItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedItems([])}
                      className="text-[10px] text-[#9E9589] hover:text-rose-600 cursor-pointer font-normal"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {selectedItems.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-[#E2D8C3] rounded-2xl bg-[#FAF7F2]/40">
                    <p className="text-xs text-[#7A695B] font-light">
                      Your hamper is currently empty.
                    </p>
                    <p className="text-[11px] text-[#2C3E35] font-medium mt-1">
                      Pick any nursery item on the left!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {selectedItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#FAF7F2] border border-[#EAE3D2]/70"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="font-bold text-[#2C3E35] shrink-0">
                            {item.quantity}×
                          </span>
                          <span className="truncate text-[#2C3E35] font-medium">
                            {item.product.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-semibold text-[#2C3E35]">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="text-[#9E9589] hover:text-rose-600 p-0.5 cursor-pointer transition-colors"
                            title="Remove"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-[#E8DFC8]/60 space-y-2 text-xs">
                {/* <div className="flex justify-between text-[#5B5B5B]">
                  <span>Packaging Basket</span>
                  <span className="font-medium text-[#2C3E35]">
                    {formatPrice(selectedBasket?.price || 0)}
                  </span>
                </div> */}
                <div className="flex justify-between text-[#5B5B5B]">
                  <span>Nursery Treasures ({totalItemCount})</span>
                  <span className="font-medium text-[#2C3E35]">
                    {formatPrice(itemsCost)}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#EAE3D2] flex justify-between items-baseline">
                  <span className="font-display font-bold text-sm text-[#2C3E35]">
                    Total Hamper Price
                  </span>
                  <span className="font-display font-bold text-lg text-[#2C3E35]">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Direct Order Actions */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleCreateOrder(true)}
                  disabled={selectedItems.length === 0}
                  className="w-full py-3.5 bg-[#2C3E35] hover:bg-[#1E2B25] disabled:opacity-50 text-white text-xs font-bold tracking-[0.16em] uppercase rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <ShoppingBag size={15} />
                  <span>Order as Hamper • {formatPrice(grandTotal)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateOrder(false)}
                  disabled={selectedItems.length === 0}
                  className="w-full py-2.5 bg-[#FAF6F0] hover:bg-[#EAE2D2] disabled:opacity-50 text-[#2C3E35] text-xs font-semibold rounded-full border border-[#E2D8C3] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Add to Bag & Keep Shopping</span>
                </button>
              </div>

              <div className="pt-1 text-[11px] text-[#7A695B] space-y-1 text-center font-light">
                <div className="flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-700" />
                  <span>Hand-wrapped in luxury box with wax seal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8DFC8] p-3 px-4 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] text-[#7A695B] block uppercase tracking-wider font-semibold">
            {totalItemCount} Items Selected
          </span>
          <span className="font-display font-bold text-base text-[#2C3E35]">
            {formatPrice(grandTotal)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => handleCreateOrder(true)}
          disabled={selectedItems.length === 0}
          className="px-6 py-3 bg-[#2C3E35] hover:bg-[#1E2B25] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md cursor-pointer flex items-center gap-2"
        >
          <ShoppingBag size={13} />
          <span>Order Hamper</span>
        </button>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </div>
  );
}
