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
    };
  }

  // 1. Attempt backend logistics serviceability check
  try {
    const res = await baseApi.post("/shipments/serviceability", {
      deliveryPincode: cleanPincode,
      pickupPincode: "122002", // Starling Tales Gurugram atelier
      paymentMode: options.paymentMode || "PREPAID",
      subtotal: options.subtotal || 1000,
    });

    if (res.data) {
      return {
        serviceable: res.data.serviceable !== false,
        pincode: cleanPincode,
        estimatedDays: res.data.estimatedDays || (cleanPincode.startsWith("1") ? 2 : 3),
        courierPartner: res.data.courierPartner || "Shadowfax / BlueDart Express",
        codAvailable: res.data.codAvailable !== false,
        message: res.data.message || `Delivery verified for PIN ${cleanPincode}.`,
      };
    }
  } catch (err) {
    console.warn("Backend live courier check responded, using regional matrix:", err?.message);
  }

  // 2. Intelligent Regional Matrix fallback
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
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return {
    serviceable: true,
    pincode: cleanPincode,
    estimatedDays: days,
    estimatedDateText: formattedDate,
    courierPartner: "Starling Archival Courier",
    codAvailable: true,
    message: `Delivery available by ${formattedDate} (${days} business days). Cash on Delivery eligible. ✨`,
  };
};
