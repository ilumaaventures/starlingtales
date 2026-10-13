import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authApi from "../services/authApi";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("starling_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("starling_token") || localStorage.getItem("token") || ""
  );
  const [loading, setLoading] = useState(false);

  // Modal visibility for in-page login/register flow
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // "login" | "register"
  const [onAuthSuccessCallback, setOnAuthSuccessCallback] = useState(null);

  // Load user profile on mount if token exists
  useEffect(() => {
    if (token) {
      authApi
        .getProfileApi()
        .then((res) => {
          const profileData = res?.user || res?.data || res;
          if (profileData && (profileData._id || profileData.email)) {
            setUser(profileData);
            localStorage.setItem("starling_user", JSON.stringify(profileData));
          }
        })
        .catch(() => {
          setToken("");
          setUser(null);
          localStorage.removeItem("starling_token");
          localStorage.removeItem("starling_user");
        });
    }
  }, [token]);

  // Listen for unauthorized events from baseApi
  useEffect(() => {
    const handleUnauthorized = () => {
      setToken("");
      setUser(null);
      localStorage.removeItem("starling_token");
      localStorage.removeItem("starling_user");
    };
    window.addEventListener("starling_auth_unauthorized", handleUnauthorized);
    return () => window.removeEventListener("starling_auth_unauthorized", handleUnauthorized);
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const data = await authApi.loginApi(credentials);
      const authToken = data?.token;
      const userData = data?.user || {
        _id: data?._id,
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        role: data?.role,
        avatar: data?.avatar,
      };

      if (authToken) {
        setToken(authToken);
        localStorage.setItem("starling_token", authToken);
      }
      if (userData) {
        setUser(userData);
        localStorage.setItem("starling_user", JSON.stringify(userData));
      }

      toast.success(`Welcome back, ${userData?.name || "Friend"}! ✨`);
      setAuthModalOpen(false);

      if (onAuthSuccessCallback) {
        onAuthSuccessCallback(userData);
        setOnAuthSuccessCallback(null);
      }

      window.dispatchEvent(new CustomEvent("starling_user_authenticated", { detail: userData }));
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Invalid credentials";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onAuthSuccessCallback]);

  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const data = await authApi.registerApi(userData);
      const authToken = data?.token;
      const userInfo = data?.user || {
        _id: data?._id,
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        role: data?.role,
        avatar: data?.avatar,
      };

      if (authToken) {
        setToken(authToken);
        localStorage.setItem("starling_token", authToken);
      }
      if (userInfo) {
        setUser(userInfo);
        localStorage.setItem("starling_user", JSON.stringify(userInfo));
      }

      toast.success(`Welcome to the Starling Family, ${userInfo?.name || "Storyteller"}! 🕊️`);
      setAuthModalOpen(false);

      if (onAuthSuccessCallback) {
        onAuthSuccessCallback(userInfo);
        setOnAuthSuccessCallback(null);
      }

      window.dispatchEvent(new CustomEvent("starling_user_authenticated", { detail: userInfo }));
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Registration failed";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onAuthSuccessCallback]);

  const loginWithGoogle = useCallback(async (code) => {
    setLoading(true);
    try {
      const data = await authApi.loginWithGoogleApi(code, "user");
      const authToken = data?.token;
      const userData = data?.user || {
        _id: data?._id,
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        role: data?.role,
        avatar: data?.avatar,
      };

      if (authToken) {
        setToken(authToken);
        localStorage.setItem("starling_token", authToken);
      }
      if (userData) {
        setUser(userData);
        localStorage.setItem("starling_user", JSON.stringify(userData));
      }

      toast.success(`Google Sign-in successful! Welcome, ${userData?.name || "Friend"}! ✨`);
      setAuthModalOpen(false);

      if (onAuthSuccessCallback) {
        onAuthSuccessCallback(userData);
        setOnAuthSuccessCallback(null);
      }

      window.dispatchEvent(new CustomEvent("starling_user_authenticated", { detail: userData }));
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Google authentication failed";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onAuthSuccessCallback]);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    try {
      const data = await authApi.updateProfileApi(profileData);
      const updatedUser = data?.user || data;
      if (updatedUser) {
        setUser((prev) => ({ ...prev, ...updatedUser }));
        localStorage.setItem("starling_user", JSON.stringify(updatedUser));
      }
      toast.success("Chronicle details safely preserved! ✨");
      return updatedUser;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Could not update profile";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logoutApi();
    } catch (_) { }
    setUser(null);
    setToken("");
    localStorage.removeItem("starling_token");
    localStorage.removeItem("starling_user");
    toast.success("Safely signed out. See you soon! 🌸");
    window.dispatchEvent(new Event("starling_user_logged_out"));
  }, []);

  const openLoginModal = useCallback((callback = null) => {
    setAuthModalMode("login");
    setOnAuthSuccessCallback(() => callback);
    setAuthModalOpen(true);
  }, []);

  const openRegisterModal = useCallback((callback = null) => {
    setAuthModalMode("register");
    setOnAuthSuccessCallback(() => callback);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setOnAuthSuccessCallback(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    loginWithGoogle,
    updateProfile,
    logout,
    authModalOpen,
    authModalMode,
    setAuthModalMode,
    openLoginModal,
    openRegisterModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
