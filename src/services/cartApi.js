import baseApi from "./baseApi";

/**
 * Cart APIs matching ILumaaSocialBackend cartRoutes.js
 */

export const getCartApi = async () => {
  const res = await baseApi.get("/cart");
  return res.data;
};

export const addToCartApi = async (productId, quantity = 1, variantData = {}) => {
  const res = await baseApi.post("/cart/add", {
    productId,
    quantity,
    ...variantData,
  });
  return res.data;
};

export const updateCartQuantityApi = async (productId, quantity) => {
  const res = await baseApi.put("/cart/update", {
    productId,
    quantity,
  });
  return res.data;
};

export const removeFromCartApi = async (productId) => {
  const res = await baseApi.delete(`/cart/remove/${productId}`);
  return res.data;
};

export const clearCartApi = async () => {
  const res = await baseApi.delete("/cart/clear");
  return res.data;
};

export const syncCartApi = async (items) => {
  const res = await baseApi.post("/cart/sync", { items });
  return res.data;
};
