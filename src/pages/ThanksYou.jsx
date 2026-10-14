import React, { useEffect, useMemo, useState } from "react";
import "../styles/StarlingTales.css";
// constants cleaned
import Icon from "../components/Icon";
import Botanical from "../components/Botanical";
import HeartDivider from "../components/HeartDivider";
import ButtonLink from "../components/ButtonLink";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import ResidentCard from "../components/ResidentCard";
import ResidentModal from "../components/ResidentModal";
import CartDrawer from "../components/CartDrawer";
import { useStore } from "../context/StoreContext";

function ThanksYou() {
  const { business, storeHomePath: contextHomePath } = useStore();

  return (
    <section className="reveal relative overflow-hidden bg-cream px-5 py-20 lg:px-8">
      <Botanical className="absolute left-0 top-8 h-48 w-48 text-blue-muted opacity-20" />
      <Botanical className="absolute bottom-8 right-0 h-48 w-48 rotate-180 text-blue-muted opacity-20" />

      <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[260px_1fr]">
        <div
          className="grid h-40 w-40 place-items-center border border-blue-muted rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.72),rgba(200,221,232,0.18))] bg-cream shadow-[0_18px_40px_rgba(44,62,53,0.08)] mx-auto"
          aria-label="Starling Tales logo"
        >
          <img
            src={business.logo}
            alt="Starling Tales logo"
            className="max-w-full max-h-full object-contain rounded-full"
          />
        </div>

        <div className="text-center md:text-left">
          <p className="text-[17px] font-light leading-[1.85] text-text-body">
            Thank you for choosing{" "}
            <span className="font-serif-poetic text-[24px] italic text-blue-soft">
              something
            </span>{" "}
            handmade and supporting slow, thoughtful creation.
          </p>
          <div className="mt-8">
            <HeartDivider centered={false} />
          </div>
          <p className="mt-8 font-serif-poetic text-[42px] italic leading-none text-text-dark">
            Starling Tales
          </p>
          <p className="mt-4 text-[11px] font-light uppercase tracking-[0.28em] text-brown-warm">
            Handmade With Love
          </p>
        </div>
      </div>
    </section>
  );
}

export default ThanksYou;
