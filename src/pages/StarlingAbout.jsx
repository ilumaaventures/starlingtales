import React from "react";
import HeartDivider from "../components/HeartDivider";
import Philosophy from "../assets/Pholosphy.png";
export default function StarlingAbout() {
  return (
    <>
      <section
        id="about-us"
        className="reveal grid bg-cream md:grid-cols-2 scroll-mt-20 items-center mx-auto max-w-7xl overflow-hidden"
      >
        <div className="order-1 relative overflow-hidden px-5 py-10 md:px-12 lg:px-20 lg:py-2">
          <div className="relative z-10 max-w-xl">
            <p className="text-sm font-medium tracking-[0.26em] leading-normal uppercase text-text-dark max-md:text-xs max-md:tracking-[0.22em] text-left">
              OUR PHILOSOPHY
            </p>
            <div className="mt-6">
              <HeartDivider centered={false} />
            </div>
            <p className="mt-8 text-[12px] font-light leading-[1.85] text-text-body">
              We believe in the quiet magic of simple pleasures — because it is
              often the little things that mean the most. At Starling Tales, we
              find inspiration in those precious, uncomplicated moments of
              happiness. A soft giggle, a sleepy cuddle, a story whispered at
              bedtime. It is with these moments in mind that we create
              collections designed to be lived in, loved, and to become an
              intimate part of your everyday life.
            </p>
            <p className="mt-5 text-[12px] font-light leading-[1.85] text-text-body">
              We believe childhood should feel gentle, comforting, and
              beautifully unhurried. Our world is one of serene wonder — where
              beautiful, stylish design meets mindful materials that feel like a
              soft, warm hug. We are guided by three unwavering promises:
              Timeless Style, Uncompromising Quality, and Exceptional Attention
              to Detail.
            </p>
            <p className="mt-5 text-[12px] font-light leading-[1.85] text-text-body">
              Every Starling Tales piece is thoughtfully created using
              chemical-free fibres, soothing tones. Wonderfully durable every
              stitch is placed with intention. We are obsessive about detail,
              and proudly so. The way our toys sit perfectly in little hands,
              the expression that speaks a thousand words, the comfort of
              holding one close — it is pure magic.
            </p>
            <p className="mt-5 mb-8 text-[12px] font-light leading-[1.85] text-text-body">
              We don’t just make toys and nursery textiles. We create companions
              that celebrate childhood milestones and become cherished
              heirlooms, bringing a gentle and enduring sense of comfort,
              imagination, and peace into your home. Made to be cherished, as
              much as we cherish creating them.
            </p>
          </div>
        </div>
        <div className="order-2 px-4  md:px-8 flex items-center justify-center">
          <img
            className="w-full max-h-full rounded-2xl shadow-md object-cover self-center"
            src={Philosophy}
            alt="Handcrafted toys and soft textiles reflecting Starling Tales philosophy"
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>
    </>
  );
}
