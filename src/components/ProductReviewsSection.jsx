import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  X,
  Send,
  AlertCircle,
  Plus,
  ShieldCheck,
  Search,
  Filter,
  Camera,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Maximize2,
  Lock,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getProductReviews,
  createReview,
  toggleReviewHelpful,
} from "../services/reviewApi";
import { ReviewSkeleton } from "./StarlingSkeletons";

export default function ProductReviewsSection({
  productId,
  productName = "Keepsake Treasure",
  initialRating = 5,
  initialReviewCount = 0,
}) {
  const { isAuthenticated, user, openLoginModal } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search & Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [starFilter, setStarFilter] = useState(0); // 0 = All, 1..5
  const [photosOnly, setPhotosOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recent"); // "recent" | "highest" | "lowest" | "helpful"
  const [visibleCount, setVisibleCount] = useState(5);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Create Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState(true);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Helpful click tracker (local reviewId -> boolean)
  const [helpfulVoted, setHelpfulVoted] = useState({});

  // Backend Stats (if provided by API)
  const [backendStats, setBackendStats] = useState(null);

  // Fetch reviews on mount or productId change
  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getProductReviews(productId)
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res) ? res : res?.reviews || [];
        setReviews(list);
        if (res?.stats) {
          setBackendStats(res.stats);
        }
      })
      .catch((err) => {
        console.warn("Could not load product reviews:", err?.message);
        if (isMounted) setReviews([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  // Comprehensive rating statistics
  const stats = useMemo(() => {
    if (backendStats && backendStats.totalReviews > 0) {
      return {
        avg: backendStats.averageRating || 5,
        total: backendStats.totalReviews,
        distribution: backendStats.ratingDistribution || {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
        recommendPercent: backendStats.recommendPercentage || 100,
      };
    }

    if (!reviews || reviews.length === 0) {
      return {
        avg: initialRating || 5,
        total: initialReviewCount || 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recommendPercent: 100,
      };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = Number((sum / total).toFixed(1));

    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let recommendCount = 0;

    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      dist[star] = (dist[star] || 0) + 1;
      if (r.recommend !== false && (r.rating || 5) >= 4) {
        recommendCount += 1;
      }
    });

    return {
      avg,
      total,
      distribution: dist,
      recommendPercent: Math.round((recommendCount / total) * 100),
    };
  }, [reviews, backendStats, initialRating, initialReviewCount]);

  // Filtered and Sorted Reviews
  const filteredAndSortedReviews = useMemo(() => {
    let list = [...reviews];

    // Star Filter
    if (starFilter > 0) {
      list = list.filter(
        (r) => Math.round(Number(r.rating) || 5) === starFilter,
      );
    }

    // Photos Only Filter
    if (photosOnly) {
      list = list.filter((r) => Array.isArray(r.images) && r.images.length > 0);
    }

    // Verified Purchases Only
    if (verifiedOnly) {
      list = list.filter((r) => r.verifiedPurchase !== false);
    }

    // Search Query (in title, comment, author name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((r) => {
        const titleMatch = r.title && r.title.toLowerCase().includes(q);
        const commentMatch = r.comment && r.comment.toLowerCase().includes(q);
        const author = (
          r.user?.name ||
          r.userName ||
          r.name ||
          ""
        ).toLowerCase();
        return titleMatch || commentMatch || author.includes(q);
      });
    }

    // Sorting
    if (sortBy === "recent") {
      list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    } else if (sortBy === "highest") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "lowest") {
      list.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    } else if (sortBy === "helpful") {
      const getHelpfulCount = (rev) =>
        Array.isArray(rev.helpful) ? rev.helpful.length : rev.helpfulCount || 0;
      list.sort((a, b) => getHelpfulCount(b) - getHelpfulCount(a));
    }

    return list;
  }, [reviews, starFilter, photosOnly, verifiedOnly, searchQuery, sortBy]);

  // Handle Image File Selection for Review
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (imageFiles.length + files.length > 4) {
      toast.error("You can upload a maximum of 4 photos per review.");
      return;
    }

    const nextFiles = [...imageFiles, ...files].slice(0, 4);
    setImageFiles(nextFiles);

    // Create object URLs for previews
    const previews = nextFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleRemoveImage = (indexToRemove) => {
    const nextFiles = imageFiles.filter((_, idx) => idx !== indexToRemove);
    setImageFiles(nextFiles);
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Toggle Helpful Vote
  const handleToggleHelpful = async (reviewId) => {
    if (!reviewId) return;

    if (!isAuthenticated) {
      toast.error("Please sign in to vote on keepsake reviews ✨");
      if (openLoginModal) openLoginModal();
      return;
    }

    try {
      const res = await toggleReviewHelpful(reviewId);
      const isCurrentlyVoted = helpfulVoted[reviewId];

      setHelpfulVoted((prev) => ({ ...prev, [reviewId]: !isCurrentlyVoted }));
      setReviews((prev) =>
        prev.map((r) => {
          if (r._id === reviewId) {
            const currentCount = Array.isArray(r.helpful)
              ? r.helpful.length
              : r.helpfulCount || 0;
            const updatedCount =
              res?.helpfulCount ??
              (isCurrentlyVoted
                ? Math.max(0, currentCount - 1)
                : currentCount + 1);
            return {
              ...r,
              helpfulCount: updatedCount,
              helpful: new Array(updatedCount).fill("vote"),
            };
          }
          return r;
        }),
      );
    } catch (_) {
      toast.error("Could not record vote. Please try again.");
    }
  };

  // Reset Filters helper
  const handleResetFilters = () => {
    setStarFilter(0);
    setPhotosOnly(false);
    setVerifiedOnly(false);
    setSearchQuery("");
    setSortBy("recent");
  };

  const hasActiveFilters =
    starFilter > 0 ||
    photosOnly ||
    verifiedOnly ||
    searchQuery.trim().length > 0;

  // Submit Review Form
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!isAuthenticated) {
      setFormError(
        "Please sign in to your sanctuary account to chronicle a review.",
      );
      return;
    }

    if (!rating) {
      setFormError("Please select a star rating for this keepsake.");
      return;
    }

    if (!comment || comment.trim().length < 10) {
      setFormError(
        "Please share at least 10 characters describing your experience.",
      );
      return;
    }

    setSubmitting(true);

    try {
      let payload;

      // If user uploaded images, package as FormData
      if (imageFiles.length > 0) {
        payload = new FormData();
        payload.append("reviewType", "product");
        payload.append("reviewFor", productId);
        payload.append("rating", String(rating));
        payload.append(
          "title",
          title.trim() || `${rating} Star Keepsake Review`,
        );
        payload.append("comment", comment.trim());
        payload.append("recommend", String(recommend));
        imageFiles.forEach((file) => {
          payload.append("images", file);
        });
      } else {
        payload = {
          reviewType: "product",
          reviewFor: productId,
          rating: Number(rating),
          title: title.trim() || `${rating} Star Keepsake Review`,
          comment: comment.trim(),
          recommend,
        };
      }

      const res = await createReview(payload);
      const createdReview = res?.review || {
        _id: `rev-${Date.now()}`,
        user: { name: user?.name || "Verified Patron", avatar: user?.avatar },
        rating,
        title: title.trim() || `${rating} Star Keepsake Review`,
        comment: comment.trim(),
        recommend,
        verifiedPurchase: true,
        createdAt: new Date().toISOString(),
        images: imagePreviews.map((url) => ({ url })),
        helpful: [],
      };

      setReviews((prev) => [createdReview, ...prev]);
      toast.success("Thank you! Your keepsake review has been chronicled ✨");

      // Reset Modal Form
      setIsModalOpen(false);
      setTitle("");
      setComment("");
      setRating(5);
      setImageFiles([]);
      setImagePreviews([]);
      setFormError("");
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not submit review. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (val) => {
    switch (val) {
      case 5:
        return "Exceptional Heirloom Treasure! (5/5)";
      case 4:
        return "Very Pleased & Delightful (4/5)";
      case 3:
        return "Good Keepsake Experience (3/5)";
      case 2:
        return "Fair Quality (2/5)";
      case 1:
        return "Needs Improvement (1/5)";
      default:
        return "Select Your Star Rating";
    }
  };

  return (
    <section id="reviews-section" className="py-8 space-y-8 text-[#2C3E35]">
      {/* ================= REVIEWS SECTION HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFC8]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[#C5A880] text-xs font-serif uppercase tracking-widest font-semibold mb-1">
            <Sparkles size={13} />
            <span>Patron Chronicles & Feedback</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C3E35] tracking-tight">
            Customer Reviews ({stats.total})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated && openLoginModal) {
              openLoginModal();
              return;
            }
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] text-xs font-serif font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0 group"
        >
          <Plus
            size={14}
            className="group-hover:rotate-90 transition-transform"
          />
          <span>Write a Review</span>
        </button>
      </div>

      {/* ================= RATING SUMMARY CARD ================= */}
      <div className="p-6 sm:p-8 bg-[#FAF7F2] rounded-3xl border border-[#E8DFC8]/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-xs">
        {/* Left Col: Overall Rating */}
        <div className="md:col-span-4 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-[#E8DFC8]/70 pb-6 md:pb-0 md:pr-6">
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-[#2C3E35]">
              {stats.avg.toFixed(1)}
            </span>
            <span className="text-sm text-neutral-500 font-light">
              out of 5.0
            </span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-1 text-[#C5A880]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={
                  star <= Math.round(stats.avg)
                    ? "fill-[#C5A880] text-[#C5A880]"
                    : "text-neutral-300"
                }
              />
            ))}
          </div>

          <p className="text-xs text-neutral-500">
            Based on {stats.total} verified patron chronicle
            {stats.total === 1 ? "" : "s"}
          </p>

          <div className="pt-2 flex items-center justify-center md:justify-start gap-1.5 text-xs text-emerald-800 font-medium">
            <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
            <span>
              {stats.recommendPercent}% of patrons recommend this keepsake
            </span>
          </div>
        </div>

        {/* Right Col: Interactive Star Breakdown */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.distribution[star] || 0;
            const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
            const isSelected = starFilter === star;

            return (
              <button
                key={star}
                type="button"
                onClick={() => setStarFilter(isSelected ? 0 : star)}
                className={`w-full flex items-center gap-3 text-xs p-1 rounded-xl transition-all group text-left cursor-pointer ${
                  isSelected
                    ? "bg-white/80 shadow-xs ring-1 ring-[#C5A880]"
                    : "hover:bg-white/50"
                }`}
              >
                <span className="w-14 text-neutral-700 font-medium flex items-center gap-1 shrink-0">
                  <span>{star}</span>
                  <Star size={11} className="fill-[#C5A880] text-[#C5A880]" />
                  <span className="text-[10px] text-neutral-400">star</span>
                </span>

                <div className="flex-1 h-2.5 rounded-full bg-white border border-[#E8DFC8]/60 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C5A880] to-[#37463f] rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="w-14 text-right text-neutral-500 font-mono text-[11px] shrink-0">
                  {count} ({Math.round(percent)}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= SEARCH & FILTER CONTROL BAR ================= */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Keyword Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search reviews by keyword (e.g. stitching, softness, packaging)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1.5 focus:ring-[#37463f] focus:border-[#37463f] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <span className="text-xs text-neutral-500 font-serif">
              Sort by:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-[#E8DFC8] rounded-xl pl-3 pr-8 py-1.5 text-xs text-neutral-800 font-medium outline-none focus:ring-1.5 focus:ring-[#37463f] cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-neutral-400 text-[11px] font-medium mr-1 flex items-center gap-1">
            <Filter size={11} />
            <span>Filter:</span>
          </span>

          {/* All Filter */}
          <button
            type="button"
            onClick={() => setStarFilter(0)}
            className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
              starFilter === 0
                ? "bg-[#37463f] text-[#FAF6F0] font-semibold"
                : "bg-white border border-[#E8DFC8] text-neutral-600 hover:bg-[#FAF7F2]"
            }`}
          >
            All
          </button>

          {/* Star filters 5 down to 1 */}
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setStarFilter(starFilter === star ? 0 : star)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                starFilter === star
                  ? "bg-[#37463f] text-[#FAF6F0] font-semibold"
                  : "bg-white border border-[#E8DFC8] text-neutral-600 hover:bg-[#FAF7F2]"
              }`}
            >
              <span>{star}</span>
              <Star size={11} className="fill-[#C5A880] text-[#C5A880]" />
            </button>
          ))}

          {/* Photos only toggle */}
          <button
            type="button"
            onClick={() => setPhotosOnly(!photosOnly)}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
              photosOnly
                ? "bg-[#C5A880] text-[#2C3E35] font-semibold"
                : "bg-white border border-[#E8DFC8] text-neutral-600 hover:bg-[#FAF7F2]"
            }`}
          >
            <Camera size={12} />
            <span>With Photos</span>
          </button>

          {/* Verified toggle */}
          <button
            type="button"
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
              verifiedOnly
                ? "bg-emerald-800 text-white font-semibold"
                : "bg-white border border-[#E8DFC8] text-neutral-600 hover:bg-[#FAF7F2]"
            }`}
          >
            <ShieldCheck size={12} />
            <span>Verified Patrons</span>
          </button>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="ml-auto inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-800 underline cursor-pointer"
            >
              <RotateCcw size={11} />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Filter results info banner */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]/60 text-[11px] text-neutral-600">
            <span>
              Showing {filteredAndSortedReviews.length} matching review
              {filteredAndSortedReviews.length === 1 ? "" : "s"}
            </span>
            <span className="text-neutral-400">Filtered View</span>
          </div>
        )}
      </div>

      {/* ================= REVIEWS LIST ================= */}
      {loading ? (
        <ReviewSkeleton count={3} />
      ) : filteredAndSortedReviews.length === 0 ? (
        <div className="p-10 text-center rounded-3xl bg-[#FAF7F2] border border-[#E8DFC8]/80 space-y-4">
          <div className="w-12 h-12 rounded-full bg-white text-[#C5A880] flex items-center justify-center mx-auto shadow-xs border border-[#E8DFC8]/60">
            <MessageSquare size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-semibold text-[#2C3E35]">
              {hasActiveFilters
                ? "No Matching Chronicles Found"
                : "No Reviews Chronicled Yet"}
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {hasActiveFilters
                ? "Try relaxing your search terms or star rating filters to discover more patron experiences."
                : "Be the first patron to share your heartfelt thoughts, keepsake quality, and unboxing moments."}
            </p>
          </div>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2 rounded-full bg-white border border-[#E8DFC8] text-[#37463f] text-xs font-semibold shadow-xs hover:bg-[#FAF7F2] cursor-pointer"
            >
              Clear Filter Settings
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated && openLoginModal) {
                  openLoginModal();
                } else {
                  setIsModalOpen(true);
                }
              }}
              className="px-6 py-2.5 rounded-full bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold shadow-sm cursor-pointer"
            >
              Write the First Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedReviews.slice(0, visibleCount).map((rev) => {
            const authorName =
              rev.user?.name || rev.userName || rev.name || "Patron of Wonder";
            const userAvatar = rev.user?.avatar || rev.user?.profileImage;

            const revDate = rev.createdAt
              ? new Date(rev.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Verified Milestone";

            const helpfulCount = Array.isArray(rev.helpful)
              ? rev.helpful.length
              : rev.helpfulCount || 0;

            const isVoted = helpfulVoted[rev._id];

            return (
              <article
                key={rev._id || Math.random()}
                className="p-5 sm:p-6 bg-white rounded-3xl border border-[#E8DFC8]/80 shadow-2xs space-y-4 transition-all hover:border-[#C5A880]/60 hover:shadow-xs"
              >
                {/* Header: Author + Verified + Rating + Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={authorName}
                        className="w-10 h-10 rounded-full object-cover border border-[#C5A880]/40 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#37463f] to-[#2C3E35] text-[#FAF6F0] flex items-center justify-center font-serif text-sm font-bold shadow-xs shrink-0">
                        {authorName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-xs text-[#2C3E35]">
                          {authorName}
                        </span>

                        {rev.verifiedPurchase !== false && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                            <CheckCircle2
                              size={10}
                              className="text-emerald-600"
                            />
                            Verified Patron
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400">
                        {revDate}
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars & Recommendation Badge */}
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    {rev.recommend !== false && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#C5A880] bg-[#C5A880]/10 px-2.5 py-0.5 rounded-full border border-[#C5A880]/30 font-medium">
                        <Check size={10} />
                        Recommends
                      </span>
                    )}

                    <div className="flex items-center gap-1 text-[#C5A880]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={
                            s <= (rev.rating || 5)
                              ? "fill-[#C5A880] text-[#C5A880]"
                              : "text-neutral-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Title & Comment */}
                <div className="space-y-1.5">
                  {rev.title && (
                    <h4 className="font-serif font-bold text-sm text-[#2C3E35] leading-snug">
                      {rev.title}
                    </h4>
                  )}
                  <p className="text-xs text-neutral-600 leading-relaxed font-light whitespace-pre-line">
                    {rev.comment}
                  </p>
                </div>

                {/* Review Images Gallery */}
                {Array.isArray(rev.images) && rev.images.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block mb-1.5">
                      Customer Unboxing Photos
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {rev.images.map((img, i) => {
                        const imgUrl = typeof img === "string" ? img : img.url;
                        return (
                          <div
                            key={i}
                            onClick={() => setPreviewImage(imgUrl)}
                            className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#E8DFC8] cursor-pointer group shadow-2xs"
                          >
                            <img
                              src={imgUrl}
                              alt="Customer unboxing keepsake"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <Maximize2 size={14} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Curator / Store Reply Callout */}
                {rev.reply && rev.reply.comment && (
                  <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#C5A880]/40 space-y-1.5 mt-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-serif font-bold text-[#37463f]">
                      <Sparkles size={12} className="text-[#C5A880]" />
                      <span>Response from Starling Tales Sanctuary:</span>
                    </div>
                    <p className="text-xs text-neutral-700 font-light italic leading-relaxed pl-4 border-l-2 border-[#C5A880]/60">
                      "{rev.reply.comment}"
                    </p>
                  </div>
                )}

                {/* Card Footer: Helpful Action */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-[#E8DFC8]/40">
                  <span className="italic font-serif text-[#C5A880]">
                    Sanctuary Verified Record
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleHelpful(rev._id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer ${
                      isVoted
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold"
                        : "border-[#E8DFC8]/80 text-neutral-500 hover:text-neutral-800 hover:border-neutral-400 bg-white"
                    }`}
                  >
                    <ThumbsUp
                      size={12}
                      className={isVoted ? "fill-emerald-700" : ""}
                    />
                    <span>Helpful ({helpfulCount})</span>
                  </button>
                </div>
              </article>
            );
          })}

          {/* Show More Reviews Button */}
          {filteredAndSortedReviews.length > visibleCount && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 5)}
                className="px-6 py-2.5 bg-white hover:bg-[#FAF7F2] border border-[#E8DFC8] rounded-full text-xs font-serif font-bold text-[#37463f] shadow-xs hover:shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Load More Patron Reviews</span>
                <ChevronDown size={13} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= LIGHTBOX IMAGE MODAL ================= */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-white rounded-3xl p-3 shadow-2xl border border-white/20 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition cursor-pointer"
              aria-label="Close image preview"
            >
              <X size={18} />
            </button>
            <img
              src={previewImage}
              alt="Customer unboxing high resolution"
              className="w-full h-auto max-h-[75vh] rounded-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* ================= WRITE A REVIEW MODAL ================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-3xl border border-[#E8DFC8] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#37463f] text-[#FAF6F0] p-6 text-center relative shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-[#FAF6F0]/70 hover:text-[#FAF6F0] hover:bg-white/10 transition cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-[#C5A880] text-xs font-serif italic mb-2">
                <Sparkles size={12} />
                <span>Patron Experience & Chronicle</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF6F0]">
                Write a Keepsake Review
              </h3>
              <p className="text-xs text-[#FAF6F0]/80 mt-1 truncate max-w-sm mx-auto">
                {productName}
              </p>
            </div>

            {/* Modal Body / Auth Gate or Form */}
            <div className="p-6 overflow-y-auto space-y-4">
              {!isAuthenticated ? (
                /* Unauthenticated Gate */
                <div className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E8DFC8] text-[#37463f] flex items-center justify-center mx-auto shadow-xs">
                    <Lock size={22} />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-serif text-lg font-bold text-[#2C3E35]">
                      Sign In to Review This Keepsake
                    </h4>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                      Only verified patrons with a Starling Tales sanctuary
                      account may chronicle reviews and share unboxing
                      impressions.
                    </p>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        if (openLoginModal) openLoginModal();
                      }}
                      className="px-6 py-3 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-serif font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      Sign In to Your Chronicle
                    </button>
                  </div>
                </div>
              ) : (
                /* Review Submission Form */
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Patron Identity Badge */}
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFC8]/70 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#37463f] text-[#FAF6F0] flex items-center justify-center font-serif text-xs font-bold shrink-0">
                      {(user?.name || "P").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-800">
                        Reviewing as {user?.name || "Verified Patron"}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Interactive Star Rating */}
                  <div className="space-y-1.5 text-center py-2 bg-[#FAF7F2]/60 rounded-2xl border border-[#E8DFC8]/50">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                      Overall Rating *
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 transition-transform hover:scale-120 cursor-pointer"
                        >
                          <Star
                            size={30}
                            className={
                              star <= (hoverRating || rating)
                                ? "fill-[#C5A880] text-[#C5A880]"
                                : "text-neutral-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-xs font-serif font-bold text-[#37463f]">
                      {getRatingLabel(hoverRating || rating)}
                    </p>
                  </div>

                  {/* Review Title */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Review Headline *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Incredibly soft, arrived in pristine botanical packaging!"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 outline-none focus:ring-1.5 focus:ring-[#37463f] focus:border-[#37463f]"
                    />
                  </div>

                  {/* Detailed Experience */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Detailed Experience & Craft Impressions *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Share your thoughts on the fabrics, heirloom stitching, unboxing wonder, delivery care, and baby reaction..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 outline-none focus:ring-1.5 focus:ring-[#37463f] focus:border-[#37463f] leading-relaxed"
                    />
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                      <span>Minimum 10 characters</span>
                      <span>{comment.length} characters written</span>
                    </div>
                  </div>

                  {/* Customer Photo Upload */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                      Add Keepsake Photos (Optional, max 4)
                    </label>

                    <div className="space-y-2">
                      {/* Upload trigger button */}
                      <label className="flex items-center justify-center gap-2 p-3 bg-[#FAF7F2] border border-dashed border-[#C5A880] rounded-xl cursor-pointer hover:bg-white transition-colors">
                        <Camera size={16} className="text-[#C5A880]" />
                        <span className="text-xs font-medium text-neutral-700">
                          Click to select photos from device
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>

                      {/* Image Preview thumbnails */}
                      {imagePreviews.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {imagePreviews.map((url, idx) => (
                            <div
                              key={idx}
                              className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E8DFC8] shadow-2xs group"
                            >
                              <img
                                src={url}
                                alt="Selected preview"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/90 transition cursor-pointer"
                                aria-label="Remove image"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommend Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700 pt-1 select-none">
                    <input
                      type="checkbox"
                      checked={recommend}
                      onChange={(e) => setRecommend(e.target.checked)}
                      className="w-4 h-4 rounded border-[#E8DFC8] text-[#37463f] focus:ring-[#37463f]"
                    />
                    <span>
                      I recommend this heirloom keepsake to other patrons
                    </span>
                  </label>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#E8DFC8]/60 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 text-xs text-neutral-500 hover:text-neutral-800 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? (
                        <span>Chronicing Your Review...</span>
                      ) : (
                        <>
                          <span>Submit Keepsake Review</span>
                          <Send size={13} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
