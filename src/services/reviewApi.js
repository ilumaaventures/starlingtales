import baseApi from "./baseApi";

/**
 * Fetch reviews for a specific product
 * GET /api/reviews/product/:productId
 */
export const getProductReviews = async (productId, params = {}) => {
  try {
    const res = await baseApi.get(`/reviews/product/${productId}`, { params });
    return res.data;
  } catch (err) {
    console.error("Error fetching product reviews:", err);
    throw err;
  }
};

/**
 * Create a new review
 * POST /api/reviews
 */
export const createReview = async (reviewData) => {
  try {
    const isFormData = typeof FormData !== "undefined" && reviewData instanceof FormData;
    const res = await baseApi.post("/reviews", reviewData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return res.data;
  } catch (err) {
    console.error("Error submitting review:", err);
    throw err;
  }
};

/**
 * Mark a review as helpful
 * PUT /api/reviews/:id/helpful
 */
export const toggleReviewHelpful = async (reviewId) => {
  try {
    const res = await baseApi.put(`/reviews/${reviewId}/helpful`);
    return res.data;
  } catch (err) {
    console.error("Error toggling helpful vote:", err);
    throw err;
  }
};
