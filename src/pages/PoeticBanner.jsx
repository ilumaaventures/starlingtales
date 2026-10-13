import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import "../styles/StarlingTales.css";
import Icon from "../components/Icon";
import Botanical from "../components/Botanical";
import HeartDivider from "../components/HeartDivider";

const POETIC_VERSES = [
  {
    quote:
      "A little bundle of love, ready to accompany them on every tiny adventure.",
    attribution: "Crafted for Childhood Memories",
    icon: "heart",
  },
  {
    quote:
      "Stitched with gentle hands and whispers of bedtime lullabies that linger forever.",
    attribution: "The Starling Tales Philosophy",
    icon: "leaf",
  },
  {
    quote:
      "May every stitch hold a secret giggle, a soft dream, and a warm afternoon cuddle.",
    attribution: "Words for Little Dreamers",
    icon: "star",
  },
  {
    quote:
      "Heirloom keepsakes created to be cherished today, and remembered always.",
    attribution: "Chronicle of Resident Makers",
    icon: "bird",
  },
];

function PoeticBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const changeVerse = (newIndex) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsFading(false);
    }, 280);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % POETIC_VERSES.length;
    changeVerse(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx =
      (currentIndex - 1 + POETIC_VERSES.length) % POETIC_VERSES.length;
    changeVerse(prevIdx);
  };

  // Auto rotate quotes every 4.8 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4800);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const activeVerse = POETIC_VERSES[currentIndex];

  return (
    <section
      className="relative overflow-hidden py-10 md:py-14 bg-gradient-to-b from-[#FAF7F2] via-[#F4F8FA] to-[#FAF7F2] border-y border-[#E8DFC8]/40 px-6 text-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative Botanical Accents */}
      <div className="absolute top-1/2 -left-12 -translate-y-1/2 w-24 h-24 opacity-15 pointer-events-none text-blue-soft hidden md:block">
        <Botanical className="w-full h-full" />
      </div>
      <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-24 h-24 opacity-15 pointer-events-none text-gold rotate-180 hidden md:block">
        <Botanical className="w-full h-full" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Top Icon Motif */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px w-10 bg-[#E8DFC8]" />
          <div className="w-9 h-9 rounded-full bg-white border border-[#E8DFC8] flex items-center justify-center text-blue-soft shadow-xs transition-transform duration-300 hover:scale-110">
            <Icon name={activeVerse.icon} className="h-4 w-4 text-blue-soft" />
          </div>
          <div className="h-px w-10 bg-[#E8DFC8]" />
        </div>

        {/* Dynamic Rotating Quote */}
        <div
          className={`transition-all duration-300 transform min-h-[140px] sm:min-h-[120px] flex flex-col justify-center ${isFading
            ? "opacity-0 translate-y-2 scale-98"
            : "opacity-100 translate-y-0 scale-100"
            }`}
        >
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-text-dark italic leading-relaxed md:leading-snug">
            "{activeVerse.quote}"
          </h3>

          <p className="mt-4 text-[11px] font-semibold tracking-[0.24em] text-blue-soft uppercase flex items-center justify-center gap-1.5">
            <Sparkles size={12} className="text-gold" />
            <span>{activeVerse.attribution}</span>
          </p>
        </div>

        {/* Interactive Carousel Controls */}
        <div className="mt-8 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-white/80 border border-[#E8DFC8] flex items-center justify-center text-text-dark hover:bg-white hover:text-blue-soft hover:scale-105 transition-all shadow-xs cursor-pointer"
            aria-label="Previous poetic verse"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {POETIC_VERSES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => changeVerse(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx
                  ? "w-7 bg-text-dark"
                  : "w-2 bg-[#D2DCE0] hover:bg-blue-soft"
                  }`}
                aria-label={`Jump to verse ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-white/80 border border-[#E8DFC8] flex items-center justify-center text-text-dark hover:bg-white hover:text-blue-soft hover:scale-105 transition-all shadow-xs cursor-pointer"
            aria-label="Next poetic verse"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default PoeticBanner;
