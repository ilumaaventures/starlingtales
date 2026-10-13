import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GoogleAuthButton from "../components/GoogleAuthButton";
import StarlingNavbar from "../components/StarlingNavbar";
import StarlingFooter from "../components/StarlingFooter";

export default function LoginPage() {
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const redirectTo = location.state?.from || "/";

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
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
              <span>Sanctuary Portal</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#2C3E35]">
              Welcome Back
            </h1>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              Sign in to manage your nursery keepsakes, orders, and curated hampers.
            </p>
          </div>

          {/* Google Sign-in */}
          <div className="space-y-4">
            <GoogleAuthButton
              text="Sign in with Google"
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
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  placeholder="storyteller@starlingtales.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                />
              </div>
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
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#E8DFC8]/50 text-center space-y-3">
            <p className="text-xs text-neutral-500">
              New to Starling Tales?{" "}
              <Link to="/register" className="font-semibold text-[#37463f] hover:underline">
                Create an account
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
