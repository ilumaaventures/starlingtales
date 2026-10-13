import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Trash2, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../constants/constants";
import HeartDivider from "../components/HeartDivider";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems = [],
    cartSubtotal = 0,
    freeShippingRemaining = 0,
    isFreeShipping = false,
    freeShippingThreshold = 5000,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  const [giftNote, setGiftNote] = useState("");
  const shipping = isFreeShipping || cartSubtotal === 0 ? 0 : 99;
  const grandTotal = cartSubtotal + shipping;

  return (
    <div className="min-h-screen bg-cream text-text-dark font-sans py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-light selection:text-blue-soft">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-dark transition uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Back to Collection
          </Link>
          <span className="text-xs text-text-muted tracking-widest uppercase">
            Heirloom Keepsake Bag
          </span>
        </div>

        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-blue-soft block">
            Your Selected Treasures
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-text-dark">
            Review Your Keepsake Bag
          </h1>
          <HeartDivider />
        </div>

        {/* Free Shipping Alert Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-cream-dark shadow-2xs max-w-2xl mx-auto space-y-2">
          <div className="flex items-center justify-between text-xs">
            {isFreeShipping ? (
              <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                Congratulations! You have unlocked Complimentary Courier Shipping!
              </span>
            ) : (
              <span className="text-text-dark font-medium">
                Add{" "}
                <strong className="text-gold font-bold">
                  {formatPrice(freeShippingRemaining)}
                </strong>{" "}
                more to unlock Free Shipping across India.
              </span>
            )}
            <span className="font-mono text-[11px] text-text-muted">
              Threshold: {formatPrice(freeShippingThreshold)}
            </span>
          </div>
          <div className="h-2 w-full bg-cream-dark/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-soft transition-all duration-300 rounded-full"
              style={{
                width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%`,
              }}
            />
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Bag State */
          <div className="text-center py-20 bg-white rounded-3xl border border-cream-dark space-y-5 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-cream mx-auto flex items-center justify-center text-blue-soft">
              <ShoppingBag size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-semibold text-text-dark">
                Your Keepsake Bag is Empty
              </h2>
              <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed font-light">
                No tender companions or heirloom keepsakes have been added yet. Meet our residents or craft a bespoke gift hamper.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/products"
                className="px-6 py-3 rounded-full bg-text-dark text-cream hover:bg-text-dark/90 text-xs tracking-widest uppercase font-semibold transition shadow-sm"
              >
                Explore Collection
              </Link>
              <Link
                to="/create-hamper"
                className="px-6 py-3 rounded-full bg-[#FAF6F0] border border-[#E2D8C3] text-text-dark hover:bg-cream-dark/50 text-xs tracking-widest uppercase font-semibold transition"
              >
                Build Custom Hamper
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-cream-dark text-xs text-text-muted">
                <span>Items ({cartItems.length})</span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="hover:text-rose-600 transition cursor-pointer"
                >
                  Clear Bag
                </button>
              </div>

              {cartItems.map((item) => {
                const itemId = item._id || item.id;
                const price = Number(item.price) || 0;
                return (
                  <div
                    key={`${itemId}-${item.selectedVariantKey || "standard"}`}
                    className="p-4 sm:p-5 bg-white rounded-2xl border border-cream-dark shadow-2xs flex gap-4 sm:gap-6 items-start"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl bg-[#FAF7F2] p-1.5 shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display font-semibold text-text-dark text-sm sm:text-base leading-snug truncate">
                            {item.name}
                          </h3>
                          {item.selectedVariant?.label && (
                            <span className="text-[11px] text-text-muted font-light">
                              Option: {item.selectedVariant.label}
                            </span>
                          )}
                          {item.isHamperItem && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold">
                              🎁 Part of {item.hamperName || "Gift Hamper"}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(itemId)}
                          className="text-text-muted hover:text-rose-600 p-1 transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {item.customGiftMessage && (
                        <p className="text-[11px] text-text-muted italic bg-cream/70 p-2 rounded-lg border border-cream-dark/40">
                          Card note: "{item.customGiftMessage}"
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-cream-dark rounded-full bg-cream">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(itemId, (item.quantity || 1) - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-text-dark hover:bg-cream-dark/50 rounded-full text-xs font-bold transition cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-text-dark font-mono">
                            {item.quantity || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(itemId, (item.quantity || 1) + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-text-dark hover:bg-cream-dark/50 rounded-full text-xs font-bold transition cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-display font-bold text-sm sm:text-base text-text-dark">
                          {formatPrice(price * (item.quantity || 1))}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Column */}
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-3xl border border-cream-dark shadow-2xs space-y-4">
                <h3 className="font-display font-semibold text-text-dark text-lg border-b border-cream-dark pb-3">
                  Summary & Dispatch
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-text-muted">
                    <span>Keepsake Subtotal</span>
                    <span className="font-bold text-text-dark font-mono">
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Courier Delivery (India)</span>
                    <span className="font-bold text-text-dark">
                      {shipping === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
                          Free
                        </span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Gift Packaging & Wax Seal</span>
                    <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
                      Complimentary
                    </span>
                  </div>

                  <div className="pt-3 border-t border-cream-dark flex justify-between font-display text-base font-bold text-text-dark">
                    <span>Estimated Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Gift Message */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-text-dark mb-1.5">
                    Include a Handwritten Letter:
                  </label>
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Write a message to be penned on botanical parchment..."
                    className="w-full text-xs p-3 rounded-xl border border-cream-dark bg-cream outline-none focus:border-blue-soft transition placeholder:text-text-muted/60"
                  />
                </div>

                <Link
                  to="/checkout"
                  className="w-full py-4 bg-text-dark text-cream hover:bg-text-dark/90 font-sans text-xs tracking-widest uppercase font-bold rounded-xl transition shadow-sm text-center block cursor-pointer"
                >
                  Proceed to Checkout • {formatPrice(grandTotal)}
                </Link>

                <p className="text-[10px] text-center text-text-muted leading-relaxed">
                  🔒 Safe & secure checkout. Each companion is carefully wrapped with organic ribbon and tissue.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
