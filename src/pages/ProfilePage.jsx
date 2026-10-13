import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  PackageCheck,
  Heart,
  Calendar,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import {
  getAddressesApi,
  addAddressApi,
  deleteAddressApi,
  changePasswordApi,
} from "../services/authApi";
import { getMyOrdersApi } from "../services/orderApi";
import { formatPrice } from "../constants/constants";
import StarlingNavbar from "../components/StarlingNavbar";
import StarlingFooter from "../components/StarlingFooter";

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile, logout, openLoginModal, loading } = useAuth();
  const { wishlistCount } = useStore();

  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "addresses" | "orders" | "security"

  // Profile Edit State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "Haryana",
    postalCode: "",
    isDefault: false,
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Orders Summary State
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Sync profile data on user change
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob ? user.dob.split("T")[0] : "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  // Load addresses & recent orders when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoadingAddresses(true);
      getAddressesApi()
        .then((res) => {
          const list = Array.isArray(res) ? res : res?.addresses || [];
          setAddresses(list);
        })
        .finally(() => setIsLoadingAddresses(false));

      setIsLoadingOrders(true);
      getMyOrdersApi({ limit: 3 })
        .then((res) => {
          const list = Array.isArray(res) ? res : res?.orders || [];
          setRecentOrders(list);
        })
        .finally(() => setIsLoadingOrders(false));
    }
  }, [isAuthenticated]);

  // 1. Profile Validation & Save
  const validateProfile = () => {
    const errs = {};
    if (!profileData.name.trim() || profileData.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }
    if (!profileData.phone.trim() || profileData.phone.replace(/\D/g, "").length < 10) {
      errs.phone = "Please enter a valid 10-digit phone number.";
    }
    setProfileErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: profileData.name.trim(),
        phone: profileData.phone.trim(),
        dob: profileData.dob || undefined,
        gender: profileData.gender || undefined,
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 2. Address Validation & Add
  const validateAddress = () => {
    const errs = {};
    if (!newAddress.fullName.trim()) errs.fullName = "Recipient name is required.";
    if (!newAddress.phone.trim() || newAddress.phone.replace(/\D/g, "").length < 10) {
      errs.phone = "10-digit phone is required.";
    }
    if (!newAddress.street.trim()) errs.street = "Street address is required.";
    if (!newAddress.city.trim()) errs.city = "City is required.";
    if (!/^[1-9][0-9]{5}$/.test(newAddress.postalCode.trim())) {
      errs.postalCode = "Valid 6-digit Indian PIN code required.";
    }
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!validateAddress()) return;

    setIsSavingAddress(true);
    try {
      const added = await addAddressApi({
        ...newAddress,
        country: "India",
      });
      setAddresses((prev) => [...prev, added?.address || added || newAddress]);
      setShowAddressModal(false);
      setNewAddress({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "Haryana",
        postalCode: "",
        isDefault: false,
      });
      toast.success("Delivery sanctum recorded! 🌸");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save address.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm("Remove this delivery address from your profile?")) return;
    try {
      await deleteAddressApi(addrId);
      setAddresses((prev) => prev.filter((a) => (a._id || a.id) !== addrId));
      toast.success("Address removed.");
    } catch (_) {
      toast.error("Could not remove address.");
    }
  };

  // 3. Password Validation & Change
  const validatePassword = () => {
    const errs = {};
    if (!passwordData.currentPassword) {
      errs.currentPassword = "Current password is required.";
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      errs.newPassword = "New password must be at least 6 characters.";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }
    setPasswordErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsSavingPassword(true);
    try {
      await changePasswordApi({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Security credentials updated! 🔒");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#2C3E35] flex flex-col justify-between">
        <StarlingNavbar />
        <main className="flex-1 flex items-center justify-center p-6 py-28">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8DFC8]/60 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#37463f]/10 text-[#37463f] flex items-center justify-center mx-auto">
              <User size={32} />
            </div>
            <div className="space-y-1">
              <span className="font-serif italic text-xs text-[#C5A880] uppercase tracking-wider">
                Sanctuary Member Gate
              </span>
              <h1 className="font-serif text-2xl font-bold">Please Sign In</h1>
              <p className="text-xs text-neutral-500">
                Sign in to view and preserve your nursery chronicles, addresses, and custom hamper orders.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => openLoginModal()}
                className="w-full py-3.5 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md cursor-pointer transition-colors"
              >
                Sign In to Sanctuary
              </button>
              <Link
                to="/register"
                className="w-full py-3 bg-white border border-[#E8DFC8] text-[#2C3E35] rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF7F2] transition-colors"
              >
                Create an Account
              </Link>
            </div>
          </div>
        </main>
        <StarlingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C3E35] flex flex-col justify-between">
      <StarlingNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full flex-1 space-y-8">
        {/* Top Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8]/60 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF7F2] rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#37463f] text-[#FAF6F0] flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold shadow-md shrink-0 border border-[#E8DFC8]/40">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <span>{user?.name?.[0]?.toUpperCase() || "S"}</span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C3E35]">
                    {user?.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={10} /> Verified
                  </span>
                </div>
                <p className="text-xs text-neutral-500 flex items-center gap-2">
                  <Mail size={12} className="text-[#C5A880]" />
                  <span>{user?.email}</span>
                </p>
                {user?.phone && (
                  <p className="text-xs text-neutral-500 flex items-center gap-2">
                    <Phone size={12} className="text-[#C5A880]" />
                    <span>{user?.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Quick Metrics & Logout */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="flex items-center gap-4 bg-[#FAF7F2] px-4 py-2.5 rounded-2xl border border-[#E8DFC8]/50 text-xs">
                <Link to="/orders" className="text-center hover:opacity-80 transition-opacity">
                  <p className="font-bold text-[#37463f] text-sm">{recentOrders.length}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Orders</p>
                </Link>
                <div className="w-px h-6 bg-[#E8DFC8]" />
                <Link to="/wishlist" className="text-center hover:opacity-80 transition-opacity">
                  <p className="font-bold text-[#C5A880] text-sm">{wishlistCount || 0}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Wishlist</p>
                </Link>
              </div>

              <button
                onClick={logout}
                className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-4 border border-[#E8DFC8]/60 shadow-xs space-y-1.5">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer text-left ${
                activeTab === "profile"
                  ? "bg-[#37463f] text-[#FAF6F0] shadow-xs"
                  : "text-neutral-600 hover:bg-[#FAF7F2] hover:text-[#37463f]"
              }`}
            >
              <User size={16} />
              <span>Personal Chronicle</span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer text-left ${
                activeTab === "addresses"
                  ? "bg-[#37463f] text-[#FAF6F0] shadow-xs"
                  : "text-neutral-600 hover:bg-[#FAF7F2] hover:text-[#37463f]"
              }`}
            >
              <MapPin size={16} />
              <span>Delivery Sanctum ({addresses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer text-left ${
                activeTab === "orders"
                  ? "bg-[#37463f] text-[#FAF6F0] shadow-xs"
                  : "text-neutral-600 hover:bg-[#FAF7F2] hover:text-[#37463f]"
              }`}
            >
              <PackageCheck size={16} />
              <span>Keepsake Orders</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer text-left ${
                activeTab === "security"
                  ? "bg-[#37463f] text-[#FAF6F0] shadow-xs"
                  : "text-neutral-600 hover:bg-[#FAF7F2] hover:text-[#37463f]"
              }`}
            >
              <Lock size={16} />
              <span>Sanctuary Security</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8]/60 shadow-xs">
            {/* 1. PERSONAL DETAILS TAB */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="border-b border-[#E8DFC8]/40 pb-4">
                  <h2 className="font-serif text-xl font-bold text-[#2C3E35]">
                    Personal Chronicle
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Update your identity details for personalized milestone gifts and archival correspondence.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 bg-[#FAF7F2] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37463f]/30 ${
                        profileErrors.name ? "border-red-400" : "border-[#E8DFC8]"
                      }`}
                    />
                    {profileErrors.name && (
                      <p className="text-[11px] text-red-500 mt-1">{profileErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Email Address (Locked)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={profileData.email}
                      className="w-full px-4 py-2.5 bg-neutral-100 border border-[#E8DFC8]/50 rounded-xl text-neutral-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 bg-[#FAF7F2] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37463f]/30 ${
                        profileErrors.phone ? "border-red-400" : "border-[#E8DFC8]"
                      }`}
                    />
                    {profileErrors.phone && (
                      <p className="text-[11px] text-red-500 mt-1">{profileErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profileData.dob}
                      onChange={(e) =>
                        setProfileData({ ...profileData, dob: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-3 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
                  >
                    <Save size={14} />
                    <span>{isSavingProfile ? "Preserving..." : "Save Changes"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* 2. DELIVERY ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#E8DFC8]/40 pb-4">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#2C3E35]">
                      Delivery Sanctum
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Manage safe destination residences for rapid 1-click hamper checkout.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-3.5 py-2 bg-[#37463f] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 shadow-xs hover:bg-[#2C3E35] transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Address</span>
                  </button>
                </div>

                {isLoadingAddresses ? (
                  <p className="py-8 text-center text-xs text-neutral-400 italic">
                    Retrieving recorded destinations...
                  </p>
                ) : addresses.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <MapPin size={36} className="mx-auto text-neutral-300" />
                    <p className="text-xs text-neutral-500">No saved delivery addresses yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]/70 space-y-2 relative"
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-xs text-[#2C3E35]">
                            {addr.fullName || addr.name || user.name}
                          </p>
                          <button
                            onClick={() => handleDeleteAddress(addr._id || addr.id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                            title="Delete Address"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          {addr.street || addr.address}
                          <br />
                          {addr.city}, {addr.state} - {addr.postalCode || addr.zip}
                        </p>
                        <p className="text-[11px] text-neutral-500 flex items-center gap-1">
                          <Phone size={10} /> {addr.phone || user.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. RECENT ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#E8DFC8]/40 pb-4">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#2C3E35]">
                      Recent Keepsakes
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Revisit recent gift hamper chronicles and check live delivery status.
                    </p>
                  </div>
                  <Link
                    to="/orders"
                    className="text-xs font-semibold text-[#37463f] hover:underline"
                  >
                    View All Orders →
                  </Link>
                </div>

                {isLoadingOrders ? (
                  <p className="py-8 text-center text-xs text-neutral-400 italic">
                    Loading order archives...
                  </p>
                ) : recentOrders.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <PackageCheck size={36} className="mx-auto text-neutral-300" />
                    <p className="text-xs text-neutral-500">No orders placed yet.</p>
                    <Link
                      to="/products"
                      className="inline-block px-4 py-2 bg-[#37463f] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-wider"
                    >
                      Browse Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((ord) => (
                      <div
                        key={ord._id}
                        className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]/60 flex items-center justify-between gap-4 text-xs"
                      >
                        <div>
                          <p className="font-mono font-bold text-neutral-800">
                            #{ord.orderNumber || ord._id}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            {ord.items?.length || 1} item(s) • {formatPrice(ord.totalPrice || ord.total || 0)}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          {ord.orderStatus || "Processing"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. SANCTUARY SECURITY TAB */}
            {activeTab === "security" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="border-b border-[#E8DFC8]/40 pb-4">
                  <h2 className="font-serif text-xl font-bold text-[#2C3E35]">
                    Sanctuary Security
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Update your password credentials to safeguard your chronicle account.
                  </p>
                </div>

                <div className="max-w-md space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Current Password *
                    </label>
                    <div className="relative">
                      <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                      />
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-[11px] text-red-500 mt-1">{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      New Password *
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="At least 6 characters"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                      />
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-[11px] text-red-500 mt-1">{passwordErrors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="password"
                        required
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37463f]/30"
                      />
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-[11px] text-red-500 mt-1">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="px-6 py-3 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
                  >
                    <Lock size={14} />
                    <span>{isSavingPassword ? "Updating..." : "Update Password"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Modal: Add Address */}
        {showAddressModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowAddressModal(false)}
          >
            <div
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8]/60 shadow-2xl space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-[#E8DFC8]/40 pb-3">
                <h3 className="font-serif text-lg font-bold">Record Delivery Sanctum</h3>
                <p className="text-xs text-neutral-500">
                  Save a shipping address for future doorstep parcel dispatches.
                </p>
              </div>

              <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Eleanor Vance"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      6-Digit PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="122003"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Street Address / House *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Flat 3A, Silver Oak Enclave"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Gurugram"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full px-4 py-2 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E8DFC8]/40">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 border border-[#E8DFC8] text-neutral-600 rounded-xl hover:bg-neutral-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingAddress}
                    className="px-5 py-2 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl font-semibold uppercase tracking-wide cursor-pointer disabled:opacity-60"
                  >
                    {isSavingAddress ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <StarlingFooter />
    </div>
  );
}
