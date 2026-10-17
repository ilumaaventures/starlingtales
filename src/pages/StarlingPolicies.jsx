import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RotateCcw,
  RefreshCw,
  CreditCard,
  Truck,
  ShieldCheck,
  FileText,
  Sparkles,
  ChevronRight,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import baseApi from "../services/baseApi";
import "../styles/StarlingTales.css";

export default function StarlingPolicies() {
  const storeContext = useStore() || {};
  const { business, storeHomePath: contextHomePath } = storeContext;
  const contextPolicies = Array.isArray(storeContext.policies) ? storeContext.policies : [];
  const [fetchedPolicies, setFetchedPolicies] = useState(contextPolicies);

  useEffect(() => {
    if (contextPolicies.length > 0) {
      setFetchedPolicies(contextPolicies);
      return;
    }

    const bizId = business?._id;
    const bizSlug = storeContext.storeSlug || "starlingtales";

    let isMounted = true;
    async function loadPolicies() {
      try {
        let res;
        if (bizId) {
          res = await baseApi.get("/business-policies/public", { params: { businessId: bizId } });
        } else {
          res = await baseApi.get("/business-policies/public", { params: { subdomain: bizSlug } });
        }
        const policyList = Array.isArray(res.data?.policies)
          ? res.data.policies
          : Array.isArray(res.data)
          ? res.data
          : [];
        if (isMounted && policyList.length > 0) {
          setFetchedPolicies(policyList);
        }
      } catch (err) {
        console.log("Could not fetch business policies for StarlingPolicies page:", err);
      }
    }

    loadPolicies();
    return () => {
      isMounted = false;
    };
  }, [contextPolicies, business, storeContext.storeSlug]);

  const activePolicies = fetchedPolicies.length > 0 ? fetchedPolicies : contextPolicies;

  const foundReturn = activePolicies.find(
    (p) => p.type === "return_policy" || p.type === "return" || p.type === "return_refund_policy"
  );
  const foundExchange = activePolicies.find(
    (p) => p.type === "exchange_policy" || p.type === "exchange"
  );
  const foundRefund = activePolicies.find(
    (p) => p.type === "refund_policy" || p.type === "refund" || p.type === "return_refund_policy"
  );
  const foundShipping = activePolicies.find(
    (p) => p.type === "shipping_policy" || p.type === "shipping"
  );
  const foundTerms = activePolicies.find(
    (p) => p.type === "terms_and_conditions" || p.type === "terms" || p.type === "privacy_policy" || p.type === "privacy"
  );

  const { pathname, hash } = useLocation();

  const storeHomePath =
    contextHomePath ||
    (business?.subdomain
      ? `/${encodeURIComponent(business.subdomain)}`
      : business?.slug
        ? `/${encodeURIComponent(business.slug)}`
        : business?.businessName
          ? `/${encodeURIComponent(business.businessName)}`
          : "");

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (hash) {
      const cleanHash = hash.replace("#", "");
      if (["return", "exchange", "refund", "shipping", "terms"].includes(cleanHash)) {
        setActiveTab(cleanHash);
      }
    }
  }, [hash]);

  const cleanPhone = (business?.whatsapp || business?.businessPhone || "919876543210").replace(/\D/g, "");

  const renderContent = (text, fallbackJsx) => {
    if (!text) return fallbackJsx;
    const sections = text.split("\n\n").filter(Boolean);
    return (
      <div className="space-y-3 font-serif text-xs sm:text-sm leading-relaxed text-[#2C3E35]/85">
        {sections.map((sec, idx) => {
          if (sec.startsWith("###") || sec.startsWith("##") || sec.startsWith("#")) {
            const hText = sec.replace(/^#+\s*/, "");
            return <h4 key={idx} className="font-bold text-[#2C3E35] uppercase text-xs tracking-wider pt-2">{hText}</h4>;
          }
          if (sec.includes("\n•") || sec.includes("\n-") || sec.startsWith("•") || sec.startsWith("-")) {
            const lines = sec.split("\n").filter(Boolean);
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1 text-[#2C3E35]/80">
                {lines.map((ln, j) => (
                  <li key={j}>{ln.replace(/^[-•*]\s*/, "")}</li>
                ))}
              </ul>
            );
          }
          return <p key={idx} className="whitespace-pre-line">{sec}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] font-sans text-[#2C3E35] pb-24">
      {/* Top Banner */}
      <div className="bg-[#2C3E35] text-[#FAF6F0] py-14 px-6 text-center border-b border-[#C5A880]/30 relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-[#C5A880] text-xs font-serif tracking-widest uppercase border border-[#C5A880]/30">
            <Sparkles size={14} />
            <span>Store Governance & Promises</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-wide capitalize text-[#FAF6F0]">
            Starling Tales Business Policies
          </h1>
          <p className="font-serif text-sm sm:text-base text-[#FAF6F0]/80 leading-relaxed max-w-xl mx-auto italic">
            "Every keepsake is crafted with care, intention, and an unwavering commitment to your peace of mind."
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 space-y-10">
        {/* Navigation Tabs */}
        <div className="flex justify-center gap-2 overflow-x-auto pb-2 text-xs font-serif tracking-wider uppercase border-b border-[#C5A880]/20 scrollbar-none">
          {[
            { id: "all", label: "All Policies" },
            { id: "return", label: "Return Policy" },
            { id: "exchange", label: "Exchange Policy" },
            { id: "refund", label: "Refund Policy" },
            { id: "shipping", label: "Shipping Policy" },
            { id: "terms", label: "Terms & Privacy" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-full transition-all duration-300 cursor-pointer shrink-0 font-bold ${
                activeTab === tab.id
                  ? "bg-[#2C3E35] text-[#FAF6F0] shadow-md border border-[#C5A880]/40"
                  : "bg-white text-[#2C3E35]/70 border border-[#C5A880]/20 hover:border-[#C5A880] hover:text-[#2C3E35]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Policy Cards Grid */}
        <div className="space-y-8">
          {/* 1. RETURN POLICY */}
          {(activeTab === "all" || activeTab === "return") && (
            <div
              id="return"
              className="bg-white rounded-3xl p-8 sm:p-10 border border-[#C5A880]/25 shadow-sm space-y-6 scroll-mt-28 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4 border-b border-[#C5A880]/20 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#2C3E35] text-[#C5A880] flex items-center justify-center font-serif font-bold text-xl shadow-sm">
                  <RotateCcw size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-serif font-bold tracking-widest uppercase text-[#C5A880]">
                    POLICY NO. 01
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#2C3E35]">
                    {foundReturn?.title || "Return Policy"}
                  </h2>
                </div>
              </div>

              {renderContent(
                foundReturn?.content,
                <div className="space-y-4 text-xs sm:text-sm text-[#2C3E35]/85 leading-relaxed font-serif">
                  <p className="text-base font-semibold text-[#2C3E35]">
                    We want you and your little ones to adore every Starling Tales keepsake. If an item isn't quite right, our 7-Day Return Policy is simple and reassuring.
                  </p>
                  <h4 className="font-bold text-[#2C3E35] uppercase text-xs tracking-wider pt-2 border-t border-[#FAF6F0]">
                    Return Terms & Conditions:
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-[#2C3E35]/80">
                    <li>Returns must be initiated within <strong>7 days</strong> of delivery receipt.</li>
                    <li>Items must remain unwashed, unused, and in original condition with tags attached.</li>
                    <li>Doorstep pickup is provided across India at zero extra courier charge for defective/mismatched items.</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 2. EXCHANGE POLICY */}
          {(activeTab === "all" || activeTab === "exchange") && (
            <div
              id="exchange"
              className="bg-white rounded-3xl p-8 sm:p-10 border border-[#C5A880]/25 shadow-sm space-y-6 scroll-mt-28 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4 border-b border-[#C5A880]/20 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#2C3E35] text-[#C5A880] flex items-center justify-center font-serif font-bold text-xl shadow-sm">
                  <RefreshCw size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-serif font-bold tracking-widest uppercase text-[#C5A880]">
                    POLICY NO. 02
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#2C3E35]">
                    {foundExchange?.title || "Exchange Policy"}
                  </h2>
                </div>
              </div>

              {renderContent(
                foundExchange?.content,
                <div className="space-y-4 text-xs sm:text-sm text-[#2C3E35]/85 leading-relaxed font-serif">
                  <p className="text-base font-semibold text-[#2C3E35]">
                    Need a different size, colorway, or nursery hamper variant? Our Exchange Policy ensures an effortless swap.
                  </p>
                  <h4 className="font-bold text-[#2C3E35] uppercase text-xs tracking-wider pt-2 border-t border-[#FAF6F0]">
                    Exchange Guidelines:
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-[#2C3E35]/80">
                    <li>Exchange requests can be submitted within <strong>7 days</strong> of delivery.</li>
                    <li>Our courier delivers replacement item while picking up returned item in a single visit.</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 3. REFUND POLICY */}
          {(activeTab === "all" || activeTab === "refund") && (
            <div
              id="refund"
              className="bg-white rounded-3xl p-8 sm:p-10 border border-[#C5A880]/25 shadow-sm space-y-6 scroll-mt-28 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4 border-b border-[#C5A880]/20 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#2C3E35] text-[#C5A880] flex items-center justify-center font-serif font-bold text-xl shadow-sm">
                  <CreditCard size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-serif font-bold tracking-widest uppercase text-[#C5A880]">
                    POLICY NO. 03
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#2C3E35]">
                    {foundRefund?.title || "Refund Policy"}
                  </h2>
                </div>
              </div>

              {renderContent(
                foundRefund?.content,
                <div className="space-y-4 text-xs sm:text-sm text-[#2C3E35]/85 leading-relaxed font-serif">
                  <p className="text-base font-semibold text-[#2C3E35]">
                    When a return is verified, your refund is credited promptly with zero hassle.
                  </p>
                  <h4 className="font-bold text-[#2C3E35] uppercase text-xs tracking-wider pt-2 border-t border-[#FAF6F0]">
                    Refund Processing & Modes:
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-[#2C3E35]/80">
                    <li><strong>Prepaid Orders:</strong> Refunded to original source within <strong>3-5 business days</strong>.</li>
                    <li><strong>COD Orders:</strong> Refunded via NEFT bank transfer or Store Credit.</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 4. SHIPPING POLICY */}
          {(activeTab === "all" || activeTab === "shipping") && (
            <div
              id="shipping"
              className="bg-white rounded-3xl p-8 sm:p-10 border border-[#C5A880]/25 shadow-sm space-y-6 scroll-mt-28 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4 border-b border-[#C5A880]/20 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#2C3E35] text-[#C5A880] flex items-center justify-center font-serif font-bold text-xl shadow-sm">
                  <Truck size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-serif font-bold tracking-widest uppercase text-[#C5A880]">
                    POLICY NO. 04
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#2C3E35]">
                    {foundShipping?.title || "Shipping & Delivery Policy"}
                  </h2>
                </div>
              </div>

              {renderContent(
                foundShipping?.content,
                <div className="space-y-4 text-xs sm:text-sm text-[#2C3E35]/85 leading-relaxed font-serif">
                  <p className="text-base font-semibold text-[#2C3E35]">
                    We package every order in sustainable, organic muslin pouches and protective gift boxing.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-[#2C3E35]/80">
                    <li><strong>Dispatch SLA:</strong> In-stock items are dispatched within 24 to 48 hours from our ateliers.</li>
                    <li><strong>Courier Partner:</strong> Powered by Shadowfax Logistics Express with live doorstep tracking and SMS dispatch alerts.</li>
                    <li><strong>Calculated Shipping Rates:</strong> Live courier pricing calculated via Shadowfax Logistics (from ₹69 express delivery, or complimentary free delivery on orders ₹5,000+).</li>
                    <li><strong>Delivery Timelines:</strong> 2 to 4 business days across verified Indian postal PIN codes.</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 5. TERMS & PRIVACY */}
          {(activeTab === "all" || activeTab === "terms") && (
            <div
              id="terms"
              className="bg-white rounded-3xl p-8 sm:p-10 border border-[#C5A880]/25 shadow-sm space-y-6 scroll-mt-28 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4 border-b border-[#C5A880]/20 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#2C3E35] text-[#C5A880] flex items-center justify-center font-serif font-bold text-xl shadow-sm">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-serif font-bold tracking-widest uppercase text-[#C5A880]">
                    POLICY NO. 05
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#2C3E35]">
                    {foundTerms?.title || "Terms & Privacy Policy"}
                  </h2>
                </div>
              </div>

              {renderContent(
                foundTerms?.content,
                <div className="space-y-4 text-xs sm:text-sm text-[#2C3E35]/85 leading-relaxed font-serif">
                  <p className="text-base font-semibold text-[#2C3E35]">
                    Your privacy and data security are safeguarded with bank-grade encryption.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contact Support Banner */}
        <div className="p-8 rounded-3xl bg-[#2C3E35] text-[#FAF6F0] flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#C5A880]/30 shadow-lg">
          <div className="space-y-1 text-center sm:text-left font-serif">
            <h3 className="font-bold text-lg text-[#FAF6F0]">
              Questions About Our Policies?
            </h3>
            <p className="text-xs text-[#FAF6F0]/70">
              Our Chronicle Keepers customer team is available to assist you anytime.
            </p>
          </div>
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello Starling Tales! I have a question regarding your business policies.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3 rounded-full font-serif font-bold text-xs transition-all shrink-0 shadow flex items-center gap-2"
          >
            <MessageCircle size={16} className="fill-white text-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
