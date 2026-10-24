import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: "free-shipping",
    text: "FREE SHIPPING ON ALL HEIRLOOM KEEPSAKES OVER ₹5,000",
    linkText: "",
    linkUrl: "",
  },
];

export default function StarlingAnnouncementBar() {
  const { banners = [] } = useStore() || {};
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dynamic banners from backend or default heirloom announcements
  const dynamicAnnouncements = (Array.isArray(banners) ? banners : [])
    .filter((b) => b?.type === "announcement" || b?.type === "flashSale")
    .map((b) => ({
      id: b._id || b.id || b.title,
      text: (b.title || "").toUpperCase(),
      linkText: b.buttonText || "",
      linkUrl: b.targetUrl || "",
    }));

  const allAnnouncements =
    dynamicAnnouncements.length > 0
      ? dynamicAnnouncements
      : DEFAULT_ANNOUNCEMENTS;

  useEffect(() => {
    if (allAnnouncements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allAnnouncements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allAnnouncements.length]);

  const current = allAnnouncements[currentIndex] || DEFAULT_ANNOUNCEMENTS[0];

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="bg-[#2C3E35] text-[#FAF7F2] py-2 sm:py-2.5 px-4 text-center text-[10.5px] sm:text-[11px] tracking-[0.22em] uppercase font-medium select-none border-t border-[#36493F]/60 transition-all duration-300 w-full"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        {current.linkUrl ? (
          <Link
            to={current.linkUrl}
            className="hover:text-[#D5BC98] transition-colors inline-block"
          >
            {current.text}
          </Link>
        ) : (
          <span className="inline-block transition-opacity duration-500">
            {current.text}
          </span>
        )}
      </div>
    </div>
  );
}
