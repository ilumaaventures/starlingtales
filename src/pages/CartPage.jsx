import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Sparkles,
  CheckCircle2,
  Truck,
  Tag,
  X,
  MapPin,
  Clock,
  ShieldCheck,
  Gift,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../constants/constants";
import HeartDivider from "../components/HeartDivider";
import { STARLING_PRESET_COUPONS } from "../services/couponApi";

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
    // Coupon actions
    appliedCoupon,
    discountAmount = 0,
    applyCoupon,
    removeCoupon,
    // Pincode actions
    deliveryPincode = "",
    pincodeInfo,
    isCheckingPincode,
    verifyDeliveryPincode,
    clearPincode,
  } = useStore();

  const [giftNote, setGiftNote] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [pinInput, setPinInput] = useState(deliveryPincode || "");
  const [pinError, setPinError] = useState("");

  // Base shipping calculation
  const isShippingWaived = appliedCoupon?.code === "HEIRLOOM";
  const shipping =
    isFreeShipping || cartSubtotal === 0 || isShippingWaived ? 0 : 99;
  const grandTotal = Math.max(
    0,
    cartSubtotal - (discountAmount || 0) + shipping,
  );

  // Handle coupon apply
  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponInput || "").trim();
    if (!code) {
      toast.error("Please enter a coupon code.");
      return;
    }
    setCouponLoading(true);
    try {
      await applyCoupon(code);
      setCouponInput("");
    } catch (_) {
      // error handled in CartContext toast
    } finally {
      setCouponLoading(false);
    }
  };

  // Handle pincode validation
  const handleVerifyPincode = async (e) => {
    if (e) e.preventDefault();
    setPinError("");
    const clean = pinInput.trim();

    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      setPinError("Please enter a valid 6-digit Indian PIN code.");
      return;
    }

    try {
      await verifyDeliveryPincode(clean);
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-cream text-text-dark font-sans py-8 sm:py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-light selection:text-blue-soft">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-dark transition uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Back to Collection
          </Link>
          <span className="text-xs text-text-muted tracking-widest uppercase font-serif">
            Heirloom Keepsake Bag
          </span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-blue-soft block">
            Your Selected Treasures
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-text-dark">
            Review Your Keepsake Bag
          </h1>
          <HeartDivider />
        </div>

        {/* Free Shipping Progress Alert Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-cream-dark shadow-2xs max-w-2xl mx-auto space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            {isFreeShipping ? (
              <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                Congratulations! You have unlocked Complimentary Courier
                Shipping!
              </span>
            ) : (
              <span className="text-text-dark font-medium">
                Add{" "}
                <strong className="text-gold font-bold">
                  {formatPrice(freeShippingRemaining)}
                </strong>{" "}
                more to unlock Free Express Courier across India.
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
                width: `${Math.min(
                  100,
                  (cartSubtotal / freeShippingThreshold) * 100,
                )}%`,
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
                No tender companions or heirloom keepsakes have been added yet.
                Meet our residents or craft a bespoke gift hamper.
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
            {/* Left Column: Items + Delivery & Pincode Checker */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items Card */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-cream-dark text-xs text-text-muted">
                  <span>Keepsakes Selected ({cartItems.length})</span>
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
                              <span className="text-[11px] text-text-muted font-light block">
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
                                updateCartQuantity(
                                  itemId,
                                  (item.quantity || 1) - 1,
                                )
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
                                updateCartQuantity(
                                  itemId,
                                  (item.quantity || 1) + 1,
                                )
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

              {/* Pincode & Delivery Serviceability Validator */}
              <div className="p-5 sm:p-6 bg-white rounded-3xl border border-cream-dark shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#37463f]/10 text-[#37463f] flex items-center justify-center">
                    <Truck size={16} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-text-dark text-sm sm:text-base">
                      Delivery & Courier Serviceability
                    </h3>
                    <p className="text-[11px] text-text-muted">
                      Verify courier serviceability, delivery dates, and Cash on
                      Delivery eligibility across India.
                    </p>
                  </div>
                </div>

                {/* Input form */}
                <form
                  onSubmit={handleVerifyPincode}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                >
                  <div className="relative flex-1">
                    <MapPin
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit delivery PIN (e.g. 110001)"
                      value={pinInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPinInput(val);
                        if (pinError) setPinError("");
                      }}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#37463f]/20 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCheckingPincode || pinInput.length !== 6}
                    className="px-5 py-2.5 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isCheckingPincode ? "Verifying..." : "Check PIN"}
                  </button>

                  {pincodeInfo && (
                    <button
                      type="button"
                      onClick={() => {
                        clearPincode();
                        setPinInput("");
                      }}
                      className="px-3 py-2.5 text-xs text-neutral-500 hover:text-neutral-800 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </form>

                {pinError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1.5">
                    <AlertCircle size={13} /> {pinError}
                  </p>
                )}

                {/* Serviceability Result Card */}
                {pincodeInfo && (
                  <div
                    className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all ${
                      pincodeInfo.serviceable
                        ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                        : "bg-rose-50/80 border-rose-200 text-rose-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold flex items-center gap-1.5">
                        {pincodeInfo.serviceable ? (
                          <>
                            <CheckCircle2
                              size={15}
                              className="text-emerald-600"
                            />
                            <span>
                              Verified Delivery to PIN {pincodeInfo.pincode}
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={15} className="text-rose-600" />
                            <span>Unserviceable Delivery Zone</span>
                          </>
                        )}
                      </span>
                      {pincodeInfo.codAvailable && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
                          COD Available
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] opacity-90 leading-relaxed">
                      {pincodeInfo.message}
                    </p>

                    {pincodeInfo.courierPartner && (
                      <div className="pt-1 text-[10px] opacity-75 flex items-center gap-2">
                        <span>
                          Courier Partner: {pincodeInfo.courierPartner}
                        </span>
                        {pincodeInfo.estimatedDays && (
                          <span>
                            • Est. {pincodeInfo.estimatedDays} business days
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary, Coupons & Checkout */}
            <div className="space-y-6">
              {/* Order Summary Card */}
              <div className="p-6 bg-white rounded-3xl border border-cream-dark shadow-2xs space-y-5">
                <h3 className="font-display font-semibold text-text-dark text-lg border-b border-cream-dark pb-3">
                  Summary & Dispatch
                </h3>

                {/* Privilege Coupons Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-dark flex items-center gap-1.5">
                      <Tag size={13} className="text-[#C5A880]" />
                      <span>Privilege Coupon Code</span>
                    </span>
                    {appliedCoupon && (
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {appliedCoupon ? (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between text-emerald-900">
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          size={15}
                          className="text-emerald-600 shrink-0"
                        />
                        <div>
                          <strong className="font-mono tracking-wider">
                            {appliedCoupon.code}
                          </strong>
                          <span className="text-[11px] text-emerald-700 block">
                            Privilege savings of {formatPrice(discountAmount)}{" "}
                            applied
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="p-1 rounded-full text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. STARLING10"
                        value={couponInput}
                        onChange={(e) =>
                          setCouponInput(e.target.value.toUpperCase())
                        }
                        className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs font-mono uppercase tracking-wider text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#37463f]/20"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-4 py-2 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Line Items Breakdown */}
                <div className="space-y-2.5 text-xs pt-3 border-t border-cream-dark">
                  <div className="flex justify-between text-text-muted">
                    <span>Keepsake Subtotal</span>
                    <span className="font-bold text-text-dark font-mono">
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-medium">
                      <span className="flex items-center gap-1">
                        <Tag size={12} />
                        Coupon Savings ({appliedCoupon?.code})
                      </span>
                      <span className="font-bold font-mono">
                        - {formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}

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

                {/* Handwritten Letter textarea */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-text-dark mb-1.5 flex items-center gap-1.5">
                    <Gift size={13} className="text-[#C5A880]" />
                    <span>Include a Handwritten Letter:</span>
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
                  state={{ giftNote }}
                  className="w-full py-4 bg-text-dark text-cream hover:bg-text-dark/90 font-sans text-xs tracking-widest uppercase font-bold rounded-xl transition shadow-sm text-center block cursor-pointer"
                >
                  Proceed to Checkout • {formatPrice(grandTotal)}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
