import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../constants/constants";
import HeartDivider from "../components/HeartDivider";
import { ProductGridSkeleton } from "../components/StarlingSkeletons";

export default function WishlistPage() {
  const navigate = useNavigate();
  const {
    wishlistItems = [],
    wishlistCount = 0,
    isLoadingWishlist = false,
    removeFromWishlist,
    refreshWishlist,
    addToCart,
    setIsCartOpen,
  } = useStore();

  useEffect(() => {
    if (typeof refreshWishlist === "function") {
      refreshWishlist();
    }
  }, [refreshWishlist]);

  const handleMoveToCart = (item) => {
    addToCart({
      _id: item._id || item.id,
      id: item._id || item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      quantity: 1,
    });
    removeFromWishlist(item._id || item.id);
    toast.success(`Moved ${item.name} to your bag!`, {
      style: { background: "#37463f", color: "#fffefc" },
    });
  };

  const handleAddAllToCart = () => {
    if (!wishlistItems || wishlistItems.length === 0) return;
    wishlistItems.forEach((item) => {
      addToCart({
        _id: item._id || item.id,
        id: item._id || item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        quantity: 1,
      });
    });
    toast.success(`Added all ${wishlistItems.length} keepsakes to your bag!`, {
      style: { background: "#37463f", color: "#fffefc" },
    });
    if (setIsCartOpen) setIsCartOpen(true);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#2C3E35]/60 mb-6">
          <Link to="/" className="hover:text-[#2C3E35] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#2C3E35] font-medium">Wishlist</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8DFC8]">
          <div>
            <span className="text-xs font-semibold tracking-widest text-[#C5A880] uppercase flex items-center gap-1.5 mb-2">
              <Sparkles size={14} />
              Your Treasured Keepsakes
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2C3E35] tracking-tight">
              Curated Wishlist
            </h1>
            <p className="text-xs text-[#2C3E35]/70 mt-1 max-w-xl">
              Cherished heirloom companions saved for nursery blessings and memorable milestones.
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#2C3E35]/70 bg-white border border-[#E8DFC8] px-3.5 py-1.5 rounded-full font-serif">
                {wishlistItems.length} {wishlistItems.length === 1 ? "Keepsake" : "Keepsakes"} Saved
              </span>
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#2C3E35] text-[#FAF7F2] text-xs font-serif font-medium hover:bg-[#37463f] hover:shadow-md transition-all cursor-pointer"
              >
                <ShoppingBag size={14} />
                <span>Move All to Bag</span>
              </button>
            </div>
          )}
        </div>

        <HeartDivider className="my-6 opacity-40" />

        {/* Wishlist Content */}
        {isLoadingWishlist && wishlistItems.length === 0 ? (
          <ProductGridSkeleton count={4} />
        ) : wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 px-4 bg-white/70 rounded-3xl border border-[#E8DFC8]/70 max-w-lg mx-auto shadow-sm my-8">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FAF7F2] border border-[#E8DFC8] flex items-center justify-center text-[#C5A880]">
              <Heart size={28} className="stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#2C3E35] mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-[#2C3E35]/70 mb-8 max-w-sm mx-auto leading-relaxed">
              Explore our handmade plush creations and tender gift collections to save keepsakes you adore.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2C3E35] text-[#FAF7F2] text-xs font-serif font-medium hover:bg-[#37463f] transition-all shadow-sm"
              >
                <span>Discover Keepsakes</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/gift-hampers"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-[#E8DFC8] text-[#2C3E35] text-xs font-serif font-medium hover:bg-[#FAF7F2] transition-all"
              >
                <span>Browse Hampers</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 my-6">
            {wishlistItems.map((item) => {
              const id = item._id || item.id;
              const hasDiscount =
                item.originalPrice && item.originalPrice > item.price;
              const discountPercent = hasDiscount
                ? Math.round(
                    ((item.originalPrice - item.price) / item.originalPrice) * 100
                  )
                : 0;

              return (
                <div
                  key={id}
                  className="group relative bg-white rounded-2xl border border-[#E8DFC8]/60 shadow-[0_2px_12px_rgba(44,62,53,0.06)] hover:shadow-[0_12px_32px_rgba(44,62,53,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Image Box */}
                  <div className="relative aspect-[4/5] bg-[#FAF7F2] p-4 flex items-center justify-center overflow-hidden">
                    <Link
                      to={`/product/${id}`}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/600x600?text=Starling+Tales";
                        }}
                      />
                    </Link>

                    {/* Discount Badge */}
                    {hasDiscount && discountPercent > 0 && (
                      <span className="absolute top-3 left-3 bg-[#C5A880] text-[#FAF7F2] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {discountPercent}% OFF
                      </span>
                    )}

                    {/* Remove from Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#2C3E35] hover:text-red-600 hover:bg-white shadow-sm flex items-center justify-center transition-all cursor-pointer"
                      title="Remove from Wishlist"
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      {item.category && (
                        <span className="text-[10px] font-serif uppercase tracking-widest text-[#C5A880] block mb-1">
                          {item.category}
                        </span>
                      )}
                      <Link
                        to={`/product/${id}`}
                        className="font-serif text-sm font-semibold text-[#2C3E35] hover:text-[#C5A880] transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="font-serif font-bold text-sm text-[#2C3E35]">
                          {formatPrice(item.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-neutral-400 line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-[#E8DFC8]/40 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-[#2C3E35] text-[#FAF7F2] text-xs font-serif font-medium hover:bg-[#37463f] transition-colors cursor-pointer shadow-xs"
                      >
                        <ShoppingBag size={13} />
                        <span>Move to Bag</span>
                      </button>

                      <Link
                        to={`/product/${id}`}
                        className="px-3 py-2 rounded-full border border-[#E8DFC8] text-[#2C3E35] hover:bg-[#FAF7F2] text-xs font-serif font-medium transition-colors"
                        title="View Details"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Explore Banner */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 p-6 md:p-8 rounded-3xl bg-white border border-[#E8DFC8]/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2C3E35]">
                Looking for Bespoke Hampers?
              </h3>
              <p className="text-xs text-[#2C3E35]/70 mt-1">
                Bundle your favorite companions into handcrafted wooden keepsake hampers.
              </p>
            </div>
            <Link
              to="/create-hamper"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FAF7F2] border border-[#C5A880] text-[#2C3E35] hover:bg-[#C5A880] hover:text-white text-xs font-serif font-medium transition-all"
            >
              <span>Build Custom Hamper</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
