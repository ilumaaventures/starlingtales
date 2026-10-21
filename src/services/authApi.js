import baseApi from "./baseApi";

/**
 * Customer Authentication & Profile APIs connected to ILumaa Backend
 */

export const loginApi = async (credentials) => {
  const res = await baseApi.post("/auth/login", credentials);
  return res.data;
};

export const registerApi = async (userData) => {
  const res = await baseApi.post("/auth/register", {
    ...userData,
    role: "user", // Storefront customers register as 'user'
  });
  return res.data;
};

export const loginWithGoogleApi = async (code, role = "user") => {
  const res = await baseApi.post("/auth/google", { code, role });
  return res.data;
};

export const getProfileApi = async () => {
  const res = await baseApi.get("/auth/profile");
  return res.data;
};

export const getMeApi = async () => {
  try {
    const res = await baseApi.get("/auth/profile");
    return res.data;
  } catch (err) {
    const res = await baseApi.get("/auth/getme");
    return res.data;
  }
};

export const updateProfileApi = async (profileData) => {
  const res = await baseApi.put("/users/profile", profileData);
  return res.data;
};

export const changePasswordApi = async ({ currentPassword, newPassword }) => {
  const res = await baseApi.put("/users/change-password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};

export const getAddressesApi = async () => {
  try {
    const res = await baseApi.get("/users/addresses");
    return res.data;
  } catch {
    return [];
  }
};

export const addAddressApi = async (addressData) => {
  const res = await baseApi.post("/users/addresses", addressData);
  return res.data;
};

export const deleteAddressApi = async (addressId) => {
  const res = await baseApi.delete(`/users/addresses/${addressId}`);
  return res.data;
};

export const logoutApi = async () => {
  try {
    const res = await baseApi.post("/auth/logout");
    return res.data;
  } catch (_) {
    return { success: true };
  }
};

export const forgotPasswordApi = async (email) => {
  const res = await baseApi.post("/auth/forgot-password", {
    email: typeof email === "string" ? email.trim() : email,
  });
  return res.data;
};

export const verifyOtpApi = async ({ email, otp }) => {
  const res = await baseApi.post("/auth/verify-otp", {
    email: typeof email === "string" ? email.trim().toLowerCase() : email,
    otp: typeof otp === "string" ? otp.trim() : otp,
  });
  return res.data;
};

export const resetPasswordApi = async ({ resetToken, token, email, newPassword, password }) => {
  const tokenToUse = resetToken || token;
  const passwordToSet = newPassword || password;
  const res = await baseApi.post("/auth/reset-password", {
    resetToken: tokenToUse,
    token: tokenToUse,
    email: typeof email === "string" ? email.trim().toLowerCase() : email,
    newPassword: passwordToSet,
    password: passwordToSet,
  });
  return res.data;
};

