import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Truck,
  Feather,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GoogleAuthButton from "../components/GoogleAuthButton";
import starlingLogo from "../assets/logo.jpeg";

export default function LoginPage() {
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const redirectTo = location.state?.from || "/";
  const intentMessage = location.state?.message;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.email || !formData.password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    try {
      await login(formData);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password. Please try again.",
      );
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#E8DFD2] selection:text-[#2C3E35]">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-[#E8DFC8]/80 shadow-2xl overflow-hidden">
        {/* Left Side: Brand Story & Patron Privileges */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#2C3E35] via-[#37463f] to-[#1F2C25] text-[#FAF6F0] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle floral/ambient background overlay */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-[#C5A880]/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-white/5 blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Brand Logo & Title */}
            <div className="space-y-4">
              <div className="w-20 h-20 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-[#C5A880]/40 flex items-center justify-center">
                <img
                  src={starlingLogo}
                  alt="Starling Tales"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-1">
                  The Nursery Sanctuary
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF6F0]">
                  Starling Tales
                </h2>
                <p className="text-xs text-[#FAF6F0]/80 font-light mt-1.5 leading-relaxed">
                  Lovingly handcrafted nursery keepsakes, gentle heirloom dolls,
                  and botanical hampers woven with wonder.
                </p>
              </div>
            </div>

            {/* Patron Privileges */}
            <div className="pt-4 border-t border-white/10 space-y-3.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C5A880] block">
                Sanctuary Member Privileges
              </span>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#C5A880] shrink-0 mt-0.5">
                  <Feather size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#FAF6F0]">
                    Archival Calligraphy Cards
                  </h4>
                  <p className="text-[11px] text-[#FAF6F0]/70">
                    Complimentary wax-sealed keepsake note with every gift
                    hamper.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#C5A880] shrink-0 mt-0.5">
                  <Truck size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#FAF6F0]">
                    Express Insured Delivery
                  </h4>
                  <p className="text-[11px] text-[#FAF6F0]/70">
                    Complimentary courier dispatch on all heirloom orders over
                    ₹5,000.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#C5A880] shrink-0 mt-0.5">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#FAF6F0]">
                    Protected Chronicle Archive
                  </h4>
                  <p className="text-[11px] text-[#FAF6F0]/70">
                    Your bespoke gift hampers and order history stored securely.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-[#FAF6F0]/60">
            <span>256-bit Encrypted Haven</span>
            <span className="font-serif italic text-[#C5A880]">
              Starling Tales
            </span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white space-y-6">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#37463f]/10 text-[#37463f] text-xs font-serif italic mb-2">
                <Sparkles size={12} className="text-[#C5A880]" />
                <span>Sanctuary Portal</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C3E35]">
                Welcome Back
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Please enter your credentials to access your keepsake basket and
                orders.
              </p>
            </div>

            {/* Context notice if redirected from Add to Cart or Checkout */}
            {intentMessage && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-center gap-2.5">
                <Sparkles size={15} className="text-amber-600 shrink-0" />
                <span>{intentMessage}</span>
              </div>
            )}

            {/* Error banner */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Google One-Click Login */}
            <div className="space-y-4">
              <GoogleAuthButton
                text="Continue with Google"
                onSuccessRedirect={() =>
                  navigate(redirectTo, { replace: true })
                }
              />

              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#E8DFC8]/80 w-full" />
                <span className="bg-white px-3 text-[10px] uppercase tracking-wider text-neutral-400 font-semibold absolute">
                  or with email chronicle
                </span>
              </div>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    type="email"
                    required
                    placeholder="patron@starlingtales.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30 focus:border-[#37463f] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                    Password
                  </label>
                  <a
                    href="mailto:support@starlingtales.com?subject=Starling%20Tales%20Password%20Assistance"
                    className="text-[11px] text-[#37463f] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-10 py-3 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30 focus:border-[#37463f] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#E8DFC8] text-[#37463f] focus:ring-[#37463f]"
                  />
                  <span>Remember my sanctuary access</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <span>Entering Sanctuary...</span>
                ) : (
                  <>
                    <span>Enter Sanctuary</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Switch to Register */}
          <div className="pt-4 border-t border-[#E8DFC8]/60 text-center space-y-2">
            <p className="text-xs text-neutral-500">
              New to Starling Tales?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#37463f] hover:underline"
              >
                Create your keepsake account
              </Link>
            </p>
            <div>
              <Link
                to="/products"
                className="text-xs text-[#C5A880] hover:text-[#2C3E35] inline-flex items-center gap-1 font-serif italic"
              >
                <span>Browse Nursery Collection</span> →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
