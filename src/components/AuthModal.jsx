import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
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

  const [showPassword, setShowPassword] = useState(false);

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
      // Error handled with toast in AuthContext
    }
  };

  const isRegister = authModalMode === "register";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={closeAuthModal}
    >
      <div
        className={`relative w-full ${
          isRegister ? "max-w-lg" : "max-w-md"
        } bg-[#FAF7F2] text-[#2C3E35] rounded-3xl shadow-2xl border border-[#E8DFC8]/80 overflow-hidden max-h-[92vh] flex flex-col transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact & Refined Header */}
        <div className="bg-[#37463f] text-[#FAF6F0] px-6 py-4 relative flex items-center justify-between border-b border-[#C5A880]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl p-1 shadow-sm flex items-center justify-center border border-[#C5A880]/40 shrink-0">
              <img
                src={starlingLogo}
                alt="Starling Tales"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[#C5A880] text-[10px] font-serif uppercase tracking-widest font-semibold">
                <Sparkles size={11} />
                <span>The Starling Chronicles</span>
              </div>
              <h2 className="font-serif text-lg font-bold tracking-tight text-[#FAF6F0] leading-tight">
                {isRegister ? "Create Sanctuary" : "Welcome to the Haven"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF6F0] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#E8DFC8]/60 bg-white/60 shrink-0">
          <button
            type="button"
            className={`flex-1 py-2.5 text-xs font-serif uppercase tracking-widest transition-all cursor-pointer ${
              !isRegister
                ? "text-[#37463f] border-b-2 border-[#37463f] font-bold bg-[#FAF7F2]"
                : "text-neutral-500 hover:text-neutral-800 font-medium"
            }`}
            onClick={() => setAuthModalMode("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 text-xs font-serif uppercase tracking-widest transition-all cursor-pointer ${
              isRegister
                ? "text-[#37463f] border-b-2 border-[#37463f] font-bold bg-[#FAF7F2]"
                : "text-neutral-500 hover:text-neutral-800 font-medium"
            }`}
            onClick={() => setAuthModalMode("register")}
          >
            Create Account
          </button>
        </div>

        {/* Form Body - Compact & Scrollable if Needed */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Google One-Click Auth */}
          <div className="space-y-3">
            <GoogleAuthButton
              text={isRegister ? "Sign up with Google" : "Continue with Google"}
              onSuccessRedirect={closeAuthModal}
            />

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#E8DFC8]/70 w-full" />
              <span className="bg-[#FAF7F2] px-3 text-[10px] uppercase tracking-wider text-neutral-400 font-semibold absolute">
                or with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister ? (
              /* Organized 2-Column Grid for Register Fields */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Eleanor Vance"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] focus:border-[#37463f]"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] focus:border-[#37463f]"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="patron@starlingtales.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] focus:border-[#37463f]"
                    />
                  </div>
                </div>

                {/* Password with Eye Toggle */}
                <div>
                  <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      minLength={4}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-9 pr-9 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] focus:border-[#37463f]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Login Mode - Stacked Single Column */
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="patron@starlingtales.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] focus:border-[#37463f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] focus:border-[#37463f]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2.5 px-4 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span>Connecting to Haven...</span>
              ) : (
                <>
                  <span>
                    {isRegister ? "Create Sanctuary" : "Enter Chronicle"}
                  </span>
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Secure Footer Note */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 pt-1">
            <ShieldCheck size={12} className="text-[#C5A880]" />
            <span>Protected by Starling Tales Privacy & Care Protocol.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
