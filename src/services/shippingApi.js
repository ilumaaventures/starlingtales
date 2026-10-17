import baseApi from "./baseApi";

/**
 * Starling Tales Pincode Delivery & Courier Serviceability Service
 */

export const checkPincodeServiceabilityApi = async (pincode, options = {}) => {
  const cleanPincode = (pincode || "").toString().trim();

  if (!/^[1-9][0-9]{5}$/.test(cleanPincode)) {
    return {
      serviceable: false,
      pincode: cleanPincode,
      message: "Please enter a valid 6-digit Indian delivery PIN code.",
      codAvailable: false,
      estimatedDays: null,
      courierPartner: null,
      shippingFee: 69,
      courierRate: 69,
      deliveryDate: null,
      pricing: null,
    };
  }

  // 1. Live Shadowfax Logistics Serviceability & Pricing Query
  try {
    const res = await baseApi.post("/shipments/serviceability", {
      deliveryPincode: cleanPincode,
      pickupPincode: "560001",
      paymentMode: options.paymentMode || "PREPAID",
      subtotal: options.subtotal || 1000,
      weight: options.weight || 500,
    });

    if (res.data) {
      const data = res.data;
      const isServiceable = data.serviceable !== false && data.status !== "NON_SERVICEABLE";
      const fee = Number(data.shippingFee ?? data.pricing?.finalShippingFee ?? 69);
      const courierRate = Number(data.courierRate ?? data.pricing?.courierRate ?? fee);

      return {
        serviceable: isServiceable,
        pincode: cleanPincode,
        estimatedDays: data.estimatedDays || (cleanPincode.startsWith("1") ? 2 : 3),
        deliveryDate: data.deliveryDate || null,
        courierPartner: data.courierPartner || "Shadowfax Logistics",
        codAvailable: isServiceable ? data.codAvailable !== false : false,
        shippingFee: fee,
        courierRate: courierRate,
        pricing: data.pricing || null,
        planName: data.pricing?.planName || "Shadowfax Surface Express",
        zoneDescription: data.pricing?.zoneDescription || "",
        message:
          data.message ||
          (isServiceable
            ? `Shadowfax Express delivery verified for PIN ${cleanPincode} • ₹${fee}`
            : `Shadowfax delivery is currently unavailable for PIN ${cleanPincode}.`),
      };
    }
  } catch (err) {
    console.warn("Backend Shadowfax courier check responded, using regional matrix:", err?.message);
  }

  // 2. Regional Shadowfax Matrix fallback
  const isNCR =
    cleanPincode.startsWith("11") ||
    cleanPincode.startsWith("12") ||
    cleanPincode.startsWith("20");
  const isMetro =
    isNCR ||
    cleanPincode.startsWith("40") ||
    cleanPincode.startsWith("56") ||
    cleanPincode.startsWith("60") ||
    cleanPincode.startsWith("70") ||
    cleanPincode.startsWith("50") ||
    cleanPincode.startsWith("38");

  const days = isNCR ? 2 : isMetro ? 3 : 4;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);

  const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const fallbackFee = isNCR ? 59 : isMetro ? 69 : 79;

  return {
    serviceable: true,
    pincode: cleanPincode,
    estimatedDays: days,
    estimatedDateText: formattedDate,
    deliveryDate: formattedDate,
    courierPartner: "Shadowfax Logistics",
    planName: "Shadowfax Surface Express",
    zoneDescription: isNCR ? "NCR Express Hub" : isMetro ? "Metro Express Delivery" : "National Express",
    codAvailable: true,
    shippingFee: fallbackFee,
    courierRate: fallbackFee,
    pricing: {
      finalShippingFee: fallbackFee,
      courierRate: fallbackFee,
      planName: "Shadowfax Surface Express",
      zoneDescription: isMetro ? "Metro Express Delivery" : "National Express",
    },
    message: `Shadowfax Express delivery by ${formattedDate} (${days} business days) • ₹${fallbackFee} shipping. COD eligible.`,
  };
};
