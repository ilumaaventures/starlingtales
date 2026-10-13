import React, { useEffect, useMemo, useState } from "react";
import "../styles/StarlingTales.css";
import {
  PRODUCTS,
  RESIDENTS,
  navLinks,
  pillars,
  FREE_SHIPPING_THRESHOLD,
  formatPrice,
  readStorage,
} from "../constants/constants";
import Icon from "../components/Icon";
import Botanical from "../components/Botanical";
import HeartDivider from "../components/HeartDivider";
import ButtonLink from "../components/ButtonLink";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import ResidentCard from "../components/ResidentCard";
import ResidentModal from "../components/ResidentModal";
import CartDrawer from "../components/CartDrawer";

function BrandPillars() {
  return (
    <section
      id="brand-pillars"
      className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8 border-b border-cream-dark/40 scroll-mt-20"
    >
      {pillars.map((pillar) => (
        <div key={pillar.title} className="flex gap-4 p-4 items-start">
          <div className="h-10 w-10 shrink-0 rounded-full bg-blue-light flex items-center justify-center text-blue-soft">
            <Icon name={pillar.icon} className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-dark">
              {pillar.title}
            </h4>
            <p className="text-xs text-text-muted leading-relaxed font-light">
              {pillar.text}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default BrandPillars;
