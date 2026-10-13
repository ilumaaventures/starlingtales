import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MoveRight,
  Gift,
  Heart,
  Truck,
  CheckCircle2,
  Sparkles,
  Feather,
  Play,
} from "lucide-react";
import "../styles/StarlingTales.css";
import { useStore } from "../context/StoreContext";
import StarlingHamperVideoModal from "../components/StarlingHamperVideoModal";

// Local Hamper Assets from ILumaaStudio
import hamper1 from "../assets/hamper-1 (1).jpeg";
import hamper2 from "../assets/hamper-1 (2).jpeg";
import hamper3 from "../assets/hamper-1 (3).jpeg";
import hamper4 from "../assets/hamper-1 (4).jpeg";
import hamper5 from "../assets/hamper-1 (5).jpeg";

const HAMPERS_DATA = [
  {
    id: 1,
    title: "New Baby",
    tagline: "A basket of cuddles, comfort & treasured beginnings.",
    description:
      "Thoughtfully curated for little moments that become lifelong memories. Featuring a handmade giraffe companion, an ultra-soft baby blanket, and touch-and-feel books designed to inspire warmth, comfort, and early wonder—beautifully wrapped in a timeless keepsake basket.",
    city: "Mumbai",
    image: hamper1,
    callouts: [
      {
        title: "Ultra Soft\nBaby Blanket",
        top: "14%",
        left: "6%",
      },
      {
        title: "Handmade\nGiraffe Toy",
        top: "6%",
        left: "52%",
      },
      {
        title: "Touch & Feel\nFarm Animals Book",
        top: "14%",
        right: "4%",
      },
    ],
    stampTitle: "Made with Love,",
    stampSubtitle: "SENT WITH HEART",
    waxNote: "Free handwritten calligraphy gift message included.",
  },
  {
    id: 2,
    title: "Tiny Explorer",
    tagline: "Adventures, sweet dreams & cuddly companions.",
    description:
      "A delightful discovery basket with handcrafted animal companions, snuggly organic swaddles, and keepsake storybooks curated to nurture curiosity and boundless imagination from day one.",
    city: "Bengaluru",
    image: hamper2,
    callouts: [
      {
        title: "Organic Muslin\nSwaddles",
        top: "12%",
        left: "6%",
      },
      {
        title: "Artisanal Teddy\nBear",
        top: "6%",
        left: "50%",
      },
      {
        title: "Keepsake Milestone\nStory Cards",
        top: "14%",
        right: "4%",
      },
    ],
    stampTitle: "Handcrafted Bliss,",
    stampSubtitle: "PACKED WITH CARE",
    waxNote: "Free wax-sealed envelope & custom note included.",
  },
  {
    id: 3,
    title: "Blushing Meadow",
    tagline: "Gentle rose hues, pure muslin & sweet lullabies.",
    description:
      "Wrapped in delicate pastel ribbons, this enchanting set features cozy organic essentials, charming keepsake rattles, and soothing nursery pieces made for peaceful slumber and joyful mornings.",
    city: "Delhi",
    image: hamper3,
    callouts: [
      {
        title: "Pastel Pink\nMuslin Ribbons",
        top: "12%",
        left: "6%",
      },
      {
        title: "Pure Organic\nCotton Set",
        top: "6%",
        left: "52%",
      },
      {
        title: "Keepsake Rattle\n& Memory Token",
        top: "14%",
        right: "4%",
      },
    ],
    stampTitle: "Purest Comfort,",
    stampSubtitle: "WRAPPED IN JOY",
    waxNote: "Free handwritten calligraphy gift message included.",
  },
  {
    id: 4,
    title: "Sleepy Bunny",
    tagline: "Dreamy blue clouds, bunny cuddles & quiet nights.",
    description:
      "An angelic nursery collection centered around our signature handcrafted bunny, sky-blue heirloom textiles, and calming keepsakes designed to bring serene smiles and restful sleep.",
    city: "Pune",
    image: hamper4,
    callouts: [
      {
        title: "Signature Velvet\nBunny",
        top: "12%",
        left: "6%",
      },
      {
        title: "Sky-Blue Cloud\nMuslin Wrap",
        top: "6%",
        left: "52%",
      },
      {
        title: "Wooden Teething\nKeepsake Ring",
        top: "14%",
        right: "4%",
      },
    ],
    stampTitle: "Treasured Heirloom,",
    stampSubtitle: "MADE WITH CARE",
    waxNote: "Free gold-foiled handwritten message included.",
  },
  {
    id: 5,
    title: "Golden Sunshine",
    tagline: "Warm embrace of luxury, pure joy & celebrations.",
    description:
      "A grand celebration hamper accented with shimmering satin ribbons, premium organic cotton essentials, and beloved plush characters to commemorate the most cherished milestones.",
    city: "Hyderabad",
    image: hamper5,
    callouts: [
      {
        title: "Golden Satin\nBow & Wrap",
        top: "12%",
        left: "6%",
      },
      {
        title: "Premium Organic\nCotton Bodysuit",
        top: "6%",
        left: "50%",
      },
      {
        title: "Keepsake Baby\nMoments Journal",
        top: "14%",
        right: "4%",
      },
    ],
    stampTitle: "Celebration Special,",
    stampSubtitle: "CURATED WITH LOVE",
    waxNote: "Free wax-sealed personalized note included.",
  },
];

export default function GiftHamper() {
  const { business, storeHomePath: contextHomePath } = useStore();
  const [activeHamperIndex, setActiveHamperIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const storeHomePath =
    contextHomePath ||
    (business?.subdomain
      ? `/${encodeURIComponent(business.subdomain)}`
      : business?.slug
        ? `/${encodeURIComponent(business.slug)}`
        : business?.businessName
          ? `/${encodeURIComponent(business.businessName)}`
          : "");

  const activeHamper = HAMPERS_DATA[activeHamperIndex] || HAMPERS_DATA[0];

  return (
    <section
      id="gift-hampers"
      className="reveal bg-[#FAF7F2] px-4 sm:px-6 lg:px-8 py-10 md:py-16 scroll-mt-20 border-t border-[#EAE3D2]/60 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
          {/* ================= LEFT COLUMN: STORY & SELECTOR ================= */}
          <div className="space-y-6">
            {/* Atelier Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E2D8C3] text-[11px] font-bold tracking-[0.22em] uppercase text-[#7A695B] shadow-2xs">
              <Gift size={13} className="text-[#C5A880]" />
              <span>The Gifting Atelier</span>
            </div>

            {/* Heart Divider Icon */}
            <div className="flex items-center gap-3 text-[#96A9B8]">
              <Heart size={16} className="text-[#8AA4B4]" strokeWidth={1.5} />
              <div className="w-16 h-px border-t border-dashed border-[#D2DCE0]" />
            </div>

            {/* Main Headline */}
            <h2 className="font-display text-[34px] sm:text-[40px] lg:text-[44px] leading-[1.12] text-[#2C3E35] font-normal tracking-tight">
              The perfect gift,
              <br />
              beautifully wrapped.
            </h2>

            {/* Editorial Paragraph */}
            <div className="space-y-3.5 text-[13.5px] sm:text-[14px] leading-[1.8] text-[#5B5B5B] font-light">
              <p>
                It’s the little details that turn a gift into something truly
                thoughtful – beautiful wrapping and a note that says just how
                much they mean to you. Make every present feel special with our
                gift boxes and bags, whether you’re handing it over in person or
                sending it straight to their door. Every hamper is thoughtfully
                curated and presented - a complete gifting experience for new
                arrivals, birthdays, and milestone moments. We combine our
                most-loved hand-stitched companions, soft organic muslin
                textiles, and safe keepsakes into harmonious sets designed to
                delight both parents and little ones.
              </p>
            </div>

            {/* Bullet Points */}
            <ul className="space-y-3 text-[13.5px] text-[#5B5B5B] font-light list-none p-0">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8AA4B4] mt-2 shrink-0" />
                <span>
                  Pick from our wide range of handcrafted treasures and create a
                  hamper that’s uniquely yours.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8AA4B4] mt-2 shrink-0" />
                <span>
                  Curate it, personalise it, and make every gift truly special.
                  Custom embroidery & name personalisation available.
                </span>
              </li>
            </ul>

            {/* Delivered With Love - Interactive Thumbnail Selector */}
            <div className="pt-2">
              <div className="flex items-center gap-2 text-[#9A8D82] text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
                <Truck size={14} />
                <span>Select a Hamper to Preview</span>
              </div>
              <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
                {HAMPERS_DATA.map((h, idx) => {
                  const isSelected = activeHamperIndex === idx;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setActiveHamperIndex(idx)}
                      className={`flex flex-col items-center text-center group cursor-pointer transition-all duration-200 outline-none ${
                        isSelected
                          ? "scale-[1.04]"
                          : "hover:scale-[1.02] opacity-75 hover:opacity-100"
                      }`}
                    >
                      <div
                        className={`w-full aspect-[4/3] rounded-xl overflow-hidden border-2 bg-white shadow-2xs transition-all ${
                          isSelected
                            ? "border-[#2C3E35] ring-2 ring-[#2C3E35]/20 shadow-sm"
                            : "border-transparent hover:border-[#D0AE86]"
                        }`}
                      >
                        <img
                          src={h.image}
                          alt={h.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* How to build your hamper box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-[#E8DFC8] space-y-1.5 shadow-2xs">
              <h4 className="font-medium text-[#2C3E35] text-xs sm:text-[13px] tracking-wide uppercase">
                How to build your hamper—
              </h4>
              <p className="text-xs sm:text-[13px] text-[#5B5B5B] font-light leading-relaxed">
                Browse the site and add the items you’d like to gift to your
                shopping bag. We will pack them in a gift box with message card
                for you to write your personal greetings.
              </p>
              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to={`${storeHomePath}/create-hamper`}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#2C3E35] hover:bg-[#1E2B25] text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-full transition-all duration-200 shadow-md group"
                >
                  <span>Create your own hamper</span>
                  <MoveRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => setShowVideoModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-3.5 border border-[#2C3E35]/30 hover:border-[#2C3E35] text-[#2C3E35] hover:bg-[#2C3E35]/5 text-[11px] font-bold tracking-[0.16em] uppercase rounded-full transition-all duration-200 cursor-pointer shadow-xs"
                >
                  <Play size={13} className="fill-current text-[#C5A880]" />
                  <span>Watch Crafting Video</span>
                </button>
              </div>
            </div>
          </div>

          {/* Video Modal triggered on demand */}
          {showVideoModal && (
            <StarlingHamperVideoModal
              forceOpen={true}
              onClose={() => setShowVideoModal(false)}
            />
          )}

          {/* ================= RIGHT COLUMN: CLEAN & SIMPLE IMAGE SHOWCASE ================= */}
          <div className="flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-md lg:max-w-lg flex items-center justify-center">
              <img
                key={activeHamper.id}
                src={activeHamper.image}
                alt={activeHamper.title}
                className="w-full h-auto max-h-full rounded-3xl  object-contain drop-shadow-xl animate-fade-in transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
