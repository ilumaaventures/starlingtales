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
  Award,
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
  const { isAuthenticated, user, openAuthModal } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState(true);
  const [formError, setFormError] = useState("");

  // Helpful click tracker
  const [helpfulVoted, setHelpfulVoted] = useState({});

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

  // Rating Statistics Calculation
  const stats = useMemo(() => {
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
      if (r.rating >= 4) recommendCount += 1;
    });

    return {
      avg,
      total,
      distribution: dist,
      recommendPercent: Math.round((recommendCount / total) * 100),
    };
  }, [reviews, initialRating, initialReviewCount]);

  // Sorted Reviews
  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    if (sortBy === "recent") {
      return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    if (sortBy === "highest") {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    if (sortBy === "lowest") {
      return list.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    }
    return list;
  }, [reviews, sortBy]);

  // Helpful Toggle Handler
  const handleToggleHelpful = async (reviewId) => {
    if (!reviewId) return;

    if (!isAuthenticated) {
      toast.error("Please sign in to vote on reviews.");
      return;
    }

    try {
      const res = await toggleReviewHelpful(reviewId);
      const newCount = res?.helpfulCount ?? 1;

      setHelpfulVoted((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? {
                ...r,
                helpful: new Array(newCount).fill("user"),
                helpfulCount: newCount,
              }
            : r
        )
      );
    } catch (_) {
      toast.error("Could not update helpful vote.");
    }
  };

  // Submit Review Handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!isAuthenticated) {
      setFormError("Please sign in to your sanctuary account to submit a review.");
      return;
    }

    if (!rating) {
      setFormError("Please select a star rating.");
      return;
    }

    if (!comment || comment.trim().length < 10) {
      setFormError("Please share at least 10 characters describing your experience.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        reviewType: "product",
        reviewFor: productId,
        rating: Number(rating),
        title: title.trim() || `${rating} Star Keepsake Review`,
        comment: comment.trim(),
        recommend,
      };

      const res = await createReview(payload);
      const createdReview = res?.review || {
        _id: `rev-${Date.now()}`,
        user: { name: user?.name || "Verified Patron" },
        rating,
        title: payload.title,
        comment: payload.comment,
        verifiedPurchase: true,
        createdAt: new Date().toISOString(),
        helpful: [],
      };

      setReviews((prev) => [createdReview, ...prev]);
      toast.success("Thank you! Your review has been chronicled successfully ✨");
      setIsModalOpen(false);

      // Reset form
      setTitle("");
      setComment("");
      setRating(5);
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not submit review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (val) => {
    switch (val) {
      case 5:
        return "Exceptional Keepsake! (5/5)";
      case 4:
        return "Very Good Quality (4/5)";
      case 3:
        return "Average Experience (3/5)";
      case 2:
        return "Fair (2/5)";
      case 1:
        return "Needs Improvement (1/5)";
      default:
        return "Select Rating";
    }
  };

  return (
    <section id="reviews-section" className="py-8 space-y-8 text-[#2C3E35]">
      {/* Reviews Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFC8]">
        <div>
          <div className="inline-flex items-center gap-1 text-[#C5A880] text-xs font-serif uppercase tracking-widest font-semibold mb-1">
            <Sparkles size={12} />
            <span>Patron Chronicles & Feedback</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2C3E35]">
            Customer Reviews ({stats.total})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              toast.error("Please sign in to write a review ✨");
            }
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0"
        >
          <Plus size={14} />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Rating Summary Card */}
      <div className="p-6 sm:p-8 bg-[#FAF7F2] rounded-3xl border border-[#E8DFC8]/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Overall Score */}
        <div className="md:col-span-4 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-[#E8DFC8]/60 pb-6 md:pb-0 md:pr-6">
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-[#2C3E35]">
              {stats.avg.toFixed(1)}
            </span>
            <span className="text-sm text-neutral-500 font-light">/ 5.0</span>
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
            Based on {stats.total} verified patron reviews
          </p>

          <div className="pt-2 flex items-center justify-center md:justify-start gap-1.5 text-xs text-emerald-800 font-medium">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>{stats.recommendPercent}% recommend this keepsake</span>
          </div>
        </div>

        {/* Right: Distribution Bars */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.distribution[star] || 0;
            const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-neutral-600 font-medium flex items-center gap-1 shrink-0">
                  <span>{star}</span>
                  <Star size={11} className="fill-[#C5A880] text-[#C5A880]" />
                </span>

                <div className="flex-1 h-2 rounded-full bg-white border border-[#E8DFC8]/60 overflow-hidden">
                  <div
                    className="h-full bg-[#C5A880] rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="w-10 text-right text-neutral-400 font-mono text-[11px] shrink-0">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter / Sort bar */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E8DFC8]/50">
          <span className="text-neutral-500">
            Showing {sortedReviews.length} reviews
          </span>

          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FAF7F2] border border-[#E8DFC8] rounded-lg px-2.5 py-1 text-xs text-neutral-800 outline-none cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List or Skeletons or Empty */}
      {loading ? (
        <ReviewSkeleton count={3} />
      ) : sortedReviews.length === 0 ? (
        <div className="p-10 text-center rounded-3xl bg-[#FAF7F2] border border-[#E8DFC8]/80 space-y-4">
          <div className="w-12 h-12 rounded-full bg-white text-[#C5A880] flex items-center justify-center mx-auto shadow-xs border border-[#E8DFC8]/60">
            <MessageSquare size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-semibold text-[#2C3E35]">
              No Reviews Chronicled Yet
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Be the first patron to share your heartfelt thoughts, keepsake quality, and unboxing experience.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 rounded-full bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold shadow-sm cursor-pointer"
          >
            Write the First Review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((rev) => {
            const authorName =
              rev.user?.name || rev.userName || rev.name || "Anonymous Patron";
            const revDate = rev.createdAt
              ? new Date(rev.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Verified Milestone";

            const helpfulCount =
              Array.isArray(rev.helpful)
                ? rev.helpful.length
                : rev.helpfulCount || 0;

            const isVoted = helpfulVoted[rev._id];

            return (
              <div
                key={rev._id || Math.random()}
                className="p-5 sm:p-6 bg-white rounded-3xl border border-[#E8DFC8]/70 shadow-2xs space-y-3.5 transition-all hover:border-[#C5A880]/60"
              >
                {/* Header: Author + Rating + Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#37463f] text-[#FAF6F0] flex items-center justify-center font-serif text-sm font-bold shrink-0">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#2C3E35]">
                          {authorName}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                          <CheckCircle2 size={10} className="text-emerald-600" />
                          Verified Patron
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400">{revDate}</span>
                    </div>
                  </div>

                  {/* Stars */}
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

                {/* Title & Comment */}
                <div className="space-y-1.5">
                  {rev.title && (
                    <h4 className="font-serif font-bold text-sm text-[#2C3E35]">
                      {rev.title}
                    </h4>
                  )}
                  <p className="text-xs text-neutral-600 leading-relaxed font-light">
                    {rev.comment}
                  </p>
                </div>

                {/* Review Images if uploaded */}
                {Array.isArray(rev.images) && rev.images.length > 0 && (
                  <div className="flex gap-2 pt-1 overflow-x-auto">
                    {rev.images.map((img, i) => (
                      <img
                        key={i}
                        src={typeof img === "string" ? img : img.url}
                        alt="Customer unboxing"
                        className="w-16 h-16 rounded-xl object-cover border border-[#E8DFC8]/60"
                      />
                    ))}
                  </div>
                )}

                {/* Helpful Action Footer */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-[#E8DFC8]/40">
                  <span className="italic font-serif text-[#C5A880]">
                    Tender Chronicle
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleHelpful(rev._id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                      isVoted
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : "border-[#E8DFC8]/70 text-neutral-500 hover:text-neutral-800 hover:border-neutral-400"
                    }`}
                  >
                    <ThumbsUp size={12} />
                    <span>Helpful ({helpfulCount})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= CREATE REVIEW MODAL ================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl border border-[#E8DFC8] shadow-2xl overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#37463f] text-[#FAF6F0] p-6 text-center relative">
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
                <span>Patron Experience</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF6F0]">
                Write a Keepsake Review
              </h3>
              <p className="text-xs text-[#FAF6F0]/80 mt-1 truncate max-w-xs mx-auto">
                {productName}
              </p>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Star Rating Selector */}
              <div className="space-y-1.5 text-center py-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
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
                      className="p-1 transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        size={28}
                        className={
                          star <= (hoverRating || rating)
                            ? "fill-[#C5A880] text-[#C5A880]"
                            : "text-neutral-300"
                        }
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-serif italic text-[#C5A880]">
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
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 outline-none focus:ring-2 focus:ring-[#37463f]/30"
                />
              </div>

              {/* Detailed Review Comment */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                  Detailed Experience & Impressions *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell other families about the stitching, texture, keepsake companion, and delivery..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-neutral-800 outline-none focus:ring-2 focus:ring-[#37463f]/30 leading-relaxed"
                />
                <span className="text-[10px] text-neutral-400">
                  Minimum 10 characters ({comment.length}/10)
                </span>
              </div>

              {/* Recommendation checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700 pt-1">
                <input
                  type="checkbox"
                  checked={recommend}
                  onChange={(e) => setRecommend(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E8DFC8] text-[#37463f] focus:ring-[#37463f]"
                />
                <span>I recommend this heirloom keepsake to other patrons</span>
              </label>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E8DFC8]/50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs text-neutral-500 hover:text-neutral-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#37463f] hover:bg-[#2C3E35] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <span>Submitting Chronicle...</span>
                  ) : (
                    <>
                      <span>Submit Review</span>
                      <Send size={13} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
