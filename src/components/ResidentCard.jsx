import React from "react";
import Icon from "./Icon";

export default function ResidentCard({ resident, onOpenStory }) {
  return (
    <article
      id="resident-card"
      className="group relative overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(44,62,53,0.07)] cursor-pointer transition-all duration-220 hover:-translate-y-1.25 hover:shadow-[0_8px_28px_rgba(44,62,53,0.13)]"
      onClick={() => onOpenStory(resident)}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={resident.image}
          alt={resident.name}
          className="w-full h-full object-cover transition-transform duration-350 group-hover:scale-104"
          loading="lazy"
        />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end p-5 bg-gradient-to-t from-text-dark/40 to-transparent opacity-0 transition-opacity duration-220 group-hover:opacity-100">
          <button
            className="min-h-10 px-5 rounded-full border-none bg-white text-text-dark text-xs font-semibold tracking-wider uppercase shadow-md transition-all duration-150 hover:bg-blue-light hover:scale-105"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenStory(resident);
            }}
          >
            Meet {resident.name.split(" ")[0]}
          </button>
        </div>
      </div>

      <div className="p-5 text-center flex flex-col justify-between min-h-[170px]">
        <div>
          <h3 className="mb-2 text-text-dark font-display text-xl font-semibold leading-tight">
            {resident.name}
          </h3>
          <p className="text-text-muted text-xs font-light leading-relaxed italic">
            "{resident.tagline}"
          </p>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="inline-flex min-h-[38px] items-center gap-1.5 border border-dashed border-blue-soft/50 rounded-full px-5 py-1.5 text-[11px] font-medium tracking-wide uppercase text-blue-soft bg-blue-light/20 transition-colors duration-200 hover:bg-blue-soft hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onOpenStory(resident);
            }}
          >
            <Icon name="heart" className="h-4 w-4 shrink-0" />
            Read My Story
          </button>
        </div>
      </div>
    </article>
  );
}
