"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  MessageSquare,
  Send,
  Star,
  BedDouble,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
  };
}

interface BookingDetail {
  id: string;
  bookingNumber: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  totalNights: number;
  pricePerNight: number;
  totalAmount: number;
  depositAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  paymentMethod?: string;
  paymentProof?: string;
  room: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  };
  messages: Message[];
  review: { id: string; rating: number; title: string | null; content: string } | null;
}

export default function BookingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) fetchBooking();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [booking?.messages]);

  async function fetchBooking() {
    try {
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();
      if (data.success) setBooking(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!messageText.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/bookings/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageText }),
      });

      if (res.ok) {
        setMessageText("");
        fetchBooking();
      } else {
        toast.error("Failed to send message");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSending(false);
    }
  }

  async function cancelBooking() {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Guest requested cancellation" }),
      });

      if (res.ok) {
        toast.success("Booking cancelled");
        fetchBooking();
      } else {
        toast.error("Failed to cancel booking");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading booking..." />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sand-500">Booking not found</p>
      </div>
    );
  }

  const statusSteps = [
    { status: "PENDING", label: "Pending", icon: Clock },
    { status: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
    { status: "COMPLETED", label: "Completed", icon: Star },
  ];

  const currentStep = statusSteps.findIndex(
    (s) => s.status === booking.bookingStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/bookings">
          <Button variant="ghost" size="sm" className="gap-2 text-sand-600">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-sand-500 mb-1">{booking.bookingNumber}</p>
          <h1 className="font-heading text-2xl font-bold text-sand-900">
            {booking.room.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={booking.bookingStatus} type="booking" />
          <StatusBadge status={booking.paymentStatus} type="payment" />
        </div>
      </div>

      {booking.bookingStatus !== "CANCELLED" && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={step.status} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        isActive
                          ? isCurrent
                            ? "bg-terracotta-500 text-white"
                            : "bg-olive-100 text-olive-600"
                          : "bg-sand-100 text-sand-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        isActive ? "text-sand-700" : "text-sand-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        index < currentStep ? "bg-olive-300" : "bg-sand-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {booking.bookingStatus === "CANCELLED" && (
        <GlassCard className="p-6 bg-terracotta-50 border-terracotta-200">
          <div className="flex items-center gap-3">
            <XCircle className="h-6 w-6 text-terracotta-500" />
            <div>
              <p className="font-medium text-terracotta-700">This booking has been cancelled</p>
              <p className="text-sm text-terracotta-500">
                If you have any questions, please contact us.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="overflow-hidden">
            <div className="relative h-64">
              <Image
                src={booking.room.images[0] || "/placeholder-room.jpg"}
                alt={booking.room.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="font-heading text-xl font-semibold text-sand-900 mb-4">
                Booking Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-terracotta-500" />
                  <div>
                    <p className="text-sm text-sand-500">Check-in</p>
                    <p className="font-medium text-sand-800">
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-terracotta-500" />
                  <div>
                    <p className="text-sm text-sand-500">Check-out</p>
                    <p className="font-medium text-sand-800">
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-terracotta-500" />
                  <div>
                    <p className="text-sm text-sand-500">Guests</p>
                    <p className="font-medium text-sand-800">{booking.guests}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BedDouble className="h-5 w-5 text-terracotta-500" />
                  <div>
                    <p className="text-sm text-sand-500">Nights</p>
                    <p className="font-medium text-sand-800">{booking.totalNights}</p>
                  </div>
                </div>
              </div>
              {booking.specialRequests && (
                <div className="mt-4 p-4 bg-sand-50 rounded-lg">
                  <p className="text-sm text-sand-500 mb-1">Special Requests</p>
                  <p className="text-sand-700">{booking.specialRequests}</p>
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-terracotta-500" />
              <h2 className="font-heading text-xl font-semibold text-sand-900">
                Messages
              </h2>
            </div>
            <div className="h-64 overflow-y-auto space-y-4 mb-4 p-2">
              {booking.messages.length === 0 ? (
                <p className="text-center text-sand-500 py-8">
                  No messages yet. Start a conversation with our team.
                </p>
              ) : (
                booking.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender.role === "ADMIN" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.sender.role === "ADMIN"
                          ? "bg-sand-100 text-sand-800 rounded-tl-none"
                          : "bg-terracotta-500 text-white rounded-tr-none"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender.role === "ADMIN"
                            ? "text-sand-400"
                            : "text-white/70"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="bg-sand-50 border-sand-200"
              />
              <Button
                type="submit"
                disabled={sending || !messageText.trim()}
                className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="font-heading text-lg font-semibold text-sand-900 mb-4">
              Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-sand-500">Price per night</span>
                <span className="text-sand-700">€{booking.pricePerNight}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sand-500">Nights</span>
                <span className="text-sand-700">{booking.totalNights}</span>
              </div>
              <div className="border-t border-sand-200 pt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-sand-900">Total</span>
                  <span className="text-terracotta-500">
                    €{Number(booking.totalAmount).toFixed(0)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sand-500">Deposit (30%)</span>
                <span className="text-gold-600 font-medium">
                  €{Number(booking.depositAmount).toFixed(0)}
                </span>
              </div>
            </div>

            {booking.paymentStatus === "UNPAID" && (
              <div className="mt-4 p-4 bg-gold-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gold-700">
                      Payment Required
                    </p>
                    <p className="text-xs text-gold-500 mt-1">
                      Please upload your payment proof to confirm your booking.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>

          {booking.bookingStatus !== "CANCELLED" &&
            booking.bookingStatus !== "COMPLETED" && (
              <Button
                onClick={cancelBooking}
                variant="outline"
                className="w-full border-terracotta-200 text-terracotta-500 hover:bg-terracotta-50 rounded-full"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Booking
              </Button>
            )}

          {booking.bookingStatus === "COMPLETED" && !booking.review && (
            <Link href={`/dashboard/bookings/${booking.id}/review`}>
              <Button className="w-full bg-gold-500 hover:bg-gold-600 text-white rounded-full">
                <Star className="mr-2 h-4 w-4" />
                Leave a Review
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
