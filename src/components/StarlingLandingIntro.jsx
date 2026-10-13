import React, { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, Heart, Feather, Gift, ShieldCheck } from "lucide-react";
import introVideo from "../assets/Create_animated_landing-page_video_202609051224.mp4";
import hamper1 from "../assets/hamper-1 (1).jpeg";
import hamper2 from "../assets/hamper-1 (2).jpeg";
import hamper3 from "../assets/hamper-1 (3).jpeg";

/**
 * StarlingLandingIntro
 *
 * Cinematic animated intro screen for Starling Tales.
 * - Desktop: Full-bleed widescreen presentation with framing adjusted to crop out
 *   the top header logo and name while keeping the storybook scene perfectly centered.
 * - Mobile: Structured, rich storybook layout featuring:
 *   1. Storybook prologue header
 *   2. Living animated video window with fluttering bird
 *   3. Genuine photographic previews of the 3 signature Gift Hampers
 *   4. Trust pillars & heirloom promises
 *   5. Luxury interactive entry CTA
 * - Seamless cinematic scale + fade transition revealing the existing Starling Tales homepage.
 */
export default function StarlingLandingIntro({ onEnter }) {
  const desktopVideoRef = useRef(null);
  const mobileVideoRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check user motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Ensure body scroll is locked while intro is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle autoplay resilience on both video refs
  useEffect(() => {
    const playVideo = (ref) => {
      if (ref?.current) {
        ref.current.play().catch((err) => {
          console.warn(
            "[StarlingTales] Video autoplay note:",
            err?.message || err,
          );
        });
      }
    };
    playVideo(desktopVideoRef);
    playVideo(mobileVideoRef);
  }, []);

  // Trigger cinematic transition
  const handleEnter = useCallback(() => {
    if (hasInteracted || isExiting) return;
    setHasInteracted(true);
    setIsExiting(true);

    const transitionDuration = prefersReducedMotion ? 400 : 800;
    const timer = setTimeout(() => {
      if (onEnter) onEnter();
    }, transitionDuration);

    return () => clearTimeout(timer);
  }, [hasInteracted, isExiting, prefersReducedMotion, onEnter]);

  // Real gift hamper previews using project assets
  const hamperPreviews = [
    {
      id: "hamper-1",
      title: "Newborn Set",
      subtitle: "Plush & Blanket",
      image: hamper1,
      badge: "Bestseller",
    },
    {
      id: "hamper-2",
      title: "Storybook Basket",
      subtitle: "Woven Rope Keepsake",
      image: hamper2,
      badge: "Signature",
      featured: true,
    },
    {
      id: "hamper-3",
      title: "Dreamer Hamper",
      subtitle: "Hand-Stitched Set",
      image: hamper3,
      badge: "Curated",
    },
  ];

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#F7F2EA] flex flex-col justify-center overflow-hidden select-none transition-all ${
        prefersReducedMotion
          ? "duration-400 ease-out"
          : "duration-800 cubic-bezier(0.22, 1, 0.36, 1)"
      } ${
        isExiting
          ? "opacity-0 scale-105 pointer-events-none"
          : "opacity-100 scale-100"
      }`}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: prefersReducedMotion ? "400ms" : "800ms",
      }}
      role="region"
      aria-label="Starling Tales Cinematic Intro"
    >
      {/* =========================================================================
          DESKTOP & TABLET WIDESCREEN PRESENTATION (md and up)
          Framing adjusted to crop out the top header logo and name while keeping
          the whimsical storybook title, flying bird, and characters beautifully centered.
          CLICK ANYWHERE ON LARGE SCREEN TO ENTER!
         ========================================================================= */}
      <div
        onClick={handleEnter}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleEnter();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Click anywhere to enter Starling Tales"
        className="hidden md:block relative w-full h-full overflow-hidden bg-[#F7F2EA] cursor-pointer group focus:outline-none"
      >
        <video
          ref={desktopVideoRef}
          src={introVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover select-none pointer-events-none"
          style={{
            objectPosition: "center 15%",
            transform: "scale(1.08) translateY(-2.5%)",
            transformOrigin: "center center",
          }}
          aria-hidden="true"
        />
      </div>

      {/* =========================================================================
          MOBILE & SMALL SCREEN PRESENTATION (under md)
          Rich, interactive, and structured: filled with:
          1. Prologue header
          2. Living animated video window with fluttering bird
          3. Genuine photographic previews of the 3 signature Gift Hampers
          4. Heirloom trust pillars
          5. Luxury interactive entry CTA
         ========================================================================= */}
      <div className="md:hidden relative w-full h-full overflow-y-auto bg-[#F7F2EA] flex flex-col items-center justify-between py-3 px-4 sm:px-6">
        {/* Ambient Video Backdrop over solid base */}
        <video
          src={introVideo}
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover blur-3xl opacity-20 scale-110 pointer-events-none"
          aria-hidden="true"
        />
        {/* Solid Parchment Tint Layer */}
        <div className="fixed inset-0 bg-[#F7F2EA]/85 pointer-events-none" />

        {/* ---------------- 1. Top Storybook Prologue ---------------- */}
        <div className="relative z-10 w-full max-w-[500px] text-center pt-0.5">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2F433C] tracking-tight leading-tight">
            Starling Tales
          </h1>
          <p className="text-[#6B665F] text-[11px] font-light leading-relaxed max-w-[340px] mx-auto">
            A whimsical world of soft plush friends & curated heirloom hampers.
          </p>
        </div>

        {/* ---------------- 2. Center Animated Storybook Window ---------------- */}
        <div className="relative z-10 w-full max-w-[500px] aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C5A880]/40 bg-[#F7F2EA] my-2.5">
          <video
            ref={mobileVideoRef}
            src={introVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover select-none pointer-events-none"
            style={{
              objectPosition: "center 15%",
              transform: "scale(1.08) translateY(-2.5%)",
              transformOrigin: "center center",
            }}
            aria-hidden="true"
          />

          {/* Bird Hotspot on Mobile */}
          <button
            type="button"
            onClick={handleEnter}
            aria-label="Enter Starling Tales - Tap the fluttering starling"
            className="absolute pointer-events-auto group focus:outline-none rounded-full cursor-pointer active:scale-95 transition-transform"
            style={{
              left: "48%",
              top: "43%",
              transform: "translate(-50%, -50%)",
              width: "28%",
              height: "38%",
              minWidth: "90px",
              minHeight: "90px",
            }}
          >
            {/* Pulsing Golden Aura */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-300 ${
                isExiting ? "scale-150 opacity-0 bg-[#E2B774]/40" : "opacity-85"
              }`}
              style={{
                border: "2px solid rgba(226, 183, 116, 0.8)",
                boxShadow: "0 0 24px rgba(226, 183, 116, 0.6)",
                animation: prefersReducedMotion
                  ? "none"
                  : "starlingPulse 2.4s ease-in-out infinite",
              }}
            />
          </button>
        </div>

        {/* ---------------- 3. Real Hamper Photographic Previews ---------------- */}
        <div className="relative z-10 w-full max-w-[500px] my-1">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-serif font-bold text-[#2F433C] flex items-center gap-1.5">
              <Gift size={11} className="text-[#C5A880]" /> Curated Keepsake
              Hampers
            </span>
            <span className="text-[9px] text-[#C5A880] tracking-widest uppercase font-semibold">
              Hand-Packed
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {hamperPreviews.map((item) => (
              <div
                key={item.id}
                onClick={handleEnter}
                className="group relative bg-[#FAF6F0] rounded-xl overflow-hidden border border-[#C5A880]/30 shadow-md hover:border-[#C5A880] active:scale-95 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Real Hamper Image */}
                <div className="relative h-18 sm:h-22 w-full overflow-hidden bg-[#EFE9DF]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-sm bg-[#FAF6F0]/90 backdrop-blur-xs text-[7.5px] uppercase tracking-wider font-serif font-semibold text-[#2F433C]">
                    {item.badge}
                  </span>
                </div>

                {/* Card Info */}
                <div className="p-1.5 text-center bg-[#FAF6F0]/90 flex-1 flex flex-col justify-center">
                  <div className="font-serif text-[10.5px] font-bold text-[#2F433C] truncate leading-tight">
                    {item.title}
                  </div>
                  <div className="text-[8.5px] text-[#6B665F] font-light truncate mt-0.5">
                    {item.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- 4. Storybook Trust Pillars ---------------- */}
        <div className="relative z-10 w-full max-w-[500px] flex items-center justify-around py-1.5 px-2 border-y border-[#C5A880]/25 bg-[#FAF6F0]/60 backdrop-blur-xs rounded-lg my-1">
          <div className="flex items-center gap-1 text-[10px] text-[#2F433C] font-medium font-serif">
            <Heart size={11} className="text-[#C5A880]" /> 100% Cotton
          </div>
          <span className="text-[#C5A880]/40">·</span>
          <div className="flex items-center gap-1 text-[10px] text-[#2F433C] font-medium font-serif">
            <ShieldCheck size={11} className="text-[#8DAEC4]" /> Safe for Ages
            0+
          </div>
          <span className="text-[#C5A880]/40">·</span>
          <div className="flex items-center gap-1 text-[10px] text-[#2F433C] font-medium font-serif">
            <Sparkles size={11} className="text-[#C5A880]" /> Heirloom Quality
          </div>
        </div>

        {/* ---------------- 5. Luxury Entry CTA Button ---------------- */}
        <div className="relative z-10 w-full max-w-[500px] text-center pt-1.5 pb-1">
          <button
            type="button"
            onClick={handleEnter}
            className="w-full py-3 px-6 rounded-full text-xs font-serif tracking-[0.2em] uppercase font-bold text-[#FAF6EE] bg-[#2F433C] hover:bg-[#23332D] shadow-xl border border-[#C5A880]/50 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-[#E2B774] animate-ping" />
            <span>Tap Starling to Enter</span>
            <span className="text-sm transition-transform group-hover:scale-125 text-[#E2B774]">
              ♡
            </span>
          </button>

          <p className="text-[9px] text-[#6B665F]/80 tracking-wider mt-1.5 font-serif">
            Free shipping on heirloom keepsakes over ₹5,000
          </p>
        </div>
      </div>

      {/* Embedded Animation Styles */}
      <style>{`
        @keyframes starlingPulse {
          0%, 100% {
            transform: scale(0.98);
            opacity: 0.45;
            box-shadow: 0 0 16px rgba(226, 183, 116, 0.25);
          }
          50% {
            transform: scale(1.06);
            opacity: 0.85;
            box-shadow: 0 0 32px rgba(226, 183, 116, 0.45);
          }
        }
      `}</style>
    </div>
  );
}
