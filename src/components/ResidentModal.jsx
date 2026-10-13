import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";
import HeartDivider from "./HeartDivider";

export default function ResidentModal({ resident, onClose, onAdopt }) {
  const drawerRef = useRef(null);
  const [mainImage, setMainImage] = useState(resident?.image || "");

  useEffect(() => {
    if (!resident) return;
    setMainImage(resident.image);
  }, [resident]);

  useEffect(() => {
    if (!resident) return undefined;
    const drawer = drawerRef.current;
    const focusable = drawer?.querySelectorAll(
      'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    function trapFocus(event) {
      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    drawer?.addEventListener("keydown", trapFocus);
    return () => drawer?.removeEventListener("keydown", trapFocus);
  }, [resident]);

  if (!resident) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[1000] flex items-stretch justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-resident-name"
    >
      <button
        className="absolute inset-0 bg-text-dark/45 backdrop-blur-[2px] animate-fade-in"
        type="button"
        onClick={onClose}
        aria-label="Close resident story"
      />

      <div
        className="relative flex h-full w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl flex-col overflow-y-auto bg-cream animate-slide-in-right"
        ref={drawerRef}
      >
        <button
          className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center border border-cream-dark rounded-full bg-white text-text-dark transition-colors duration-150 hover:bg-cream-dark"
          type="button"
          onClick={onClose}
          aria-label="Close resident story"
        >
          <Icon name="x" className="h-5 w-5" />
        </button>

        <div className="grid min-h-full grid-cols-1 md:grid-cols-2">
          {/* Left panel - Character Image */}
          <div className="relative p-10 px-7.5 bg-white flex flex-col justify-center border-b border-cream-dark md:border-b-0 md:border-r">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg mb-3 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
              <img
                src={mainImage}
                alt={resident.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>

          {/* Right panel - Character Bio & Quirks */}
          <div className="overflow-y-auto p-10 pr-9 pl-7.5 flex flex-col justify-between py-20">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-soft text-xs font-medium tracking-widest uppercase">
                  Resident Companion
                </span>
                <span className="static rounded-full px-2.5 py-0.5 text-[9px] font-medium tracking-widest leading-tight uppercase pointer-events-none text-white bg-gold">
                  Storyteller Edition
                </span>
              </div>

              <h2
                id="modal-resident-name"
                className="mb-2.5 text-text-dark font-display text-3xl font-semibold leading-tight"
              >
                {resident.name}
              </h2>

              <HeartDivider centered={false} />

              <p className="mt-4 mb-5 text-brown-warm font-serif-poetic text-lg italic leading-relaxed">
                "{resident.tagline}"
              </p>

              <div className="border-t border-cream-dark pt-4 mb-6">
                <h4 className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-dark mb-2.5">
                  My Story
                </h4>
                <p className="text-text-body text-[13.5px] font-light leading-relaxed">
                  {resident.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-auto border-t border-cream-dark/60">
              <button
                className="w-full flex min-h-[48px] items-center justify-center gap-2 border-none rounded-md px-5 py-3.5 bg-text-dark text-cream text-xs font-medium tracking-widest uppercase transition-colors duration-200 hover:bg-blue-soft"
                type="button"
                onClick={() => onAdopt(resident.productId)}
              >
                <Icon name="heart" className="h-4 w-4" />
                Adopt {resident.name.split(" ")[0]} & Bring Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
