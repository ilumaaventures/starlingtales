/**
 * Business Configuration for Starling Tales Storefront
 * Configures the target business identifier for scoped storefront APIs
 */

export const BUSINESS_SLUG =
  import.meta.env.VITE_STORE_SLUG ||
  import.meta.env.VITE_BUSINESS_NAME ||
  "starlingtales";

export const BUSINESS_CONFIG = {
  name: "Starling Tales",
  tagline: "Handcrafted Keepsakes & Heirloom Companions",
  slug: BUSINESS_SLUG,
  supportEmail: "hello@starlingtales.com",
  phone: "+91 98765 43210",
  whatsappNumber: "919876543210",
  city: "Mumbai, Maharashtra",
  country: "India",
  currency: "INR",
  currencySymbol: "₹",
  freeShippingThreshold: 5000,
};

export default BUSINESS_CONFIG;
