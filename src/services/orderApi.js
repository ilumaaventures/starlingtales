import baseApi from "./baseApi";

/**
 * Customer Order APIs connected to ILumaaSocialBackend orderRoutes.js
 */

export const createOrderApi = async (orderPayload) => {
  const res = await baseApi.post("/orders", orderPayload);
  return res.data;
};

export const getOrderByIdApi = async (orderId) => {
  const res = await baseApi.get(`/orders/${orderId}`);
  return res.data;
};

export const getMyOrdersApi = async (params = {}) => {
  const res = await baseApi.get("/orders/my-orders", { params });
  return res.data;
};

export const cancelOrderApi = async (orderId, reason = "") => {
  const res = await baseApi.patch(`/orders/${orderId}/cancel`, { reason });
  return res.data;
};
