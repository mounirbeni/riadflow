"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  XCircle,
  ArrowRight,
  Search,
} from "lucide-react";

interface AdminBooking {
  id: string;
  bookingNumber: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  user: { id: string; name: string | null; email: string };
  room: { id: string; name: string; slug: string };
  messages: { id: string }[];
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, bookingStatus?: string, paymentStatus?: string) {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, bookingStatus, paymentStatus }),
      });

      if (res.ok) {
        toast.success("Booking updated");
        fetchBookings();
      } else {
        toast.error("Failed to update booking");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  const filtered = bookings.filter(
    (b) =>
      b.guestName.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.room.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading bookings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-sand-900 mb-2">
            Bookings
          </h1>
          <p className="text-sand-500">Manage all reservations</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-400" />
        <input
          type="text"
          placeholder="Search bookings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
        />
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
                    <StatusBadge status={booking.bookingStatus} type="booking" />
                    <StatusBadge status={booking.paymentStatus} type="payment" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-sand-900 mb-1">
                    {booking.room.name}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-sand-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {booking.guestName} ({booking.guests} guests)
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      €{Number(booking.totalAmount).toFixed(0)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {booking.bookingStatus === "PENDING" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(booking.id, "CONFIRMED")}
                      className="bg-olive-500 hover:bg-olive-600 text-white rounded-full"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Confirm
                    </Button>
                  )}
                  {booking.bookingStatus === "CONFIRMED" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(booking.id, "COMPLETED")}
                      className="bg-gold-500 hover:bg-gold-600 text-white rounded-full"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Complete
                    </Button>
                  )}
                  {booking.paymentStatus === "PENDING_VERIFICATION" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(booking.id, undefined, "PAID")}
                      className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full"
                    >
                      <CreditCard className="mr-1 h-4 w-4" />
                      Verify Payment
                    </Button>
                  )}
                  {booking.bookingStatus !== "CANCELLED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(booking.id, "CANCELLED")}
                      className="border-terracotta-200 text-terracotta-500 hover:bg-terracotta-50 rounded-full"
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Cancel
                    </Button>
                  )}
                  <Link href={`/admin/bookings/${booking.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
