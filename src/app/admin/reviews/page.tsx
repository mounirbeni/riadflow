"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star, Search, User, BedDouble, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  isApproved: boolean;
  isVisible: boolean;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
  room: { id: string; name: string };
  booking: { id: string; bookingNumber: string };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateReview(id: string, updates: Partial<Review>) {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      if (res.ok) {
        toast.success("Review updated");
        fetchReviews();
      } else {
        toast.error("Failed to update review");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  const filtered = reviews.filter(
    (r) =>
      (r.user.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      r.room.name.toLowerCase().includes(search.toLowerCase()) ||
      r.content.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading reviews..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-sand-900 mb-2">Reviews</h1>
          <p className="text-sand-500">Moderate guest reviews</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-400" />
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <GlassCard className="p-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1 text-gold-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-sand-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-sand-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    {review.isApproved ? (
                      <span className="text-xs bg-olive-50 text-olive-600 px-2 py-0.5 rounded-full font-medium">
                        Approved
                      </span>
                    ) : (
                      <span className="text-xs bg-gold-50 text-gold-600 px-2 py-0.5 rounded-full font-medium">
                        Pending
                      </span>
                    )}
                    {!review.isVisible && (
                      <span className="text-xs bg-sand-100 text-sand-600 px-2 py-0.5 rounded-full font-medium">
                        Hidden
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-sand-900 mb-1">{review.title || "Untitled Review"}</h3>
                  <p className="text-sm text-sand-600 mb-3">{review.content}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-sand-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {review.user.name || review.user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5" />
                      {review.room.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateReview(review.id, { isApproved: !review.isApproved })}
                    className={`rounded-full gap-1 ${review.isApproved ? "border-terracotta-200 text-terracotta-500" : "bg-olive-500 text-white hover:bg-olive-600 border-olive-500"}`}
                  >
                    {review.isApproved ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    {review.isApproved ? "Unapprove" : "Approve"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateReview(review.id, { isVisible: !review.isVisible })}
                    className="rounded-full gap-1"
                  >
                    {review.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {review.isVisible ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
