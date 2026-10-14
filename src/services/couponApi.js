import baseApi from "./baseApi";

/**
 * Starling Tales Promotional & Archival Coupon Validation
 */

// Preset Starling Tales Patron Coupons
export const STARLING_PRESET_COUPONS = [
  {
    code: "STARLING10",
    title: "Patron Milestone Privilege",
    description: "10% off on your entire keepsake order",
    discountType: "percentage",
    discountAmount: 10,
    minOrderAmount: 1500,
  },
  {
    code: "WELCOME500",
    title: "New Sanctuary Welcome",
    description: "Flat ₹500 off on hampers over ₹3,500",
    discountType: "fixed",
    discountAmount: 500,
    minOrderAmount: 3500,
  },
  {
    code: "HEIRLOOM",
    title: "Complimentary Courier Waiver",
    description: "Complimentary archival shipping waiver",
    discountType: "fixed",
    discountAmount: 99,
    minOrderAmount: 999,
  },
  {
    code: "CP3",
    title: "Chronicle Festive Privilege",
    description: "30% off on your keepsake basket",
    discountType: "percentage",
    discountAmount: 30,
    minOrderAmount: 400,
  },
];

export const validateCouponApi = async ({ code, cartItems = [], subtotal = 0 }) => {
  const cleanCode = (code || "").trim().toUpperCase();
  if (!cleanCode) {
    throw new Error("Please enter a valid coupon code.");
  }

  // 1. First, check backend database validation endpoint
  try {
    const formattedItems = cartItems.map((item) => ({
      product: item._id || item.id,
      quantity: item.quantity || 1,
      price: Number(item.price) || 0,
    }));

    const res = await baseApi.post("/coupons/validate", {
      code: cleanCode,
      cartItems: formattedItems,
      items: formattedItems,
    });

    if (res.data) {
      const data = res.data;
      const rawDisc = data.discountAmount || data.discount || 0;
      return {
        success: true,
        code: data.coupon?.code || cleanCode,
        discountAmount: Number(rawDisc),
        discountType: data.coupon?.discountType || "fixed",
        message: data.message || `Coupon ${cleanCode} applied successfully!`,
      };
    }
  } catch (apiErr) {
    console.warn("Backend coupon validate responded:", apiErr?.response?.data?.message || apiErr?.message);
  }

  // 2. Fallback check for brand-preset Starling Tales coupons
  const preset = STARLING_PRESET_COUPONS.find(
    (c) => c.code.toUpperCase() === cleanCode
  );

  if (preset) {
    if (subtotal < preset.minOrderAmount) {
      throw new Error(
        `Coupon ${cleanCode} requires a minimum order value of ₹${preset.minOrderAmount.toLocaleString("en-IN")}.`
      );
    }

    let calculatedDiscount = 0;
    if (preset.discountType === "percentage") {
      calculatedDiscount = Math.round((subtotal * preset.discountAmount) / 100);
    } else {
      calculatedDiscount = preset.discountAmount;
    }

    return {
      success: true,
      code: preset.code,
      discountAmount: calculatedDiscount,
      discountType: preset.discountType,
      message: `Privilege coupon "${preset.code}" applied! You saved ₹${calculatedDiscount.toLocaleString("en-IN")}. ✨`,
    };
  }

  throw new Error(`The coupon code "${cleanCode}" is invalid or expired.`);
};
