import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context
import { StoreProvider, useStore } from "./context/StoreContext";

// Layout & Global Components
import StarlingNavbar from "./components/StarlingNavbar";
import StarlingFooter from "./components/StarlingFooter";
import CartDrawer from "./components/CartDrawer";
import StarlingWhatsAppButton from "./components/StarlingWhatsAppButton";
import AuthModal from "./components/AuthModal";

// Pages
import StarlingTalesHome from "./pages/StarlingTalesHome";
import StarlingTalesProduct from "./pages/StarlingTalesProduct";
import ProductDetailPage from "./pages/ProductDetailPage";
import StarlingGiftHampers from "./pages/StarlingGiftHampers";
import CreateOwnHamper from "./pages/CreateOwnHamper";
import StarlingAbout from "./pages/StarlingAbout";
import StarlingPolicies from "./pages/StarlingPolicies";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import WishlistPage from "./pages/WishlistPage";
import NotFoundPage from "./pages/NotFoundPage";

// Scroll restoration helper
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const targetId = hash.replace("#", "");
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, hash]);

  return null;
}

function MainLayout() {
  const { isCartOpen, setIsCartOpen } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-cream text-text-dark font-sans selection:bg-blue-light selection:text-blue-soft">
      <ScrollToTop />
      <StarlingNavbar />

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<StarlingTalesHome />} />
          <Route path="/products" element={<StarlingTalesProduct />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* Gift Hampers */}
          <Route path="/gift-hampers" element={<StarlingGiftHampers />} />
          <Route path="/gifthampers" element={<StarlingGiftHampers />} />
          <Route path="/hampers" element={<StarlingGiftHampers />} />

          {/* Interactive Hamper Builder */}
          <Route path="/create-hamper" element={<CreateOwnHamper />} />
          <Route path="/custom-hamper" element={<CreateOwnHamper />} />

          {/* Authentication & Profile Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/my-orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-profile" element={<ProfilePage />} />

          {/* About */}
          <Route
            path="/about"
            element={
              <div className="py-12 px-4 max-w-7xl mx-auto w-full">
                <StarlingAbout />
              </div>
            }
          />

          {/* Policies */}
          <Route path="/policies" element={<StarlingPolicies />} />
          <Route path="/returns" element={<StarlingPolicies />} />
          <Route path="/exchanges" element={<StarlingPolicies />} />
          <Route path="/refunds" element={<StarlingPolicies />} />
          <Route path="/shipping-policy" element={<StarlingPolicies />} />

          {/* Wishlist */}
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/my-wishlist" element={<WishlistPage />} />

          {/* Bag & Checkout */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <StarlingFooter />

      {/* Global Slide-In Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen && setIsCartOpen(false)}
      />

      {/* Global In-Page Authentication Modal */}
      <AuthModal />

      {/* Floating WhatsApp Support Action */}
      <StarlingWhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <MainLayout />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#37463f",
              color: "#fffefc",
              fontSize: "12px",
              fontFamily: "'Outfit', sans-serif",
              borderRadius: "12px",
              padding: "12px 16px",
            },
          }}
        />
      </StoreProvider>
    </BrowserRouter>
  );
}
