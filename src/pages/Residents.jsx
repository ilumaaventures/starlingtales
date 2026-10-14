import React, { useState } from "react";
import "../styles/StarlingTales.css";
import { RESIDENTS } from "../constants/constants";
import HeartDivider from "../components/HeartDivider";
import ResidentCard from "../components/ResidentCard";
import ResidentModal from "../components/ResidentModal";

function Residents() {
  const [activeResident, setActiveResident] = useState(null);

  return (
    <section
      id="our-residents"
      className="py-10 px-6 max-w-7xl mx-auto space-y-12 scroll-mt-20 mb-20"
    >
      <div className="text-center space-y-3.5">
        <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-blue-soft block">
          Meet the Storytellers
        </span>
        <h2 className="text-3xl font-display font-semibold text-text-dark">
          Our Beloved Residents
        </h2>
        <HeartDivider />
        <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed font-light">
          Every creation has their own unique personality, favorite quirks, and
          whimsical background stories. Meet our residents!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {RESIDENTS.map((resident) => (
          <ResidentCard
            key={resident.id}
            resident={resident}
            onOpenStory={setActiveResident}
          />
        ))}
      </div>
      {activeResident ? (
        <ResidentModal
          resident={activeResident}
          onClose={() => setActiveResident(null)}
          onAdopt={() => {
            setActiveResident(null);
          }}
        />
      ) : null}
    </section>
  );
}

export default Residents;
