import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PackageCheck,
  Calendar,
  Clock,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Truck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyOrdersApi } from "../services/orderApi";
import { formatPrice } from "../constants/constants";
import StarlingNavbar from "../components/StarlingNavbar";
import StarlingFooter from "../components/StarlingFooter";

export default function OrdersPage() {
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getMyOrdersApi()
      .then((res) => {
        const orderList = Array.isArray(res)
          ? res
          : Array.isArray(res?.orders)
          ? res.orders
          : [];
        setOrders(orderList);
      })
      .catch((err) => {
        console.warn("Could not fetch user orders:", err);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C3E35] flex flex-col justify-between">
      <StarlingNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full flex-1">
        <div className="space-y-2 mb-8">
          <span className="font-serif italic text-xs text-[#C5A880] uppercase tracking-wider">
            Chronicle Archives
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#2C3E35]">
            My Keepsake Orders
          </h1>
          <p className="text-xs text-neutral-500">
            Track past deliveries, view archival receipts, and revisit your custom gift hampers.
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="bg-white rounded-3xl p-10 border border-[#E8DFC8]/60 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <PackageCheck size={44} className="mx-auto text-neutral-300" />
            <h2 className="font-serif text-xl font-bold">Please Sign In</h2>
            <p className="text-xs text-neutral-500">
              Sign in to view orders linked to your Starling Tales account.
            </p>
            <button
              onClick={() => openLoginModal()}
              className="px-6 py-3 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-md transition-colors"
            >
              Sign In to Sanctuary
            </button>
          </div>
        ) : loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#37463f] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif italic text-xs text-neutral-500">
              Retrieving your archive records...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-[#E8DFC8]/60 text-center max-w-md mx-auto space-y-5 shadow-xs">
            <ShoppingBag size={48} className="mx-auto text-neutral-300" />
            <div className="space-y-1">
              <h2 className="font-serif text-xl font-bold">No Orders Recorded Yet</h2>
              <p className="text-xs text-neutral-500">
                You haven't commissioned any keepsakes or hampers yet.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md transition-colors"
            >
              Explore Nursery Tales
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderId = order.orderNumber || order._id;
              const dateStr = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Recent";

              const isPaid =
                order.paymentInfo?.status === "Paid" ||
                order.isPaid ||
                order.paymentMethod === "ONLINE";

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DFC8]/60 shadow-xs space-y-5"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DFC8]/40 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FAF7F2] text-[#37463f] flex items-center justify-center border border-[#E8DFC8]/60 shrink-0">
                        <PackageCheck size={18} />
                      </div>
                      <div>
                        <p className="font-mono font-bold text-neutral-900">
                          #{orderId}
                        </p>
                        <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                          <Calendar size={11} />
                          <span>Placed on {dateStr}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.orderStatus === "Delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.orderStatus === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.orderStatus || "Processing"}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isPaid
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {isPaid ? "Paid" : "COD Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-[#E8DFC8]/30">
                    {(order.items || []).map((it, idx) => (
                      <div key={idx} className="py-3 flex items-center gap-4 text-xs">
                        <img
                          src={
                            it.image ||
                            it.product?.images?.[0]?.url ||
                            (typeof it.product?.images?.[0] === "string"
                              ? it.product.images[0]
                              : "") ||
                            "https://via.placeholder.com/80x80?text=Item"
                          }
                          alt={it.name || "Item"}
                          className="w-14 h-14 rounded-xl object-contain bg-[#FAF7F2] border border-[#E8DFC8]/40 shrink-0 p-1"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-neutral-900 truncate">
                            {it.name || it.product?.name || "Keepsake Piece"}
                          </p>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            Quantity: {it.quantity || 1}
                          </p>
                        </div>
                        <span className="font-semibold text-neutral-800 shrink-0">
                          {formatPrice((it.price || 0) * (it.quantity || 1))}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer Total & Address */}
                  <div className="pt-3 border-t border-[#E8DFC8]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
                      <Truck size={13} className="text-[#C5A880]" />
                      <span>
                        Destination: {order.shippingAddress?.city || "Customer Address"},{" "}
                        {order.shippingAddress?.postalCode || order.shippingAddress?.zip || ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-neutral-500 text-xs">Grand Total:</span>
                      <span className="font-serif text-base font-bold text-[#37463f]">
                        {formatPrice(order.totalPrice || order.total || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <StarlingFooter />
    </div>
  );
}
