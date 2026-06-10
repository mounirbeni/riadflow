"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ArrowRight, BedDouble } from "lucide-react";

interface Booking {
  id: string;
  bookingNumber: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  room: { name: string; images: string[]; slug: string };
  messages: { id: string }[];
  review: { id: string } | null;
}

export default function GuestBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = bookings.filter((b) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming")
      return ["PENDING", "CONFIRMED"].includes(b.bookingStatus) &&
        new Date(b.checkIn) >= new Date();
    if (activeTab === "completed") return b.bookingStatus === "COMPLETED";
    if (activeTab === "cancelled") return b.bookingStatus === "CANCELLED";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading bookings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-sand-900 mb-2">
          My Bookings
        </h1>
        <p className="text-sand-500">Manage your reservations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-sand-100">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description="You don't have any bookings in this category."
          icon={<Calendar className="h-12 w-12" />}
          action={
            <Link href="/rooms">
              <Button className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full gap-2">
                <BedDouble className="h-4 w-4" />
                Browse Rooms
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/dashboard/bookings/${booking.id}`}>
                <GlassCard className="overflow-hidden hover:bg-white/80 transition-colors cursor-pointer">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
                      <Image
                        src={booking.room.images[0] || "/placeholder-room.jpg"}
                        alt={booking.room.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs text-sand-500 mb-1">
                            {booking.bookingNumber}
                          </p>
                          <h3 className="font-heading text-lg font-semibold text-sand-900">
                            {booking.room.name}
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          <StatusBadge
                            status={booking.bookingStatus}
                            type="booking"
                          />
                          <StatusBadge
                            status={booking.paymentStatus}
                            type="payment"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-sand-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </span>
                        <span>{booking.guests} guests</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-heading text-lg font-semibold text-terracotta-500">
                          €{Number(booking.totalAmount).toFixed(0)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-terracotta-500"
                        >
                          Details
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
