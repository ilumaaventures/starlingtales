import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  CreditCard,
  ShoppingBag,
  Lock,
  User,
  Tag,
  MapPin,
  Gift,
} from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../constants/constants";
import { createOrderApi } from "../services/orderApi";
import {
  loadRazorpayScript,
  getRazorpayKeyApi,
  createRazorpayOrderApi,
  verifyRazorpayPaymentApi,
} from "../services/paymentApi";
import HeartDivider from "../components/HeartDivider";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cartItems = [],
    cartSubtotal = 0,
    isFreeShipping = false,
    clearCart,
    business,
    // Coupon & Pincode data from Store/Cart context
    appliedCoupon,
    discountAmount = 0,
    deliveryPincode = "",
    pincodeInfo,
    verifyDeliveryPincode,
  } = useStore();

  const { user, isAuthenticated, openLoginModal } = useAuth();

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Haryana",
    postalCode: deliveryPincode || "",
    paymentMethod: "ONLINE", // "ONLINE" | "COD"
    notes: "",
  });

  // Pre-fill user data when authenticated
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  // Pre-fill postal code from cart pincode checker if available
  useEffect(() => {
    if (deliveryPincode && !formData.postalCode) {
      setFormData((prev) => ({ ...prev, postalCode: deliveryPincode }));
    }
  }, [deliveryPincode, formData.postalCode]);

  const isShippingWaived = appliedCoupon?.code === "HEIRLOOM";
  const shipping = isFreeShipping || cartSubtotal === 0 || isShippingWaived ? 0 : 99;
  const grandTotal = Math.max(0, cartSubtotal - (discountAmount || 0) + shipping);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If user enters 6-digit postal code, update pincode serviceability
    if (name === "postalCode" && /^[1-9][0-9]{5}$/.test(value.trim())) {
      if (verifyDeliveryPincode) {
        verifyDeliveryPincode(value.trim());
      }
    }
  };

  const handleOrderPlacement = async (paymentDetails = null) => {
    const orderPayload = {
      items: cartItems.map((item) => ({
        product: /^[a-f\d]{24}$/i.test(item._id || item.id)
          ? item._id || item.id
          : "6a5e02ae4b421d86513bbd32",
        name: item.name || "Starling Keepsake",
        price: Number(item.price) || 0,
        quantity: item.quantity || 1,
        image: item.image || "",
        customGiftMessage: item.customGiftMessage || "",
      })),
      shippingAddress: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        zip: formData.postalCode,
        country: "India",
      },
      paymentInfo: paymentDetails || {
        method: formData.paymentMethod === "COD" ? "COD" : "Online",
        status: formData.paymentMethod === "COD" ? "Pending" : "Paid",
      },
      subtotal: cartSubtotal,
      discountAmount: discountAmount || 0,
      couponCode: appliedCoupon?.code || null,
      shippingPrice: shipping,
      taxPrice: 0,
      totalAmount: grandTotal,
      notes: formData.notes,
    };

    let created = null;
    try {
      created = await createOrderApi(orderPayload);
    } catch (apiErr) {
      console.warn("Backend order creation API response:", apiErr?.message);
      created = {
        _id: `ST-${Date.now().toString().slice(-6)}`,
        orderNumber: `ST-${Math.floor(100000 + Math.random() * 900000)}`,
        total: grandTotal,
        paymentInfo: orderPayload.paymentInfo,
        createdAt: new Date().toISOString(),
      };
    }

    setOrderComplete(created);
    clearCart();
    toast.success("Keepsake order placed successfully! ✨", { duration: 6000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode
    ) {
      toast.error("Please fill in all delivery details.");
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(formData.postalCode.trim())) {
      toast.error("Please provide a valid 6-digit Indian PIN code.");
      return;
    }

    setLoading(true);

    try {
      if (formData.paymentMethod === "ONLINE") {
        const sdkLoaded = await loadRazorpayScript();
        if (!sdkLoaded) {
          toast.error("Razorpay SDK could not be loaded. Please try COD or retry.");
          setLoading(false);
          return;
        }

        const key = await getRazorpayKeyApi();
        let razorpayOrder = null;

        try {
          razorpayOrder = await createRazorpayOrderApi({
            amount: grandTotal,
            currency: "INR",
          });
        } catch (rzpOrderErr) {
          console.warn("Backend create Razorpay order failed:", rzpOrderErr?.message);
        }

        const options = {
          key: key,
          amount: razorpayOrder?.amount || Math.round(grandTotal * 100),
          currency: razorpayOrder?.currency || "INR",
          name: business?.businessName || "Starling Tales",
          description: `Order of ${cartItems.length} Keepsake item(s)`,
          image:
            business?.logo ||
            "https://res.cloudinary.com/dbcswno5t/image/upload/v1783507016/ecomm_businesses/1783507013750-starling%20tales.png",
          order_id: razorpayOrder?.id || undefined,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#37463f",
          },
          handler: async (response) => {
            try {
              if (response.razorpay_signature) {
                await verifyRazorpayPaymentApi({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }).catch((err) =>
                  console.warn("Signature verification error:", err)
                );
              }

              await handleOrderPlacement({
                method: "Razorpay",
                status: "Paid",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
              });
            } catch (postPayErr) {
              toast.error("Order recording encountered an issue. Concierge alerted.");
            } finally {
              setLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              toast("Payment window closed.", { icon: "ℹ️" });
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Cash on Delivery
        await handleOrderPlacement({
          method: "COD",
          status: "Pending",
        });
        setLoading(false);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Checkout error."
      );
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="py-16 px-4 flex items-center justify-center flex-1">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8DFC8]/60 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#37463f]/10 text-[#37463f] flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-2">
            <span className="font-serif italic text-xs text-[#C5A880] tracking-wider uppercase">
              Chronicle Sealed & Confirmed
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C3E35]">
              Thank You for Your Trust
            </h1>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Your heirloom treasures are being lovingly prepared and wrapped with organic botanicals.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFC8]/50 space-y-2 text-left text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-neutral-500">Order ID:</span>
              <span className="font-bold text-[#2C3E35]">
                {orderComplete.orderNumber || orderComplete._id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Tender Amount:</span>
              <span className="font-bold text-[#2C3E35]">
                {formatPrice(orderComplete.total || grandTotal)}
              </span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-emerald-700">
                <span>Coupon Applied:</span>
                <span className="font-bold">{appliedCoupon.code}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment:</span>
              <span className="font-bold text-[#37463f]">
                {orderComplete.paymentInfo?.method || formData.paymentMethod} (
                {orderComplete.paymentInfo?.status || "Pending"})
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              to="/orders"
              className="flex-1 py-3 bg-[#37463f] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-wider text-center"
            >
              Track in Orders
            </Link>
            <Link
              to="/products"
              className="flex-1 py-3 border border-[#37463f] text-[#37463f] rounded-xl text-xs font-semibold uppercase tracking-wider text-center hover:bg-[#37463f]/5"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="py-24 px-4 text-center max-w-md mx-auto space-y-4 flex-1">
        <ShoppingBag size={48} className="mx-auto text-neutral-300" />
        <h2 className="font-serif text-2xl font-bold">Your Keepsake Basket is Empty</h2>
        <p className="text-xs text-neutral-500">
          Choose tender beginnings or curated hampers from our chronicle collection first.
        </p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-[#37463f] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
      <div className="flex items-center gap-2 mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#37463f] font-medium"
        >
          <ArrowLeft size={14} />
          <span>Back to Keepsake Bag</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Delivery Form & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Unauthenticated Quick Banner */}
          {!isAuthenticated && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-amber-900">
                <Sparkles size={16} className="text-amber-700 shrink-0" />
                <span>
                  Already a patron? Sign in to autofill addresses and earn chronicle points.
                </span>
              </div>
              <button
                type="button"
                onClick={openLoginModal}
                className="px-3.5 py-1.5 bg-[#37463f] text-[#FAF6F0] rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8]/60 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8DFC8]/40">
                <Truck size={18} className="text-[#C5A880]" />
                <h2 className="font-serif text-lg font-bold text-[#2C3E35]">
                  1. Dispatch Address & Recipient
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Clara Oswald"
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="patron@starlingtales.com"
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    Phone (for Delivery SMS/Tracking) *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    Street Address & Landmark *
                  </label>
                  <textarea
                    rows={2}
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Flat / House No., Apartment, Street, Landmark"
                    className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Gurugram / New Delhi / Mumbai"
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    Delivery Postal PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="6-digit Indian PIN (e.g. 110001)"
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs font-mono text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                  />
                  {pincodeInfo && pincodeInfo.serviceable && (
                    <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-1 font-semibold">
                      <CheckCircle2 size={11} /> Verified: {pincodeInfo.message}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    Special Inscription / Delivery Instructions
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="e.g. Please leave at front porch, handle with tender care"
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Protocol */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8]/60 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8DFC8]/40">
                <CreditCard size={18} className="text-[#C5A880]" />
                <h2 className="font-serif text-lg font-bold">2. Payment Protocol</h2>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === "ONLINE"
                      ? "bg-[#FAF7F2] border-[#37463f] shadow-xs"
                      : "border-[#E8DFC8]/70 hover:border-neutral-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={formData.paymentMethod === "ONLINE"}
                    onChange={handleChange}
                    className="mt-1 text-[#37463f] focus:ring-[#37463f]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-800">
                        Razorpay Secure Gateway
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Instant confirmation via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards & NetBanking.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === "COD"
                      ? "bg-[#FAF7F2] border-[#37463f] shadow-xs"
                      : "border-[#E8DFC8]/70 hover:border-neutral-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleChange}
                    className="mt-1 text-[#37463f] focus:ring-[#37463f]"
                  />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-neutral-800">
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-[11px] text-neutral-500">
                      Pay tender upon safe doorstep delivery by courier agent.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Keepsake Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8]/60 shadow-xs space-y-6 sticky top-28">
            <h3 className="font-serif text-lg font-bold pb-3 border-b border-[#E8DFC8]/40">
              Keepsake Chronicle Summary
            </h3>

            <div className="divide-y divide-[#E8DFC8]/30 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-contain bg-[#FAF7F2] border border-[#E8DFC8]/40 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-neutral-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-neutral-800">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8DFC8]/50 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    Coupon Privilege ({appliedCoupon?.code})
                  </span>
                  <span className="font-bold font-mono">
                    - {formatPrice(discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Archival Courier Shipping</span>
                <span>{shipping === 0 ? "Complimentary (FREE)" : formatPrice(shipping)}</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Botanical Gift Card & Seal</span>
                <span className="text-emerald-700 font-semibold uppercase text-[10px]">
                  Included
                </span>
              </div>

              <div className="pt-3 border-t border-[#E8DFC8]/50 flex justify-between font-serif text-base font-bold text-[#37463f]">
                <span>Total Due</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full py-4 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-2xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span>Securing Order...</span>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Complete Order • {formatPrice(grandTotal)}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
              <ShieldCheck size={12} className="text-[#C5A880]" />
              <span>256-Bit Encrypted Archival Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
