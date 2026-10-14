import React, { useMemo, useState } from "react";
import "../styles/StarlingTales.css";
import { useStore } from "../context/StoreContext";
import toast from "react-hot-toast";
import { formatPrice } from "../constants/constants";
import { ProductGridSkeleton } from "../components/StarlingSkeletons";
import Icon from "../components/Icon";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CartDrawer from "../components/CartDrawer";
import { useNavigate, Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

export default function StarlingCollection() {
  const {
    business,
    products,
    categories: storeCategories,
    loading = false,
    isProductsLoading = false,
    storeHomePath: contextHomePath,
    cartItems = [],
    wishlistItems = [],
    addToCart,
    updateCartQuantity,
    removeFromCart,
    toggleWishlist,
    setIsCartOpen,
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

  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("All");
  const [quickViewId, setQuickViewId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Fallback to constants.PRODUCTS if store products are empty
  const rawProducts = useMemo(() => {
    if (Array.isArray(products) && products.length > 0) {
      return products;
    }
    return [];
  }, [products]);

  // Map store categories by ID and name (never exposing raw 24-char hex IDs)
  const categoryIdToNameMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(storeCategories)) {
      storeCategories.forEach((c) => {
        if (!c) return;
        const id = typeof c === "object" ? String(c._id || c.id || "") : "";
        const name =
          typeof c === "object" ? c.name || c.title || "" : String(c);
        if (name && !/^[0-9a-fA-F]{24}$/.test(name.trim())) {
          if (id) map.set(id, name.trim());
          map.set(name.trim().toLowerCase(), name.trim());
        }
      });
    }
    return map;
  }, [storeCategories]);

  const mappedProducts = useMemo(() => {
    if (!rawProducts || rawProducts.length === 0) return [];

    return rawProducts.map((p, index) => {
      const mainImage =
        p.image ||
        p.images?.[0]?.url ||
        (typeof p.images?.[0] === "string" ? p.images[0] : "") ||
        "https://via.placeholder.com/400x300?text=No+Image";

      const galleryImages =
        Array.isArray(p.gallery) && p.gallery.length > 0
          ? p.gallery
          : Array.isArray(p.images) && p.images.length > 0
            ? p.images.map((img) => (typeof img === "object" ? img.url : img))
            : [mainImage];

      const productVariants =
        p.variants?.length > 0
          ? p.variants.map((v, i) => ({
              label: v.label || v.name || `Option ${i + 1}`,
              sku: v.sku || `${p._id || p.id}-${i}`,
            }))
          : [{ label: "Standard", sku: p._id || p.id }];

      // Resolve human-readable category name: never display a raw 24-character hex ID
      let catName = "General";
      const rawCat = p.category;

      const rawCatId =
        typeof rawCat === "object" && rawCat !== null
          ? String(rawCat._id || rawCat.id || "")
          : typeof rawCat === "string" &&
              /^[0-9a-fA-F]{24}$/.test(rawCat.trim())
            ? rawCat.trim()
            : "";

      const rawCatName =
        typeof rawCat === "object" && rawCat !== null
          ? rawCat.name || rawCat.title || ""
          : typeof rawCat === "string" &&
              !/^[0-9a-fA-F]{24}$/.test(rawCat.trim())
            ? rawCat.trim()
            : "";

      if (rawCatName && !/^[0-9a-fA-F]{24}$/.test(rawCatName)) {
        catName = rawCatName;
      } else if (rawCatId && categoryIdToNameMap.has(rawCatId)) {
        catName = categoryIdToNameMap.get(rawCatId);
      } else if (
        p.categoryName &&
        !/^[0-9a-fA-F]{24}$/.test(p.categoryName.trim())
      ) {
        catName = p.categoryName.trim();
      }

      return {
        id: p._id || p.id,
        name: p.name,
        tagline:
          p.tagline ||
          (p.description ? p.description.split(".")[0] + "." : p.name),
        price: p.price,
        originalPrice: p.compareAtPrice || p.originalPrice || null,
        image: mainImage,
        gallery: galleryImages,
        category: catName,
        badge:
          p.badge ||
          (p.compareAtPrice > p.price
            ? "Sale"
            : index % 4 === 0
              ? "Bestseller"
              : index % 4 === 1
                ? "New"
                : null),
        rating: p.rating || 4.8,
        reviews: p.numReviews || p.reviews || 12,
        inStock: p.stock === undefined || p.stock > 0,
        description: p.description || "",
        details: p.details || [
          `Stock: ${p.stock !== undefined ? p.stock : "Available"}`,
          "Safety tested & CE certified",
          "Material: 100% Cotton Outer",
        ],
        tags: p.tags || [],
        variants: productVariants,
        rawProduct: p,
      };
    });
  }, [rawProducts, categoryIdToNameMap]);

  // Extract all categories dynamically: only human-readable names, never ObjectIds
  const categoryNames = useMemo(() => {
    const set = new Set(["All"]);

    // 1. Add valid names from storeCategories
    if (Array.isArray(storeCategories) && storeCategories.length > 0) {
      storeCategories.forEach((c) => {
        const name =
          typeof c === "object" && c !== null ? c.name || c.title : c;
        if (
          name &&
          typeof name === "string" &&
          name.trim() &&
          !/^[0-9a-fA-F]{24}$/.test(name.trim())
        ) {
          set.add(name.trim());
        }
      });
    }

    // 2. Add valid names from mappedProducts
    mappedProducts.forEach((p) => {
      if (
        p.category &&
        p.category !== "General" &&
        !/^[0-9a-fA-F]{24}$/.test(p.category.trim())
      ) {
        set.add(p.category.trim());
      }
    });

    return Array.from(set);
  }, [storeCategories, mappedProducts]);

  // Filter products by active category name
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return mappedProducts;
    const target = activeCategory.trim().toLowerCase();

    return mappedProducts.filter((p) => {
      // 1. Direct resolved category name match
      if (p.category && p.category.toLowerCase() === target) {
        return true;
      }
      // 2. Check raw category object name
      const rawCat = p.rawProduct?.category;
      if (typeof rawCat === "object" && rawCat?.name) {
        if (rawCat.name.toLowerCase() === target) return true;
      }
      // 3. Match by ID via categoryIdToNameMap
      const rawCatId =
        typeof rawCat === "object" && rawCat !== null
          ? String(rawCat._id || rawCat.id || "")
          : typeof rawCat === "string"
            ? rawCat.trim()
            : "";

      if (
        rawCatId &&
        categoryIdToNameMap.get(rawCatId)?.toLowerCase() === target
      ) {
        return true;
      }

      // 4. Check rawProduct.categories array if present
      if (Array.isArray(p.rawProduct?.categories)) {
        const matchInArray = p.rawProduct.categories.some((catItem) => {
          if (typeof catItem === "object" && catItem?.name) {
            return catItem.name.toLowerCase() === target;
          }
          const catItemId =
            typeof catItem === "object"
              ? String(catItem._id || catItem.id || "")
              : String(catItem || "");
          return categoryIdToNameMap.get(catItemId)?.toLowerCase() === target;
        });
        if (matchInArray) return true;
      }

      return false;
    });
  }, [activeCategory, mappedProducts, categoryIdToNameMap]);

  const quickViewProduct = useMemo(() => {
    if (!quickViewId) return null;
    return mappedProducts.find((p) => p.id === quickViewId) || null;
  }, [quickViewId, mappedProducts]);

  // Map Redux cart items to what CartDrawer expects
  const mappedCart = useMemo(() => {
    return cartItems.map((item) => ({
      ...item,
      productId: item._id || item.id,
      sku: item.sku || item._id || item.id,
      variantLabel: item.variantLabel || item.selectedOptions || "Standard",
      quantity: item.quantity,
    }));
  }, [cartItems]);

  // Cart Handlers
  const handleAddToCart = (productId, sku, qty = 1) => {
    const origProduct =
      rawProducts.find((p) => (p._id || p.id) === productId) ||
      mappedProducts.find((p) => p.id === productId)?.rawProduct;

    if (!origProduct) return;

    const availableStock =
      origProduct.inventory?.stockQuantity !== undefined
        ? Number(origProduct.inventory.stockQuantity)
        : origProduct.stockQuantity !== undefined
          ? Number(origProduct.stockQuantity)
          : origProduct.stock !== undefined
            ? Number(origProduct.stock)
            : origProduct.countInStock !== undefined
              ? Number(origProduct.countInStock)
              : 99;

    if (availableStock <= 0) {
      toast.error(`Sorry, ${origProduct.name} is currently out of stock!`);
      return;
    }

    const itemInCart = cartItems.find(
      (item) => (item._id || item.id) === (origProduct._id || origProduct.id),
    );
    const currentCartQty = itemInCart ? itemInCart.quantity : 0;

    if (currentCartQty + qty > availableStock) {
      toast.error(
        `Cannot add more. Only ${availableStock} units available in inventory (${currentCartQty} already in cart).`,
      );
      return;
    }

    addToCart(
      {
        ...origProduct,
        source: "store",
        storeName: "Starling Tales",
        storeSlug: "starlingtales",
      },
      qty,
    );
    const remaining = availableStock - (currentCartQty + qty);
    toast.success(
      `${origProduct.name} added to cart! ${
        remaining > 0
          ? `(${remaining} units left in stock)`
          : "(Reached max available stock)"
      }`,
    );
    setCartOpen(true);
  };

  const handleUpdateQty = (productId, sku, newQty) => {
    const targetId = productId || sku;
    if (newQty < 1) {
      handleRemoveFromCart(targetId, sku);
      return;
    }
    const origProduct =
      rawProducts.find((p) => String(p._id || p.id) === String(targetId)) ||
      mappedProducts.find((p) => String(p.id) === String(targetId))?.rawProduct;

    const availableStock = origProduct
      ? origProduct.inventory?.stockQuantity !== undefined
        ? Number(origProduct.inventory.stockQuantity)
        : origProduct.stockQuantity !== undefined
          ? Number(origProduct.stockQuantity)
          : origProduct.stock !== undefined
            ? Number(origProduct.stock)
            : origProduct.countInStock !== undefined
              ? Number(origProduct.countInStock)
              : 99
      : 99;

    if (newQty > availableStock) {
      toast.error(
        `Cannot increase. Only ${availableStock} units available in inventory.`,
      );
      return;
    }
    updateCartQuantity(targetId, newQty);
  };

  const handleRemoveFromCart = (productId, sku) => {
    const targetId = productId || sku;
    removeFromCart(targetId);
    toast.success("Item removed from cart.");
  };

  const handleWishlistToggle = (productId) => {
    const origProduct =
      rawProducts.find((p) => (p._id || p.id) === productId) ||
      mappedProducts.find((p) => p.id === productId)?.rawProduct;

    if (origProduct) {
      toggleWishlist(origProduct);
    }
  };

  const handleCheckout = () => {
    navigate("/cart");
    setCartOpen(false);
  };

  return (
    <div className="bg-cream text-text-dark font-sans selection:bg-blue-light selection:text-blue-soft relative overflow-x-hidden w-full">
      {/* Main Section */}
      <main
        id="collection"
        className="py-16 px-6 max-w-7xl mx-auto space-y-10 scroll-mt-20"
      >
        {/* Section Header */}
        <div className="text-center space-y-3.5">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-blue-soft block">
            Curated Keepsakes
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-text-dark">
            The Memory Collection
          </h2>
          <div
            className="flex w-full max-w-[190px] items-center gap-3 text-blue-soft mx-auto"
            aria-hidden="true"
          >
            <span className="h-0.5 flex-1 border-t border-dashed border-blue-muted" />
            <Icon name="heart" className="h-5 w-5" />
            <span className="h-0.5 flex-1 border-t border-dashed border-blue-muted" />
          </div>
          <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed font-light">
            Handcrafted pieces and heirloom memory treasures for little ones
          </p>

          {/* Category Filter Tabs */}
          {/* {categoryNames.length > 1 && (
            <div
              className="flex flex-wrap items-center justify-center gap-2 pt-4"
              role="tablist"
              aria-label="Memory collection categories"
            >
              {categoryNames.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`min-h-[38px] px-5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-text-dark text-cream shadow-sm scale-105"
                      : "bg-white border border-cream-dark text-text-body hover:border-blue-soft hover:text-blue-soft hover:bg-cream/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )} */}
        </div>

        {/* Products Grid */}
        {loading || isProductsLoading ? (
          <ProductGridSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-white/40 rounded-2xl border border-cream-dark/50">
            <p className="text-text-muted text-sm font-light">
              No keepsakes currently found in "{activeCategory}".
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory("All")}
              className="text-xs text-blue-soft underline font-medium hover:text-text-dark cursor-pointer"
            >
              View all keepsakes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistItems.some(
                  (item) => (item._id || item.id) === product.id,
                )}
                onWishlist={handleWishlistToggle}
                onQuickView={setQuickViewId}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* Bottom Explore More Action */}
        <div className="flex justify-end pt-2">
          <Link
            to={`/products`}
            className="text-text-dark font-semibold text-sm hover:text-blue-soft inline-flex items-center gap-1.5 transition-colors"
          >
            Explore all nursery keepsakes{" "}
            <MoveRight className="inline-block h-4 w-4 ml-1" />
          </Link>
        </div>
      </main>

      {/* Cart Drawer */}
      {cartOpen && (
        <CartDrawer
          cart={mappedCart}
          products={mappedProducts}
          onClose={() => setCartOpen(false)}
          onQty={handleUpdateQty}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />
      )}

      {/* Product Quick View Modal */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          isWishlisted={wishlistItems.some(
            (item) => (item._id || item.id) === quickViewProduct.id,
          )}
          onClose={() => setQuickViewId(null)}
          onWishlist={handleWishlistToggle}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
