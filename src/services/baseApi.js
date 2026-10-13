import axios from "axios";
import { API_URL, STORE_SLUG } from "../config/env";

export { STORE_SLUG };

const baseApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Central Request Interceptor: automatically attaches X-Store-Slug and Auth token
baseApi.interceptors.request.use(
  (config) => {
    // Attach Development Store Slug for custom storefront identification
    if (STORE_SLUG) {
      config.headers["X-Store-Slug"] = STORE_SLUG;
    }

    const token = localStorage.getItem("starling_token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Central Response Interceptor
baseApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("starling_token");
      window.dispatchEvent(new Event("starling_auth_unauthorized"));
    }
    return Promise.reject(error);
  },
);

export default baseApi;
