import React, { useState } from "react";
import { X, Send, Sparkles, MessageCircle } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function StarlingWhatsAppButton() {
  const storeContext = useStore() || {};
  const business = storeContext.business || {};

  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Extract phone number from store context or default to fallback
  const rawPhone =
    business.whatsapp || business.businessPhone || "+91 9536699999";
  const cleanPhone = rawPhone.replace(/\D/g, "") || "919536699999";
  const businessName = business.businessName || "Starling Tales";

  const defaultMessage = `Hello ${businessName}! I would like to connect regarding your products and services.`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    defaultMessage,
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* WhatsApp Chat Popup Card */}
      {isOpen && (
        <div className="mb-4 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-[#C5A880]/30 overflow-hidden transition-all duration-300 transform scale-100 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#2C3E35] text-[#FAF6F0] p-4 flex items-center justify-between border-b border-[#C5A880]/20">
            <div className="flex items-center gap-3">
              <div className="relative">
                {business.logo ? (
                  <img
                    src={business.logo}
                    alt={businessName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#25D366]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold font-serif text-lg">
                    ST
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-[#2C3E35] rounded-full"></span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#FAF6F0]">
                  {businessName}
                </h4>
                <p className="text-[11px] text-[#FAF6F0]/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
                  Typically replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#FAF6F0]/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              aria-label="Close WhatsApp chat popup"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#FAF6F0]/50 space-y-3">
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-[#C5A880]/15 max-w-[88%] text-xs text-[#2C3E35] leading-relaxed">
              <p className="font-medium">Hi there! 👋</p>
              <p className="mt-1 text-[#2C3E35]/80">
                Welcome to {businessName}. How can we help you create your
                heirloom story today?
              </p>
              <span className="block mt-2 text-[9px] text-gray-400 text-right">
                Just now
              </span>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <MessageCircle size={16} className="fill-white text-[#25D366]" />
              <span>Start Chat on WhatsApp</span>
              <Send size={14} className="ml-1" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Button Stack */}
      <div className="relative group flex items-center gap-2">
        {/* Hover Tooltip when popup is closed */}
        {!isOpen && !isDismissed && (
          <div className="hidden sm:flex items-center gap-2 bg-[#2C3E35] text-[#FAF6F0] text-xs py-2 px-3.5 rounded-xl shadow-xl border border-[#C5A880]/30 animate-bounce transition-all duration-300">
            <span className="font-serif">Chat with us on WhatsApp</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              className="text-[#FAF6F0]/60 hover:text-white ml-1"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Connect on WhatsApp"
          className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        >
          {/* Animated Glow Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping opacity-75 pointer-events-none"></span>

          {/* WhatsApp SVG Icon */}
          <svg
            className="w-7 h-7 fill-current relative z-10 transition-transform duration-300 group-hover:rotate-6"
            viewBox="0 0 24 24"
          >
            <path d="M12.012 2c-5.508 0-9.989 4.481-9.989 9.99 0 1.763.459 3.486 1.332 5.004L2 22l5.127-1.341c1.464.799 3.12 1.221 4.885 1.221 5.509 0 9.99-4.481 9.99-9.99 0-5.509-4.481-9.99-9.99-9.99zm0 18.28c-1.547 0-3.06-.415-4.384-1.2l-.314-.187-3.042.796.81-2.968-.205-.327C4.072 14.935 3.6 13.5 3.6 11.99c0-4.639 3.773-8.41 8.412-8.41 4.638 0 8.41 3.771 8.41 8.41 0 4.639-3.772 8.41-8.41 8.41zm4.606-6.29c-.252-.126-1.492-.736-1.724-.82-.232-.084-.401-.126-.57.126-.168.252-.656.82-.804.988-.148.168-.295.189-.547.063-.252-.126-1.066-.393-2.03-1.253-.75-.668-1.256-1.494-1.403-1.746-.148-.252-.016-.388.11-.513.113-.113.252-.294.378-.441.126-.147.168-.252.252-.42.084-.168.042-.315-.021-.441-.063-.126-.57-1.373-.78-1.879-.205-.494-.413-.427-.57-.435-.147-.008-.315-.008-.483-.008-.168 0-.441.063-.672.315-.231.252-.883.863-.883 2.105 0 1.242.903 2.441 1.029 2.61.126.168 1.776 2.712 4.303 3.803.601.26 1.07.415 1.436.531.604.192 1.154.165 1.588.1.485-.072 1.492-.61 1.702-1.2.21-.59.21-1.095.147-1.201-.063-.105-.231-.168-.483-.294z" />
          </svg>

          {/* Unread Indicator Badge */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow">
            1
          </span>
        </button>
      </div>
    </div>
  );
}
