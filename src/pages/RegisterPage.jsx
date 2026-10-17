import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Feather,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import GoogleAuthButton from "../components/GoogleAuthButton";
import starlingLogo from "../assets/logo.jpeg";

export default function RegisterPage() {
  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const redirectTo = location.state?.from || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = "Please provide your full name (at least 2 characters).";
    }
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errs.email = "Please provide a valid email address.";
    }
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = "Please provide a valid 10-digit phone number.";
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters long.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
      });
      navigate(redirectTo, { replace: true });
    } catch (_) {}
  };

  return (
    <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#E8DFD2] selection:text-[#2C3E35]">
      <div className="w-full max-w-xl bg-white border border-[#E8DFC8]/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#FAF7F2] rounded-2xl p-1.5 mx-auto border border-[#E8DFC8] shadow-xs flex items-center justify-center">
            <img
              src={starlingLogo}
              alt="Starling Tales"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#37463f]/10 text-[#37463f] text-[11px] font-serif italic">
            <Sparkles size={11} className="text-[#C5A880]" />
            <span>Begin Your Chronicle</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C3E35]">
            Create Account
          </h1>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Join the Starling Tales family to curate nursery keepsakes, archival hampers, and milestones.
          </p>
        </div>

        {/* Google Sign-in Option */}
        <div className="space-y-3">
          <GoogleAuthButton
            text="Sign up with Google"
            onSuccessRedirect={() => navigate(redirectTo, { replace: true })}
          />

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E8DFC8]/60 w-full" />
            <span className="bg-white px-3 text-[10px] uppercase tracking-wider text-neutral-400 font-semibold absolute">
              or register with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  required
                  placeholder="Elena Vance"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  className={`w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] ${
                    errors.name ? "border-red-400" : "border-[#E8DFC8]"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.name}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Phone Number (India) *
              </label>
              <div className="relative">
                <Phone
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: null });
                  }}
                  className={`w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] ${
                    errors.phone ? "border-red-400" : "border-[#E8DFC8]"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.phone}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="email"
                  required
                  placeholder="storyteller@starlingtales.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  className={`w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] ${
                    errors.email ? "border-red-400" : "border-[#E8DFC8]"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.email}
                </p>
              )}
            </div>

            {/* Password with Eye Toggle */}
            <div>
              <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  className={`w-full pl-9 pr-9 py-2 bg-[#FAF7F2] border rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] ${
                    errors.password ? "border-red-400" : "border-[#E8DFC8]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.password}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Creating Sanctuary Profile...</span>
            ) : (
              <>
                <span>Create Chronicle Account</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#E8DFC8]/50 text-center space-y-3">
          <p className="text-xs text-neutral-500">
            Already registered with Starling Tales?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#37463f] hover:underline"
            >
              Sign in here
            </Link>
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700"
          >
            <ArrowLeft size={12} />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
