import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  KeyRound,
  Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GoogleAuthButton from "./GoogleAuthButton";
import starlingLogo from "../assets/logo.jpeg";
import {
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
} from "../services/authApi";
import toast from "react-hot-toast";

export default function AuthModal() {
  const {
    authModalOpen,
    authModalMode,
    setAuthModalMode,
    initialForgotEmail,
    closeAuthModal,
    login,
    register,
    loading: authLoading,
  } = useAuth();

  // Auth Form State (Login & Register)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password Flow State (within modal)
  const [forgotStep, setForgotStep] = useState(1); // 1 = Email, 2 = OTP, 3 = Password, 4 = Success
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [forgotError, setForgotError] = useState("");

  const otpInputRefs = useRef([]);

  // Sync initial forgot email when opening in forgot mode
  useEffect(() => {
    if (authModalMode === "forgot") {
      setForgotEmail(initialForgotEmail || formData.email || "");
      setForgotStep(1);
      setForgotError("");
      setOtpDigits(["", "", "", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [authModalMode, initialForgotEmail, formData.email]);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Auto-focus first OTP input on step 2
  useEffect(() => {
    if (authModalMode === "forgot" && forgotStep === 2) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [authModalMode, forgotStep]);

  if (!authModalOpen) return null;

  const isRegister = authModalMode === "register";
  const isForgot = authModalMode === "forgot";
  const isLogin = authModalMode === "login";

  // Login / Register field change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Login / Register Submit
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else if (isRegister) {
        await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
      }
    } catch (_) {
      // Handled in AuthContext
    }
  };

  // ================= FORGOT PASSWORD ACTIONS =================

  // Password strength check
  const hasMinLen = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const strengthScore = [hasMinLen, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-neutral-300",
    "bg-rose-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-emerald-600",
  ];

  // OTP Change
  const handleOtpChange = (index, value) => {
    setForgotError("");
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length > 1) {
      const pasteDigits = cleaned.slice(0, 6).split("");
      const nextOtp = [...otpDigits];
      pasteDigits.forEach((digit, i) => {
        if (index + i < 6) {
          nextOtp[index + i] = digit;
        }
      });
      setOtpDigits(nextOtp);
      const nextFocus = Math.min(index + pasteDigits.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    const nextOtp = [...otpDigits];
    nextOtp[index] = cleaned;
    setOtpDigits(nextOtp);

    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Step 1: Send OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setForgotError("");

    const clean = forgotEmail.trim().toLowerCase();
    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setForgotError("Please enter a valid email address format.");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await forgotPasswordApi(clean);
      toast.success(res?.message || "Verification code dispatched to your email! ✨");
      setForgotStep(2);
      setResendCooldown(60);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Could not send code. Please check your email address.";
      setForgotError(msg);
      toast.error(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setForgotError("");
    try {
      const clean = forgotEmail.trim().toLowerCase();
      const res = await forgotPasswordApi(clean);
      toast.success(res?.message || "A fresh code was sent to your email.");
      setResendCooldown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend code.");
    } finally {
      setResendLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setForgotError("");
    const otpCode = otpDigits.join("").trim();

    if (otpCode.length !== 6) {
      setForgotError("Please enter all 6 digits of the verification code.");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await verifyOtpApi({
        email: forgotEmail.trim().toLowerCase(),
        otp: otpCode,
      });

      if (res?.resetToken) {
        setResetToken(res.resetToken);
      }
      toast.success(res?.message || "Code confirmed! Create your new password.");
      setForgotStep(3);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid or expired verification code.";
      setForgotError(msg);
      toast.error(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError("");

    if (!newPassword || newPassword.length < 8) {
      setForgotError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match. Please re-enter.");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await resetPasswordApi({
        resetToken,
        email: forgotEmail.trim().toLowerCase(),
        newPassword,
      });

      toast.success(res?.message || "Password successfully restored! 🌿");
      setForgotStep(4);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update password. Session may have expired.";
      setForgotError(msg);
      toast.error(msg);
    } finally {
      setForgotLoading(false);
    }
  };

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
        {/* ================= MODAL HEADER ================= */}
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
                {isForgot
                  ? "Recover Sanctuary Key"
                  : isRegister
                  ? "Create Sanctuary"
                  : "Welcome to the Haven"}
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

        {/* ================= TABS / SUBHEADER ================= */}
        {!isForgot ? (
          /* Normal Sign In / Register Tabs */
          <div className="flex border-b border-[#E8DFC8]/60 bg-white/60 shrink-0">
            <button
              type="button"
              className={`flex-1 py-2.5 text-xs font-serif uppercase tracking-widest transition-all cursor-pointer ${
                isLogin
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
        ) : (
          /* Forgot Password Subheader & Stepper */
          <div className="px-5 py-2.5 bg-white/70 border-b border-[#E8DFC8]/60 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setAuthModalMode("login")}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-[#37463f] font-medium transition cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Back to Sign In</span>
            </button>

            <span className="text-[10px] uppercase tracking-wider font-serif font-bold text-[#C5A880] bg-[#37463f]/5 px-2.5 py-0.5 rounded-full border border-[#C5A880]/30">
              {forgotStep < 4 ? `Step ${forgotStep} of 3` : "Restored"}
            </span>
          </div>
        )}

        {/* ================= MODAL BODY ================= */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* ================= FORGOT PASSWORD VIEW ================= */}
          {isForgot ? (
            <div className="space-y-4">
              {forgotError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              {/* STEP 1: Enter Email */}
              {forgotStep === 1 && (
                <form onSubmit={handleRequestOtp} className="space-y-3.5 animate-fade-in">
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-bold text-[#2C3E35]">
                      Reset Your Password
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Enter the email registered with your Starling Tales account to
                      receive a 6-digit security code.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Registered Email Address *
                    </label>
                    <div className="relative">
                      <Mail
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                      />
                      <input
                        type="email"
                        required
                        placeholder="patron@starlingtales.com"
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(e.target.value);
                          if (forgotError) setForgotError("");
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] focus:border-[#37463f]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full mt-2 py-2.5 px-4 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                  >
                    {forgotLoading ? (
                      <>
                        <RotateCw size={13} className="animate-spin" />
                        <span>Dispatching Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Security Code</span>
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: Verify 6-digit OTP */}
              {forgotStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-3.5 animate-fade-in">
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-bold text-[#2C3E35]">
                      Enter Verification Code
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      We sent a 6-digit code to{" "}
                      <span className="font-semibold text-neutral-800">{forgotEmail}</span>.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep(1);
                        setForgotError("");
                      }}
                      className="text-[11px] text-[#37463f] hover:underline font-medium cursor-pointer"
                    >
                      Change email
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600 mb-2">
                      6-Digit Security Code *
                    </label>
                    <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className={`w-10 sm:w-11 h-12 text-center text-base font-serif font-bold bg-white border ${
                            digit ? "border-[#37463f] bg-[#FAF7F2]" : "border-[#E8DFC8]"
                          } rounded-xl text-neutral-800 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] focus:border-[#37463f] transition-all`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-0.5">
                    <span className="text-[11px]">Didn't receive code?</span>
                    {resendCooldown > 0 ? (
                      <span className="text-[11px] text-neutral-400 font-mono">
                        Resend in {resendCooldown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendLoading}
                        className="text-[11px] text-[#37463f] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        {resendLoading ? (
                          <>
                            <RotateCw size={11} className="animate-spin" />
                            <span>Resending...</span>
                          </>
                        ) : (
                          <span>Resend Code</span>
                        )}
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading || otpDigits.join("").length !== 6}
                    className="w-full mt-2 py-2.5 px-4 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                  >
                    {forgotLoading ? (
                      <>
                        <RotateCw size={13} className="animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={13} />
                        <span>Verify & Continue</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 3: Create New Password */}
              {forgotStep === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-3.5 animate-fade-in">
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-bold text-[#2C3E35]">
                      Create New Password
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Choose a secure new passphrase for your sanctuary account.
                    </p>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      New Password *
                    </label>
                    <div className="relative">
                      <Lock
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                      />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (forgotError) setForgotError("");
                        }}
                        className="w-full pl-10 pr-9 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] focus:border-[#37463f]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showNewPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {newPassword && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-neutral-500">Security:</span>
                          <span className="font-semibold text-neutral-700">
                            {strengthLabels[strengthScore]}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 h-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`rounded-full transition-all duration-300 ${
                                strengthScore >= level
                                  ? strengthColors[strengthScore]
                                  : "bg-neutral-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <Lock
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (forgotError) setForgotError("");
                        }}
                        className={`w-full pl-10 pr-9 py-2 bg-white border ${
                          confirmPassword && confirmPassword === newPassword
                            ? "border-emerald-500 bg-emerald-50/20"
                            : "border-[#E8DFC8]"
                        } rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] focus:border-[#37463f]`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>

                    {confirmPassword && confirmPassword === newPassword && (
                      <p className="flex items-center gap-1 text-[10px] text-emerald-700 mt-1 font-medium">
                        <Check size={11} />
                        <span>Passwords match.</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading || !newPassword || newPassword !== confirmPassword}
                    className="w-full mt-2 py-2.5 px-4 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                  >
                    {forgotLoading ? (
                      <>
                        <RotateCw size={13} className="animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound size={13} />
                        <span>Save & Reset Password</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 4: Success State */}
              {forgotStep === 4 && (
                <div className="space-y-4 text-center py-3 animate-fade-in">
                  <div className="w-13 h-13 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-xs">
                    <CheckCircle2 size={26} />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-neutral-800">
                      Sanctuary Restored!
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed max-w-xs mx-auto">
                      Your password has been successfully updated. You may now sign in
                      to access your orders and heirloom hampers.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          email: forgotEmail,
                          password: "",
                        }));
                        setAuthModalMode("login");
                      }}
                      className="w-full py-2.5 px-4 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                    >
                      <span>Proceed to Sign In</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ================= LOGIN & REGISTER FORMS ================= */
            <>
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
              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {isRegister ? (
                  /* Register Mode - 2 Column Grid */
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

                    {/* Password */}
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
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-neutral-600">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setAuthModalMode("forgot")}
                          className="text-[10px] text-[#37463f] hover:underline cursor-pointer font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>
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
                  disabled={authLoading}
                  className="w-full mt-3 py-2.5 px-4 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {authLoading ? (
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
            </>
          )}

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
