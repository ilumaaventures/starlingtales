import React, { useCallback, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  User,
  Sparkles,
  LogOut,
  PackageCheck,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";

export default function StarlingNavbar() {
  const {
    business,
    storeHomePath: contextHomePath,
    cartCount,
    wishlistCount,
    setIsCartOpen,
  } = useStore();

  const { user, isAuthenticated, logout, openLoginModal } = useAuth();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const dropdownRef = useRef(null);

  const totalQty = cartCount || 0;
  const wishlistQty = wishlistCount || 0;

  const rawHome =
    contextHomePath ||
    (business?.subdomain
      ? `/${encodeURIComponent(business.subdomain)}`
      : business?.slug
        ? `/${encodeURIComponent(business.slug)}`
        : business?.businessName
          ? `/${encodeURIComponent(business.businessName)}`
          : "");
  const cleanHome = rawHome.replace(/\/$/, "");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = useCallback((sectionHash) => {
    if (!sectionHash) return;
    const id = sectionHash.replace("#", "");
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;

    const headerElement = document.querySelector("header");
    const navOffset = headerElement ? headerElement.offsetHeight : 80;
    const y = el.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!hash) return;
    const timeout = setTimeout(() => {
      scrollToSection(hash);
    }, 120);
    return () => clearTimeout(timeout);
  }, [hash, pathname, scrollToSection]);

  const navLinks = [
    { name: "HOME", path: `/#${"home"}` },
    { name: "ABOUT US", path: `/#${"about-us"}` },
    {
      name: "TENDER BEGINNINGS COLLECTION",
      path: "/products",
    },
    { name: "GIFT HAMPERS", path: "/gift-hampers" },
  ];

  const isLinkActive = (path) => {
    if (path.includes("#")) {
      const parts = path.split("#");
      return (
        (pathname === parts[0] || (!parts[0] && pathname === "/")) &&
        hash === `#${parts[1]}`
      );
    }
    return pathname === path && !hash;
  };

  const handleLinkClick = (e, path) => {
    if (path.includes("#")) {
      const parts = path.split("#");
      const targetPath = parts[0] || "/";
      const targetHash = `#${parts[1]}`;

      if (pathname === targetPath || (!parts[0] && pathname === "/")) {
        e.preventDefault();
        window.history.pushState(null, "", targetHash);
        scrollToSection(targetHash);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF6F0]/95 backdrop-blur-md shadow-xs py-3 border-b border-[#C5A880]/20"
          : "bg-[#FAF6F0] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand Name */}
          <Link
            to={"/"}
            className="flex items-center gap-3 group text-decoration-none"
          >
            {business?.logo ? (
              <img
                src={business.logo}
                alt={business?.businessName || "Starling Tales"}
                className="h-9 w-auto object-contain rounded-lg transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-9 h-9 rounded-full border border-[#C5A880] flex items-center justify-center text-[#C5A880] bg-[#FAF6F0] shadow-2xs transition-transform group-hover:scale-105">
                <Sparkles size={16} />
              </div>
            )}
            <span className="font-extrabold text-gray-900 text-lg tracking-tight capitalize font-serif group-hover:text-[#C5A880] transition-colors">
              {business?.businessName || "Starling Tales"}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className={`font-serif text-xs lg:text-sm tracking-wider  transition-all duration-300 relative py-1 hover:text-[#C5A880] ${
                    active ? "text-[#C5A880]" : "text-[#2C3E35]"
                  }`}
                >
                  <span>{link.name}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A880] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions (Cart, Wishlist, Auth Profile) */}
          <div className="hidden md:flex items-center gap-5 text-[#2C3E35]">
            <Link
              to="/wishlist"
              className="relative p-2 hover:text-[#C5A880] transition-colors"
              title="View Wishlist"
            >
              <Heart size={20} />
              {wishlistQty > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#C5A880] text-[#FAF6F0] text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistQty}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:text-[#C5A880] transition-colors cursor-pointer"
              title="Open Keepsake Cart"
            >
              <ShoppingCart size={20} />
              {totalQty > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#2C3E35] text-[#FAF6F0] text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalQty}
                </span>
              )}
            </button>

            {/* Authentication / User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#37463f]/10 hover:bg-[#37463f]/15 transition-all text-xs font-semibold text-[#2C3E35] cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#37463f] text-[#FAF6F0] flex items-center justify-center text-[11px] font-serif uppercase">
                    {user?.name?.[0] || "U"}
                  </div>
                  <span className="max-w-[90px] truncate">
                    {user?.name || "Chronicle"}
                  </span>
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E8DFC8]/70 py-2 z-50 animate-fade-in text-xs">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="font-semibold text-neutral-800 truncate">
                        {user?.name}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-neutral-700 hover:bg-[#FAF7F2] hover:text-[#37463f] transition-colors"
                    >
                      <User size={14} className="text-[#C5A880]" />
                      <span>Sanctuary Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-neutral-700 hover:bg-[#FAF7F2] hover:text-[#37463f] transition-colors"
                    >
                      <PackageCheck size={14} className="text-[#C5A880]" />
                      <span>My Keepsake Orders</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openLoginModal()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#37463f]/30 hover:bg-[#37463f] hover:text-[#FAF6F0] transition-all text-xs font-semibold tracking-wider uppercase cursor-pointer"
              >
                <User size={14} />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#2C3E35]"
            >
              <ShoppingCart size={22} />
              {totalQty > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#2C3E35] text-[#FAF6F0] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="p-2 text-[#2C3E35] hover:text-[#C5A880] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenu && (
        <div className="md:hidden border-t border-[#C5A880]/15 bg-[#FAF6F0] px-6 py-8 space-y-6 animate-fadeIn">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => {
                    setMobileMenu(false);
                    handleLinkClick(e, link.path);
                  }}
                  className={`font-serif   transition-colors ${
                    active
                      ? "text-[#C5A880]"
                      : "text-[#2C3E35] hover:text-[#C5A880]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#C5A880]/15 space-y-3">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#37463f] text-white flex items-center justify-center font-serif">
                    {user?.name?.[0] || "U"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2C3E35]">
                      {user?.name}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 pt-1">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenu(false)}
                    className="text-xs font-semibold text-[#37463f] flex items-center gap-1.5"
                  >
                    <User size={14} />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenu(false)}
                    className="text-xs font-semibold text-[#37463f] flex items-center gap-1.5"
                  >
                    <PackageCheck size={14} />
                    <span>My Orders</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenu(false);
                      logout();
                    }}
                    className="text-xs font-semibold text-red-600 flex items-center gap-1.5"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenu(false);
                  openLoginModal();
                }}
                className="w-full py-2.5 bg-[#37463f] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <User size={15} />
                <span>Sign In or Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
