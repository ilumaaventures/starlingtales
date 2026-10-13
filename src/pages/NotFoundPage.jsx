import React from "react";
import { Link } from "react-router-dom";
import { Feather, ArrowLeft } from "lucide-react";
import HeartDivider from "../components/HeartDivider";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] bg-cream text-text-dark flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-blue-light text-blue-soft flex items-center justify-center mx-auto shadow-xs">
        <Feather size={28} />
      </div>
      <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-blue-soft">
        Lost in Wonder
      </span>
      <h1 className="font-display text-4xl font-semibold text-text-dark">
        Story Chapter Not Found
      </h1>
      <HeartDivider />
      <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed font-light">
        The nursery page you are looking for may have nestled elsewhere or returned to our resident storybook.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-text-dark text-cream hover:bg-text-dark/90 text-xs tracking-widest uppercase font-semibold transition shadow-sm"
        >
          <ArrowLeft size={13} /> Return to Home
        </Link>
      </div>
    </div>
  );
}
