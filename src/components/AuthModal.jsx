import React, { useState } from "react";
import { X, Mail, Lock, User, Phone, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GoogleAuthButton from "./GoogleAuthButton";
import starlingLogo from "../assets/logo.jpeg";

export default function AuthModal() {
  const {
    authModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuthModal,
    login,
    register,
    loading,
  } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  if (!authModalOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authModalMode === "login") {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
      }
    } catch (_) {
      // Error is handled with toast in AuthContext
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-[#FAF7F2] text-[#2C3E35] rounded-3xl shadow-2xl border border-[#E8DFC8]/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fairy Tale Floral Header Motif */}
        <div className="bg-[#37463f] text-[#FAF6F0] p-6 text-center relative">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[#FAF6F0]/70 hover:text-[#FAF6F0] hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="w-12 h-12 bg-white/95 rounded-xl p-1.5 mx-auto mb-2.5 shadow-md flex items-center justify-center border border-[#C5A880]/30">
            <img
              src={starlingLogo}
              alt="Starling Tales"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="inline-flex items-center justify-center gap-2 mb-1 px-3 py-1 rounded-full bg-white/10 text-[#C5A880] text-xs font-serif italic tracking-wide">
            <Sparkles size={12} />
            <span>The Starling Chronicles</span>
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#FAF6F0]">
            {authModalMode === "login"
              ? "Welcome to the Haven"
              : "Begin Your Chronicle"}
          </h2>
          <p className="text-xs text-[#FAF6F0]/80 mt-1 max-w-xs mx-auto">
            {authModalMode === "login"
              ? "Sign in to access your curated hampers, nursery keepsakes, and orders."
              : "Create your personal sanctuary to save memories and curate custom gifts."}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#E8DFC8]/50 bg-white/50">
          <button
            type="button"
            className={`flex-1 py-3 text-xs font-medium uppercase tracking-widest transition-colors ${
              authModalMode === "login"
                ? "text-[#37463f] border-b-2 border-[#37463f] font-semibold bg-[#FAF7F2]"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
            onClick={() => setAuthModalMode("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 py-3 text-xs font-medium uppercase tracking-widest transition-colors ${
              authModalMode === "register"
                ? "text-[#37463f] border-b-2 border-[#37463f] font-semibold bg-[#FAF7F2]"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
            onClick={() => setAuthModalMode("register")}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 bg-[#FAF7F2]">
          {/* Google One-Click Button */}
          <div className="space-y-3">
            <GoogleAuthButton
              text={
                authModalMode === "login"
                  ? "Continue with Google"
                  : "Sign up with Google"
              }
              onSuccessRedirect={closeAuthModal}
            />

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#E8DFC8]/60 w-full" />
              <span className="bg-[#FAF7F2] px-3 text-[10px] uppercase tracking-wider text-neutral-400 font-semibold absolute">
                or with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === "register" && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Eleanor Vance"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30 focus:border-[#37463f]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="storyteller@starlingtales.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30 focus:border-[#37463f]"
                />
              </div>
            </div>

            {authModalMode === "register" && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30 focus:border-[#37463f]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={4}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30 focus:border-[#37463f]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span>Connecting to Haven...</span>
              ) : (
                <>
                  <span>
                    {authModalMode === "login"
                      ? "Enter Chronicle"
                      : "Create Sanctuary"}
                  </span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <p className="text-[10px] text-center text-neutral-400 pt-1">
            Protected by Starling Tales Privacy & Care Chronicle.
          </p>
        </div>
      </div>
    </div>
  );
}
