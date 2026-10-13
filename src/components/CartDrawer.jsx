import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "../constants/constants";
import { useStore } from "../context/StoreContext";

export default function CartDrawer({
  open,
  isOpen,
  cart,
  items,
  products = [],
  onClose,
  onQty,
  onUpdateQuantity,
  onRemove,
  onRemoveItem,
  onCheckout,
}) {
  const store = useStore();
  const navigate = useNavigate();

  const isVisible =
    open !== undefined
      ? open
      : isOpen !== undefined
        ? isOpen
        : store.isCartOpen;

  const panelRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      const first = panelRef.current?.querySelector("button");
      first?.focus();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleClose = () => {
    if (onClose) onClose();
    if (store.setIsCartOpen) store.setIsCartOpen(false);
  };

  const actualCart =
    Array.isArray(cart) && cart.length > 0
      ? cart
      : Array.isArray(items) && items.length > 0
        ? items
        : store.cartItems || [];

  const handleQty = (productId, sku, newQty) => {
    const targetId = productId || sku;
    if (onQty) {
      onQty(targetId, sku, newQty);
    } else if (onUpdateQuantity) {
      onUpdateQuantity(targetId, sku, newQty);
    } else if (store.updateCartQuantity) {
      store.updateCartQuantity(targetId, newQty);
    }
  };

  const handleRemove = (productId, sku, item) => {
    const targetId = productId || sku || item?._id || item?.id;
    if (onRemove) {
      onRemove(targetId, sku || targetId, item);
    } else if (onRemoveItem) {
      onRemoveItem(targetId, sku || targetId, item);
    } else if (store.removeFromCart) {
      store.removeFromCart(targetId);
    }
  };

  const handleProceedCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      handleClose();
      navigate("/cart");
    }
  };

  const cartCount = actualCart.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  const subtotal = actualCart.reduce((sum, item) => {
    const itemId = String(item.productId ?? item._id ?? item.id ?? "");
    const itemSku = String(item.sku ?? "");
    const product =
      (products || []).find((entry) => {
        const entryId = String(entry._id ?? entry.id ?? "");
        const entrySku = String(entry.sku ?? "");
        return (
          (entryId && (entryId === itemId || entryId === itemSku)) ||
          (entrySku && (entrySku === itemId || entrySku === itemSku))
        );
      }) ||
      item.product ||
      item;

    const unitPrice = Number(product?.price ?? item.price ?? 0);
    return sum + unitPrice * (item.quantity || 1);
  }, 0);

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 99;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-stretch justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <button
        className="absolute inset-0 bg-text-dark/45 backdrop-blur-[2px] animate-fade-in"
        type="button"
        onClick={handleClose}
        aria-label="Close cart"
      />
      <aside
        className="relative flex h-full w-full max-w-[420px] flex-col bg-cream animate-slide-in-right"
        ref={panelRef}
      >
        <div className="flex items-center justify-between border-b border-cream-dark p-5 px-6 bg-white">
          <h2 className="flex items-center gap-2.5 text-text-dark font-display text-xl font-semibold">
            <Icon name="bag" className="h-5 w-5" />
            Your Cart
            <span className="rounded-full px-2.5 py-0.75 bg-blue-light text-text-dark font-body text-[11px] font-medium tracking-wide">
              {cartCount} items
            </span>
          </h2>
          <button
            className="flex h-11 w-11 items-center justify-center border border-cream-dark rounded-full bg-cream text-text-dark hover:bg-cream-dark/50 transition-colors"
            type="button"
            onClick={handleClose}
            aria-label="Close cart"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="p-4 px-6 border-b border-cream-dark bg-white">
          {remaining > 0 ? (
            <p className="text-xs text-text-muted">
              Add{" "}
              <span className="font-semibold text-text-dark">
                {formatPrice(remaining)}
              </span>{" "}
              more for Free Shipping!
            </p>
          ) : (
            <p className="text-xs font-medium text-blue-soft">
              Congratulations! You've unlocked Free Shipping.
            </p>
          )}
          <div className="mt-2 h-1.5 w-full bg-cream-dark/55 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-soft transition-all duration-350"
              style={{
                width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {actualCart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Icon name="box" className="w-16 h-16 mb-4 text-blue-soft/60" />
              <p className="text-text-dark font-display text-lg font-medium">
                Your cart is empty
              </p>
              <p className="text-xs text-text-muted mt-1 max-w-[200px]">
                Explore our collection to find your heirloom keepsake.
              </p>
            </div>
          ) : (
            actualCart.map((item) => {
              const itemId = item.productId || item._id || item.id;
              const product =
                (products || []).find((p) => (p._id || p.id) === itemId) ||
                item.product ||
                item;

              const name = product?.name || item.name || "Keepsake Companion";
              const price = Number(product?.price || item.price || 0);
              const image =
                item.image ||
                product?.image ||
                product?.images?.[0]?.url ||
                (typeof product?.images?.[0] === "string"
                  ? product.images[0]
                  : "") ||
                "https://via.placeholder.com/200x200?text=Starling+Tales";

              return (
                <div
                  key={`${itemId}-${item.selectedVariantKey || item.sku || "default"}`}
                  className="flex gap-4 p-4 rounded-xl border border-cream-dark bg-white shadow-2xs"
                >
                  <img
                    src={image}
                    alt={name}
                    className="w-18 h-18 object-contain rounded-lg bg-cream-dark/30 p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-text-dark text-sm truncate">
                      {name}
                    </h3>
                    {item.selectedVariant?.label && (
                      <p className="text-[11px] text-text-muted">
                        Variant: {item.selectedVariant.label}
                      </p>
                    )}
                    {item.customGiftMessage && (
                      <p className="text-[10px] text-text-muted italic truncate">
                        Message: "{item.customGiftMessage}"
                      </p>
                    )}
                    <p className="text-xs font-bold text-text-dark mt-1">
                      {formatPrice(price)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-cream-dark rounded-full bg-cream">
                        <button
                          type="button"
                          onClick={() =>
                            handleQty(
                              itemId,
                              item.sku,
                              (item.quantity || 1) - 1,
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center text-text-dark hover:bg-cream-dark/50 rounded-full text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-text-dark">
                          {item.quantity || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQty(
                              itemId,
                              item.sku,
                              (item.quantity || 1) + 1,
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center text-text-dark hover:bg-cream-dark/50 rounded-full text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(itemId, item.sku, item)}
                        className="text-[11px] text-rose-500 hover:text-rose-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Subtotal & Checkout */}
        {actualCart.length > 0 && (
          <div className="p-6 border-t border-cream-dark bg-white space-y-3">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
            </div>
            <div className="flex items-center justify-between font-display text-base font-bold text-text-dark pt-1 border-t border-cream-dark/50">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal + shipping)}</span>
            </div>

            <button
              type="button"
              onClick={handleProceedCheckout}
              className="w-full py-3.5 px-4 bg-text-dark text-cream hover:bg-text-dark/90 font-sans text-xs tracking-widest uppercase font-bold rounded-xl transition shadow-sm cursor-pointer"
            >
              Proceed to Keepsake Bag ({formatPrice(subtotal + shipping)})
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
