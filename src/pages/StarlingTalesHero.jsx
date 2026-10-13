import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Botanical from "../components/Botanical";
import HeartDivider from "../components/HeartDivider";
import { useStore } from "../context/StoreContext";
import baseApi from "../services/baseApi";

function StarlingTalesHero() {
  const {
    business,
    storeHomePath: contextHomePath,
    heroBanners,
    banners,
    slides: ctxSlides,
  } = useStore();
  const [slides, setSlides] = useState([]);

  const storeHomePath =
    contextHomePath ||
    (business?.subdomain
      ? `/${encodeURIComponent(business.subdomain)}`
      : business?.slug
        ? `/${encodeURIComponent(business.slug)}`
        : business?.businessName
          ? `/${encodeURIComponent(business.businessName)}`
          : "");

  useEffect(() => {
    if (ctxSlides && ctxSlides.length > 0) {
      setSlides(ctxSlides);
      return;
    }

    const fetchSlides = async () => {
      if (!business?._id) return;

      try {
        const res = await baseApi.get(
          `/marketing/public/slides/${business._id}`,
        );

        if (Array.isArray(res.data)) {
          setSlides(res.data);
        } else if (Array.isArray(res.data?.data)) {
          setSlides(res.data.data);
        } else {
          setSlides([]);
        }
      } catch (err) {
        setSlides([]);
      }
    };

    fetchSlides();
  }, [business?._id, ctxSlides]);

  const slide = useMemo(() => {
    if (!slides.length) return null;

    let item = slides[0];

    if (typeof item === "string") {
      try {
        item = JSON.parse(item);
      } catch {
        return null;
      }
    }

    return item;
  }, [slides]);

  const activeBanner =
    heroBanners?.[0] || banners?.find((b) => b.type === "hero") || slide;
  console.log("Active Banner:", activeBanner);
  // ===========================
  // Dynamic values with fallback
  // ===========================

  const subtitle = activeBanner?.subtitle || "Handcrafted Soft Companions";

  const title = activeBanner?.title || "THE WORLD OF STARLING TALES";

  const description =
    activeBanner?.description ||
    `Welcome to our home and meet our residents.

Lovingly handcrafted, stitched with care and created with gentle fabrics. Every companion is thoughtfully designed to bring comfort, imagination and meaningful memories into childhood.`;

  const buttonText =
    activeBanner?.buttonText ||
    activeBanner?.ctaLabel ||
    activeBanner?.buttonText ||
    "Explore Our World";

  const buttonLink =
    activeBanner?.targetUrl ||
    activeBanner?.ctaLink ||
    activeBanner?.buttonLink ||
    (activeBanner?.targetId
      ? `${storeHomePath}/product/${activeBanner.targetId}`
      : `${storeHomePath}/products`);

  const image =
    activeBanner?.image ||
    activeBanner?.bgImage ||
    activeBanner?.imageUrl ||
    "https://starlingtales.vercel.app/22.png";

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#FCFAF7] border-b border-[#E8DFD2] py-10 lg:py-14 scroll-mt-20"
    >
      {/* Decorations */}
      <Botanical className="absolute -left-10 top-12 w-36 opacity-20 pointer-events-none" />
      <Botanical className="absolute -right-10 bottom-8 w-36 opacity-20 rotate-180 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-14 min-h-[480px]">
          {/* LEFT */}
          <div className="order-1 flex flex-col justify-center text-center lg:text-left">
            <span className="uppercase tracking-[0.35em] text-[11px] text-[#8DAEC4] font-semibold mb-4">
              {subtitle}
            </span>

            <h1 className="font-display font-bold text-[#2F433C] leading-[0.95] text-4xl sm:text-5xl lg:text-6xl whitespace-pre-line">
              {title}
            </h1>

            <div className="flex justify-center lg:justify-start my-5">
              <HeartDivider />
            </div>

            <p className="text-[#6B665F] text-[16px] leading-8 max-w-lg mx-auto lg:mx-0 whitespace-pre-line">
              {description}
            </p>

            <div className="mt-7">
              <Link
                to={buttonLink}
                className="inline-flex items-center justify-center gap-3 border border-[#2F433C] px-7 py-3 uppercase tracking-[0.18em] text-sm font-semibold text-[#2F433C] hover:bg-[#2F433C] hover:text-white transition-all duration-300"
              >
                {buttonText}
                <span className="text-lg">♡</span>
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="order-2 flex justify-center lg:justify-end h-full">
            <div className="relative w-full max-w-[560px] h-[340px] sm:h-[420px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[#EADFCF] blur-3xl opacity-40 scale-95 z-0"></div>

              <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.src = "https://starlingtales.vercel.app/22.png";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StarlingTalesHero;
