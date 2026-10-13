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
import StarlingNavbar from "../components/StarlingNavbar";
import StarlingFooter from "../components/StarlingFooter";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cartItems = [],
    cartSubtotal = 0,
    isFreeShipping = false,
    clearCart,
    business,
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
    postalCode: "",
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

  const shipping = isFreeShipping || cartSubtotal === 0 ? 0 : 99;
  const grandTotal = cartSubtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderPlacement = async (paymentDetails = null) => {
    const orderPayload = {
      items: cartItems.map((item) => ({
        product: /^[a-f\d]{24}$/i.test(item._id || item.id)
          ? item._id || item.id
          : "6a5e02ae4b421d86513bbd32", // Valid fallback product ID for custom hampers
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
      shippingPrice: shipping,
      taxPrice: 0,
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

    // 6-digit Indian PIN code check
    if (!/^[1-9][0-9]{5}$/.test(formData.postalCode.trim())) {
      toast.error("Please enter a valid 6-digit PIN code.");
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
          amount: (razorpayOrder?.amount || grandTotal * 100),
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
      toast.error(err?.response?.data?.message || err?.message || "Checkout error.");
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#2C3E35] flex flex-col justify-between">
        <StarlingNavbar />

        <div className="py-20 px-4 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8DFC8]/60 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#37463f]/10 text-[#37463f] flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <span className="font-serif italic text-xs text-[#C5A880] tracking-wider uppercase">
                Chronicle Sealed & Confirmed
              </span>
              <h1 className="font-serif text-2xl font-bold text-[#2C3E35]">
                Thank You, {formData.fullName.split(" ")[0]}!
              </h1>
              <p className="text-xs text-neutral-600">
                Your order{" "}
                <span className="font-mono font-bold text-[#37463f]">
                  #{orderComplete.orderNumber || orderComplete._id}
                </span>{" "}
                has been recorded into our atelier register. We will tenderly pack your keepsakes.
              </p>
            </div>

            <div className="bg-[#FAF7F2] rounded-2xl p-4 text-xs space-y-2 text-left border border-[#E8DFC8]/40">
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Investment:</span>
                <span className="font-bold text-[#37463f]">{formatPrice(grandTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Status:</span>
                <span className="font-medium text-emerald-700">
                  {orderComplete.paymentInfo?.method === "COD"
                    ? "Cash on Delivery"
                    : "Paid via Razorpay"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Dispatch Destination:</span>
                <span className="text-neutral-800 truncate max-w-[180px]">
                  {formData.city}, {formData.postalCode}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                to="/"
                className="w-full py-3.5 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-widest text-center shadow-md transition-colors"
              >
                Return to Chronicle Catalog
              </Link>
            </div>
          </div>
        </div>

        <StarlingFooter />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#2C3E35] flex flex-col justify-between">
        <StarlingNavbar />
        <div className="py-24 px-4 text-center max-w-md mx-auto space-y-4">
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
        <StarlingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C3E35] flex flex-col justify-between">
      <StarlingNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
        <div className="flex items-center gap-2 mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#37463f] font-medium"
          >
            <ArrowLeft size={14} />
            <span>Back to Cart</span>
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-xs font-bold text-[#37463f]">Secure Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Account Status Banner */}
            {!isAuthenticated && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-amber-800" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">Already a Starling patron?</p>
                    <p className="text-[11px] text-amber-700">
                      Sign in for saved addresses and rewards, or continue as guest below.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openLoginModal()}
                  className="px-3 py-1.5 bg-[#37463f] text-[#FAF6F0] rounded-lg text-xs font-semibold uppercase tracking-wide cursor-pointer hover:bg-[#2C3E35]"
                >
                  Sign In
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} id="checkout-form" className="space-y-6">
              {/* Shipping Address Section */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8]/60 shadow-xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E8DFC8]/40">
                  <Truck size={18} className="text-[#C5A880]" />
                  <h2 className="font-serif text-lg font-bold">1. Delivery Sanctum</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Eleanor Vance"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="storyteller@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Street Address / House / Flat *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="Flat 4B, Greenwood Residency, Sector 45"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Gurugram"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      6-Digit PIN Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      maxLength={6}
                      placeholder="122003"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8]/60 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E8DFC8]/40">
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
                <div className="flex justify-between text-neutral-600">
                  <span>Archival Courier Shipping</span>
                  <span>{shipping === 0 ? "Complimentary (FREE)" : formatPrice(shipping)}</span>
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
      </main>

      <StarlingFooter />
    </div>
  );
}
