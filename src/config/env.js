/**
 * Centralized Environment & Subdomain Configuration for Starling Tales Storefront
 */
const isProd = import.meta.env.PROD;

export const ROOT_DOMAIN =
  import.meta.env.VITE_ROOT_DOMAIN || (isProd ? "ilumaa.com" : "localhost");

// Base URL for backend REST API
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  (isProd ? `https://api.${ROOT_DOMAIN}` : "http://localhost:5000");

export const BASE_URL = API_BASE_URL.replace(/\/+$/, "");
export const API_URL = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

export const STORE_SLUG =
  import.meta.env.VITE_STORE_SLUG ||
  import.meta.env.VITE_BUSINESS_NAME ||
  "starlingtales";

export default {
  ROOT_DOMAIN,
  API_BASE_URL,
  BASE_URL,
  API_URL,
  STORE_SLUG,
};
