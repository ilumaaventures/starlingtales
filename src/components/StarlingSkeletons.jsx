import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8DFC8]/60 p-4 space-y-3.5 shadow-2xs animate-pulse">
      <div className="aspect-square w-full rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]/40" />
      <div className="space-y-2 pt-1">
        <div className="h-3 w-1/3 rounded-full bg-[#E8DFC8]/50" />
        <div className="h-4 w-3/4 rounded-full bg-[#E8DFC8]/70" />
        <div className="h-3 w-1/2 rounded-full bg-[#E8DFC8]/40" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-20 rounded-full bg-[#E8DFC8]/70" />
          <div className="h-8 w-24 rounded-full bg-[#37463f]/10" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function HamperCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-[#E8DFC8]/70 p-6 space-y-5 shadow-xs animate-pulse">
      <div className="aspect-[4/3] w-full rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]/50" />
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="h-3 w-28 rounded-full bg-[#E8DFC8]/60" />
          <div className="h-3 w-16 rounded-full bg-[#E8DFC8]/40" />
        </div>
        <div className="h-5 w-3/4 rounded-full bg-[#E8DFC8]/80" />
        <div className="h-3.5 w-full rounded-full bg-[#E8DFC8]/40" />
        <div className="space-y-1.5 pt-2">
          <div className="h-3 w-4/5 rounded-full bg-[#E8DFC8]/30" />
          <div className="h-3 w-3/5 rounded-full bg-[#E8DFC8]/30" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-[#E8DFC8]/40">
          <div className="h-6 w-24 rounded-full bg-[#E8DFC8]/70" />
          <div className="h-10 w-32 rounded-xl bg-[#37463f]/10" />
        </div>
      </div>
    </div>
  );
}

export function HamperGridSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <HamperCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function ReviewSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 sm:p-5 rounded-2xl border border-[#E8DFC8]/60 bg-white/60 space-y-3 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#E8DFC8]/60" />
              <div className="space-y-1">
                <div className="h-3.5 w-28 rounded-full bg-[#E8DFC8]/70" />
                <div className="h-2.5 w-16 rounded-full bg-[#E8DFC8]/40" />
              </div>
            </div>
            <div className="h-3 w-20 rounded-full bg-[#E8DFC8]/50" />
          </div>
          <div className="h-3.5 w-1/2 rounded-full bg-[#E8DFC8]/70" />
          <div className="space-y-1.5">
            <div className="h-3 w-full rounded-full bg-[#E8DFC8]/40" />
            <div className="h-3 w-4/5 rounded-full bg-[#E8DFC8]/40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="h-4 w-36 rounded-full bg-[#E8DFC8]/50" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square w-full rounded-3xl bg-[#FAF7F2] border border-[#E8DFC8]/60" />
        <div className="space-y-4 pt-2">
          <div className="h-3 w-24 rounded-full bg-[#E8DFC8]/60" />
          <div className="h-8 w-3/4 rounded-full bg-[#E8DFC8]/80" />
          <div className="h-4 w-1/3 rounded-full bg-[#E8DFC8]/50" />
          <div className="h-6 w-28 rounded-full bg-[#E8DFC8]/70" />
          <div className="h-16 w-full rounded-2xl bg-[#E8DFC8]/30 mt-4" />
          <div className="h-12 w-full rounded-xl bg-[#37463f]/10 mt-6" />
        </div>
      </div>
    </div>
  );
}
