import baseApi from "./baseApi";

/**
 * Fetch storefront metadata and brand details for Starling Tales
 */
export const getStoreDetails = async () => {
  const response = await baseApi.get("/public/store/details");
  return response.data;
};

/**
 * Fetch products for the Starling Tales storefront
 */
export const getStoreProducts = async (params = {}) => {
  const response = await baseApi.get("/public/store/products", { params });
  return response.data;
};

/**
 * Fetch a single product by ID scoped to the Starling Tales storefront
 */
export const getStoreProductById = async (productId) => {
  const response = await baseApi.get(`/public/store/product/${productId}`);
  return response.data;
};

/**
 * Fetch categories belonging to the Starling Tales storefront
 */
export const getStoreCategories = async () => {
  const response = await baseApi.get("/public/store/categories");
  return response.data;
};

/**
 * Fetch banners for the Starling Tales storefront
 */
export const getStoreBanners = async () => {
  const response = await baseApi.get("/public/store/banners");
  return response.data;
};

/**
 * Fetch reviews for the Starling Tales storefront
 */
export const getStoreReviews = async () => {
  const response = await baseApi.get("/public/store/reviews");
  return response.data;
};

/**
 * Fetch store policies
 */
export const getStorePolicies = async () => {
  const response = await baseApi.get("/public/store/policies");
  return response.data;
};

/**
 * Fetch featured products for Starling Tales
 */
export const getFeaturedProducts = async (params = {}) => {
  try {
    const response = await baseApi.get("/public/store/featured-products", {
      params,
    });
    const data = response.data;
    return Array.isArray(data) ? data : data?.products || data?.data || [];
  } catch (err) {
    const fallbackResponse = await baseApi.get("/public/store/products", {
      params: { ...params, isFeatured: true },
    });
    const fallbackData = fallbackResponse.data;
    return Array.isArray(fallbackData)
      ? fallbackData
      : fallbackData?.products || fallbackData?.data || [];
  }
};
