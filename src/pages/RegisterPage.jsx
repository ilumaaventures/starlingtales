import React, { useState } from "react";
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
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import GoogleAuthButton from "../components/GoogleAuthButton";
import StarlingNavbar from "../components/StarlingNavbar";
import StarlingFooter from "../components/StarlingFooter";

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

  const [errors, setErrors] = useState({});

  const redirectTo = location.state?.from || "/";

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = "Please provide your full name (at least 2 characters).";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
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
      toast.error("Please correct the form fields.");
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
    } catch (_) { }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C3E35] flex flex-col justify-between">
      <StarlingNavbar />

      <main className="flex-1 flex items-center justify-center p-6 my-12">
        <div className="w-full max-w-md bg-white border border-[#E8DFC8]/60 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#37463f]/10 text-[#37463f] text-xs font-serif italic">
              <Sparkles size={12} />
              <span>Begin Your Story</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#2C3E35]">
              Create Account
            </h1>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              Join the Starling Tales family to preserve milestones, gift hampers, and nursery treasures.
            </p>
          </div>

          {/* Google Sign-in Option */}
          <div className="space-y-4">
            <GoogleAuthButton
              text="Sign up with Google"
              onSuccessRedirect={() => navigate(redirectTo, { replace: true })}
            />

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#E8DFC8]/60 w-full" />
              <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-neutral-400 font-semibold absolute">
                or with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  placeholder="Eleanor Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30 ${
                    errors.name ? "border-red-400" : "border-[#E8DFC8]"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  placeholder="storyteller@starlingtales.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30 ${
                    errors.email ? "border-red-400" : "border-[#E8DFC8]"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30 ${
                    errors.phone ? "border-red-400" : "border-[#E8DFC8]"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30 ${
                    errors.password ? "border-red-400" : "border-[#E8DFC8]"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#E8DFC8]/50 text-center space-y-3">
            <p className="text-xs text-neutral-500">
              Already have a sanctuary account?{" "}
              <Link to="/login" className="font-semibold text-[#37463f] hover:underline">
                Sign in here
              </Link>
            </p>
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700">
              <ArrowLeft size={12} />
              <span>Return to Catalog</span>
            </Link>
          </div>
        </div>
      </main>

      <StarlingFooter />
    </div>
  );
}
