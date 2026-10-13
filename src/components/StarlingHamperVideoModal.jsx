import React, { useEffect, useRef, useState, useCallback } from "react";
import { X } from "lucide-react";
import hamperVideo from "../assets/gift_hamper_assembly.mp4";

/**
 * StarlingHamperVideoModal
 *
 * Clean, minimalist, mobile-friendly pop-up modal for Starling Tales.
 * - Triggers automatically after the visitor scrolls 1 or 2 times on first visit.
 * - Stores state in sessionStorage so it only pops up once per browser session.
 * - Plays the gift hamper assembly video continuously in loop.
 * - Contains NO text, NO extra buttons, NO clutter — strictly the continuous video + ONE "X" close icon.
 */
export default function StarlingHamperVideoModal({ forceOpen = false, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef(null);

  // 1. SCROLL TRIGGER DETECTION (fires after 1 or 2 scrolls if not seen in session)
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    let hasSeen = false;
    try {
      hasSeen = sessionStorage.getItem("starling_hamper_video_seen") === "true";
    } catch (e) {
      console.warn("sessionStorage read error:", e);
    }

    if (hasSeen) return;

    let scrollCount = 0;
    let triggered = false;

    const handleScrollActivity = () => {
      if (triggered) return;

      const currentScrollY =
        window.scrollY || document.documentElement.scrollTop || 0;
      scrollCount += 1;

      // Trigger if user scrolled past 80px OR after 2 scroll/wheel movements
      if (currentScrollY > 80 || scrollCount >= 2) {
        triggered = true;
        try {
          sessionStorage.setItem("starling_hamper_video_seen", "true");
        } catch (e) {
          console.warn("sessionStorage write error:", e);
        }

        setTimeout(() => {
          setIsOpen(true);
        }, 350);

        cleanupListeners();
      }
    };

    const cleanupListeners = () => {
      window.removeEventListener("scroll", handleScrollActivity);
      window.removeEventListener("wheel", handleScrollActivity);
      window.removeEventListener("touchmove", handleScrollActivity);
    };

    window.addEventListener("scroll", handleScrollActivity, { passive: true });
    window.addEventListener("wheel", handleScrollActivity, { passive: true });
    window.addEventListener("touchmove", handleScrollActivity, { passive: true });

    return () => {
      cleanupListeners();
    };
  }, [forceOpen]);

  // 2. BODY SCROLL LOCK & ESCAPE KEY CLOSE
  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    try {
      sessionStorage.setItem("starling_hamper_video_seen", "true");
    } catch {}
    if (onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          handleClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, handleClose]);

  // 3. CONTINUOUS AUTOPLAY
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay notice:", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/20 backdrop-blur-[2px] transition-all duration-300 animate-in fade-in"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Video Container (Strictly only the video + single X close icon) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[94vw] sm:max-w-2xl md:max-w-3xl aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-black/20 sm:border-white/20"
      >
        {/* ONE "X" Icon to Close */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close video"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-200 shadow-xl hover:scale-105 active:scale-95"
        >
          <X size={20} strokeWidth={2.2} />
        </button>

        {/* Video: Plays continuously (loop) */}
        <video
          ref={videoRef}
          src={hamperVideo}
          playsInline
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
