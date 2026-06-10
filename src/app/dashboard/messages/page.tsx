"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Calendar } from "lucide-react";

interface BookingWithMessages {
  id: string;
  bookingNumber: string;
  room: { name: string };
  messages: { id: string; content: string; isRead: boolean; createdAt: string; sender: { name: string | null; role: string } }[];
}

export default function MessagesPage() {
  const [bookings, setBookings] = useState<BookingWithMessages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.data.filter((b: BookingWithMessages) => b.messages.length > 0));
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
        <LoadingSpinner text="Loading messages..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-sand-900 mb-2">Messages</h1>
        <p className="text-sand-500">Conversations with our team</p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Start a conversation by visiting one of your bookings."
          icon={<MessageSquare className="h-12 w-12" />}
          action={
            <Link href="/dashboard/bookings">
              <Button className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full gap-2">
                <Calendar className="h-4 w-4" />
                View Bookings
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => {
            const lastMessage = booking.messages[booking.messages.length - 1];
            const unreadCount = booking.messages.filter((m) => !m.isRead && m.sender.role === "ADMIN").length;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/dashboard/bookings/${booking.id}`}>
                  <GlassCard className="p-5 hover:bg-white/80 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sand-900">{booking.room.name}</h3>
                          <span className="text-xs text-sand-500">{booking.bookingNumber}</span>
                        </div>
                        {lastMessage && (
                          <p className="text-sm text-sand-500 truncate">{lastMessage.content}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        {unreadCount > 0 && (
                          <span className="h-5 w-5 rounded-full bg-terracotta-500 text-white text-xs flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                        <ArrowRight className="h-4 w-4 text-sand-400" />
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
