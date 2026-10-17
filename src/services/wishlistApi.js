import baseApi from "./baseApi";

/**
 * Fetch current user's or guest's wishlist
 * @returns {Promise<{ products: Array, _id: string }>}
 */
export const getWishlistApi = async () => {
  const response = await baseApi.get("/wishlist");
  return response.data;
};

/**
 * Add product to wishlist
 * @param {string} productId
 * @param {object} productData
 * @returns {Promise<any>}
 */
export const addToWishlistApi = async (productId, productData = {}) => {
  const payload = {
    productId,
    name: productData.name,
    price: productData.price,
    originalPrice: productData.originalPrice || productData.compareAtPrice,
    image: productData.image || productData.images?.[0]?.url || productData.images?.[0],
    category: typeof productData.category === "object" ? productData.category?.name : productData.category,
  };
  const response = await baseApi.post("/wishlist/add", payload);
  return response.data;
};

/**
 * Remove product from wishlist
 * @param {string} productId
 * @returns {Promise<any>}
 */
export const removeFromWishlistApi = async (productId) => {
  const response = await baseApi.delete(`/wishlist/remove/${productId}`);
  return response.data;
};

/**
 * Sync offline/guest wishlist items with backend on login
 * @param {Array<string>} productIds
 * @returns {Promise<any>}
 */
export const syncWishlistApi = async (productIds) => {
  const response = await baseApi.post("/wishlist/sync", { productIds });
  return response.data;
};

export default {
  getWishlistApi,
  addToWishlistApi,
  removeFromWishlistApi,
  syncWishlistApi,
};
