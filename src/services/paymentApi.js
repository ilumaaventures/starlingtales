import baseApi from "./baseApi";

/**
 * Dynamically loads the official Razorpay Checkout SDK
 * @returns {Promise<boolean>}
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("❌ Failed to load Razorpay Checkout script");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Fetch Razorpay Public Key from backend
 */
export const getRazorpayKeyApi = async () => {
  try {
    const res = await baseApi.get("/payments/key");
    if (res.data?.key) return res.data.key;
  } catch (err) {
    console.warn("Could not fetch key from backend, checking env:", err);
  }
  return import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TTtsKzOiG9Mky3";
};

/**
 * Create Razorpay Order on backend
 */
export const createRazorpayOrderApi = async ({ amount, currency = "INR", orderId, notes = {} }) => {
  const res = await baseApi.post("/payments/create-order", {
    amount,
    currency,
    orderId,
    notes,
  });
  return res.data;
};

/**
 * Verify Razorpay payment signature on backend
 */
export const verifyRazorpayPaymentApi = async (verificationData) => {
  const res = await baseApi.post("/payments/verify", verificationData);
  return res.data;
};
