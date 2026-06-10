"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, BedDouble } from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  bookingNumber: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  bookingStatus: string;
  room: { name: string };
}

export default function InvoicesPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.data.filter((b: Booking) => b.bookingStatus !== "CANCELLED"));
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading invoices..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-sand-900 mb-2">Invoices</h1>
        <p className="text-sand-500">View and download your booking invoices</p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          title="No invoices yet"
          description="You don't have any confirmed bookings with invoices."
          icon={<FileText className="h-12 w-12" />}
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
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-sand-500 mb-1">{booking.bookingNumber}</p>
                    <h3 className="font-heading text-lg font-semibold text-sand-900">
                      {booking.room.name}
                    </h3>
                    <p className="text-sm text-sand-500 mt-1">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-lg font-semibold text-terracotta-500">
                      €{Number(booking.totalAmount).toFixed(0)}
                    </p>
                    <Button variant="ghost" size="sm" className="gap-1 text-sand-500">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
