"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CreditCard,
  MessageSquare,
  BedDouble,
  ArrowRight,
  Bell,
} from "lucide-react";

interface DashboardData {
  totalBookings: number;
  upcomingBookings: number;
  totalSpent: number;
  unreadMessages: number;
  recentBooking: {
    id: string;
    bookingNumber: string;
    checkIn: string;
    checkOut: string;
    bookingStatus: string;
    paymentStatus: string;
    totalAmount: number;
    room: { name: string; images: string[] };
  } | null;
}

export default function GuestDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await fetch("/api/guest/dashboard");
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sand-500">Failed to load dashboard</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Bookings",
      value: data.totalBookings,
      icon: BedDouble,
      color: "text-terracotta-500",
      bg: "bg-terracotta-50",
    },
    {
      label: "Upcoming",
      value: data.upcomingBookings,
      icon: Calendar,
      color: "text-olive-500",
      bg: "bg-olive-50",
    },
    {
      label: "Total Spent",
      value: `€${Number(data.totalSpent).toFixed(0)}`,
      icon: CreditCard,
      color: "text-gold-500",
      bg: "bg-gold-50",
    },
    {
      label: "Messages",
      value: data.unreadMessages,
      icon: MessageSquare,
      color: "text-sand-600",
      bg: "bg-sand-100",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-heading text-3xl font-bold text-sand-900 mb-2">
          Welcome Back
        </h1>
        <p className="text-sand-500">
          Here&apos;s what&apos;s happening with your bookings.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-10 w-10 rounded-full ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-sand-900">{stat.value}</p>
              <p className="text-sm text-sand-500">{stat.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {data.recentBooking && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-heading text-xl font-semibold text-sand-900 mb-4">
            Recent Booking
          </h2>
          <GlassCard className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0">
                <Image
                  src={data.recentBooking.room.images[0] || "/placeholder-room.jpg"}
                  alt={data.recentBooking.room.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-sand-500 mb-1">
                      {data.recentBooking.bookingNumber}
                    </p>
                    <h3 className="font-heading text-xl font-semibold text-sand-900">
                      {data.recentBooking.room.name}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={data.recentBooking.bookingStatus} type="booking" />
                    <StatusBadge status={data.recentBooking.paymentStatus} type="payment" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-sand-500">Check-in</p>
                    <p className="font-medium text-sand-800">
                      {new Date(data.recentBooking.checkIn).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-sand-500">Check-out</p>
                    <p className="font-medium text-sand-800">
                      {new Date(data.recentBooking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-heading text-lg font-semibold text-terracotta-500">
                    €{Number(data.recentBooking.totalAmount).toFixed(0)}
                  </p>
                  <Link href={`/dashboard/bookings/${data.recentBooking.id}`}>
                    <Button variant="outline" size="sm" className="gap-2 rounded-full">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-heading text-xl font-semibold text-sand-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/rooms">
            <GlassCard className="p-5 hover:bg-white/80 transition-colors cursor-pointer">
              <BedDouble className="h-6 w-6 text-terracotta-500 mb-3" />
              <h3 className="font-medium text-sand-900">Book a Room</h3>
              <p className="text-sm text-sand-500">Browse our collection</p>
            </GlassCard>
          </Link>
          <Link href="/dashboard/bookings">
            <GlassCard className="p-5 hover:bg-white/80 transition-colors cursor-pointer">
              <Calendar className="h-6 w-6 text-olive-500 mb-3" />
              <h3 className="font-medium text-sand-900">My Bookings</h3>
              <p className="text-sm text-sand-500">View all reservations</p>
            </GlassCard>
          </Link>
          <Link href="/dashboard/messages">
            <GlassCard className="p-5 hover:bg-white/80 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-6 w-6 text-gold-500" />
                {data.unreadMessages > 0 && (
                  <span className="h-5 w-5 rounded-full bg-terracotta-500 text-white text-xs flex items-center justify-center">
                    {data.unreadMessages}
                  </span>
                )}
              </div>
              <h3 className="font-medium text-sand-900">Messages</h3>
              <p className="text-sm text-sand-500">Chat with our team</p>
            </GlassCard>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
