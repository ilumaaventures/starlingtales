import React, { useEffect, useMemo, useState } from "react";
import "../styles/StarlingTales.css";
import { readStorage } from "../constants/constants";
import CartDrawer from "../components/CartDrawer";
import StarlingTalesHero from "./StarlingTalesHero";
import BrandPillars from "./BrandPillars";
import Residents from "./Residents";
import PoeticBanner from "./PoeticBanner";
import ThanksYou from "./ThanksYou";
import GiftHamper from "./GiftHamper";
import StarlingCollection from "./StarlingCollection";
import StarlingAbout from "./StarlingAbout";
import StarlingLandingIntro from "../components/StarlingLandingIntro";
import StarlingHamperVideoModal from "../components/StarlingHamperVideoModal";

export default function StarlingTalesHome() {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !sessionStorage.getItem("starling_intro_seen");
    } catch {
      return true;
    }
  });

  const handleEnterIntro = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem("starling_intro_seen", "true");
    } catch (err) {
      console.warn("Could not save intro state in sessionStorage", err);
    }
  };

  // Cart, wishlist and dialog states
  const [cart, setCart] = useState(() => readStorage("starling_cart", []));
  const [wishlist, setWishlist] = useState(() =>
    readStorage("starling_wishlist", []),
  );

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("starling_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("starling_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <>
      {/* 1. Cinematic Animated Landing Intro (Create_animated_landing-page_video_202609051224.mp4) */}
      {showIntro && <StarlingLandingIntro onEnter={handleEnterIntro} />}

      {/* 2. Assembling Gift Hamper Pop-up (Assembling_personalized_gift_ham...mp4 - triggers on 1-2 scrolls) */}
      {!showIntro && <StarlingHamperVideoModal />}

      <div className="min-h-screen bg-cream text-text-dark font-sans selection:bg-blue-light selection:text-blue-soft relative overflow-x-hidden">
        <StarlingTalesHero />
        <Residents />
        <StarlingAbout />
        <StarlingCollection />
        <PoeticBanner />
        <GiftHamper />
        <BrandPillars />

        <ThanksYou />
      </div>
    </>
  );
}
