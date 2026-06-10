"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, Search, Users, Calendar, CheckCircle } from "lucide-react";

interface PaymentBooking {
  id: string;
  bookingNumber: string;
  guestName: string;
  guestEmail: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string | null;
  paymentProof: string | null;
  createdAt: string;
  room: { id: string; name: string };
}

export default function AdminPaymentsPage() {
  const [bookings, setBookings] = useState<PaymentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function verifyPayment(id: string) {
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, paymentStatus: "PAID" }),
      });

      if (res.ok) {
        toast.success("Payment verified");
        fetchPayments();
      } else {
        toast.error("Failed to verify payment");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.guestName.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || b.paymentStatus === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading payments..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-sand-900 mb-2">Payments</h1>
          <p className="text-sand-500">Manage and verify payment statuses</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-400" />
          <input
            type="text"
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-sand-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-400"
        >
          <option value="ALL">All Statuses</option>
          <option value="UNPAID">Unpaid</option>
          <option value="PENDING_VERIFICATION">Pending Verification</option>
          <option value="PAID">Paid</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <GlassCard className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-sand-500">{booking.bookingNumber}</span>
                    <StatusBadge status={booking.paymentStatus} type="payment" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-sand-900 mb-1">
                    {booking.room.name}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-sand-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {booking.guestName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      €{Number(booking.totalAmount).toFixed(0)}
                    </span>
                    {booking.paymentMethod && (
                      <span className="text-sand-400">{booking.paymentMethod.replace(/_/g, " ")}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {booking.paymentStatus === "PENDING_VERIFICATION" && (
                    <Button
                      size="sm"
                      onClick={() => verifyPayment(booking.id)}
                      className="bg-olive-500 hover:bg-olive-600 text-white rounded-full"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Verify Payment
                    </Button>
                  )}
                  {booking.paymentProof && (
                    <a
                      href={booking.paymentProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-terracotta-500 hover:text-terracotta-600 font-medium"
                    >
                      View Proof →
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
