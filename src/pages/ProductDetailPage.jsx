import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, CheckCircle2, ShieldCheck, Sparkles, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../constants/constants";
import * as productApi from "../services/productApi";
import HeartDivider from "../components/HeartDivider";
import CartDrawer from "../components/CartDrawer";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products = [], addToCart, toggleWishlist, isInWishlist } = useStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    // 1. Try finding in store products
    const found = products.find((p) => String(p._id || p.id) === String(id));
    if (found) {
      setProduct(found);
      const img = found.image || found.images?.[0]?.url || (typeof found.images?.[0] === "string" ? found.images[0] : "");
      setSelectedImage(img);
      if (found.variants && found.variants.length > 0) {
        setSelectedVariant(found.variants[0]);
      }
      setLoading(false);
      return;
    }

    // 2. Fetch from backend API
    productApi
      .getStoreProductById(id)
      .then((data) => {
        if (data) {
          setProduct(data);
          const img = data.image || data.images?.[0]?.url || (typeof data.images?.[0] === "string" ? data.images[0] : "");
          setSelectedImage(img);
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }
        }
      })
      .catch((e) => {
        console.warn("Could not fetch product details:", e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-soft border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="font-display text-2xl text-text-dark">Keepsake Not Found</h2>
        <p className="text-xs text-text-muted">This companion could not be located in our nursery records.</p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-text-dark text-cream rounded-full text-xs font-semibold uppercase tracking-wider"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  const name = product.name || product.title || "Keepsake Treasure";
  const price = Number(product.price) || 0;
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const isSaved = isInWishlist(product._id || product.id);

  const images = Array.isArray(product.gallery) && product.gallery.length > 0
    ? product.gallery
    : Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((im) => (typeof im === "object" ? im.url : im))
      : [selectedImage || "https://via.placeholder.com/600x600?text=Starling+Tales"];

  const handleAdd = () => {
    addToCart(product, quantity, selectedVariant);
  };

  return (
    <div className="min-h-screen bg-cream text-text-dark font-sans py-10 px-4 sm:px-6 lg:px-8 selection:bg-blue-light selection:text-blue-soft">
      <div className="max-w-6xl mx-auto space-y-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-dark transition uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back to All Keepsakes
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-cream-dark shadow-xs">
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-[#FAF7F2] p-4 flex items-center justify-center border border-cream-dark/60 overflow-hidden">
              <img
                src={selectedImage || images[0]}
                alt={name}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl border p-1 bg-[#FAF7F2] shrink-0 transition cursor-pointer ${
                      selectedImage === img
                        ? "border-blue-soft shadow-xs"
                        : "border-cream-dark hover:border-cream-dark/80"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1.5">
                {product.category && (
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-soft">
                    {typeof product.category === "object" ? product.category.name : product.category}
                  </span>
                )}
                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text-dark leading-tight">
                  {name}
                </h1>
                {product.tagline && (
                  <p className="text-xs text-text-muted italic font-serif leading-relaxed">
                    "{product.tagline}"
                  </p>
                )}
              </div>

              {/* Price & Badge */}
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl font-bold text-text-dark">
                  {formatPrice(price)}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-sm text-text-muted line-through font-mono">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                {product.badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-text-body leading-relaxed font-light">
                {product.description ||
                  "Lovingly handcrafted with gentle fabrics and mindful attention to every little stitch. A tender keepsake companion designed for nursery comfort and everlasting memories."}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-cream-dark/60">
                  <label className="block text-xs font-semibold text-text-dark">
                    Select Option / Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          selectedVariant?.label === v.label
                            ? "bg-text-dark text-cream border-text-dark shadow-2xs"
                            : "bg-cream border-cream-dark text-text-dark hover:border-cream-dark/90"
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Details List */}
              {Array.isArray(product.details) && product.details.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Heirloom Craft Specifications:
                  </span>
                  <ul className="space-y-1 text-xs text-text-body">
                    {product.details.map((d, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-blue-soft shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-cream-dark space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-cream-dark rounded-full bg-cream">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-text-dark hover:bg-cream-dark/40 rounded-full"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-sm text-text-dark">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center font-bold text-text-dark hover:bg-cream-dark/40 rounded-full"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 py-3.5 px-6 rounded-full bg-text-dark text-cream hover:bg-text-dark/90 text-xs uppercase tracking-widest font-semibold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={15} />
                  <span>Add to Keepsake Bag • {formatPrice(price * quantity)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition cursor-pointer ${
                    isSaved
                      ? "border-rose-400 bg-rose-50 text-rose-500"
                      : "border-cream-dark bg-cream text-text-muted hover:text-text-dark"
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart size={18} className={isSaved ? "fill-rose-500" : ""} />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-muted pt-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-700" /> CE Certified Child-Safe
                </span>
                <span>All India Express Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
