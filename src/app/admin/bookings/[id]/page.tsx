"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  BedDouble,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  Send,
  User,
} from "lucide-react";

interface BookingDetail {
  id: string;
  bookingNumber: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string | null;
  totalNights: number;
  pricePerNight: number;
  totalAmount: number;
  depositAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  paymentMethod: string | null;
  paymentProof: string | null;
  paymentVerifiedAt: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string; phone: string | null };
  room: { id: string; name: string; slug: string; pricePerNight: number };
  messages: {
    id: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    sender: { id: string; name: string | null; role: string };
  }[];
}

export default function AdminBookingDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (id) fetchBooking();
  }, [id]);

  async function fetchBooking() {
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`);
      const data = await res.json();
      if (data.success) setBooking(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(bookingStatus?: string, paymentStatus?: string) {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, bookingStatus, paymentStatus }),
      });

      if (res.ok) {
        toast.success("Booking updated");
        fetchBooking();
      } else {
        toast.error("Failed to update booking");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function sendReply() {
    if (!reply.trim()) return;
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id, content: reply }),
      });

      if (res.ok) {
        toast.success("Reply sent");
        setReply("");
        fetchBooking();
      } else {
        toast.error("Failed to send reply");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/bookings">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-sand-900 mb-1">
            {booking.bookingNumber}
          </h1>
          <div className="flex items-center gap-2">
            <StatusBadge status={booking.bookingStatus} type="booking" />
            <StatusBadge status={booking.paymentStatus} type="payment" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {booking.bookingStatus === "PENDING" && (
            <Button
              onClick={() => updateStatus("CONFIRMED")}
              className="bg-olive-500 hover:bg-olive-600 text-white rounded-full gap-1"
            >
              <CheckCircle className="h-4 w-4" />
              Confirm
            </Button>
          )}
          {booking.bookingStatus === "CONFIRMED" && (
            <Button
              onClick={() => updateStatus("COMPLETED")}
              className="bg-gold-500 hover:bg-gold-600 text-white rounded-full gap-1"
            >
              <CheckCircle className="h-4 w-4" />
              Complete
            </Button>
          )}
          {booking.paymentStatus === "PENDING_VERIFICATION" && (
            <Button
              onClick={() => updateStatus(undefined, "PAID")}
              className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full gap-1"
            >
              <CreditCard className="h-4 w-4" />
              Verify Payment
            </Button>
          )}
          {booking.bookingStatus !== "CANCELLED" && (
            <Button
              variant="outline"
              onClick={() => updateStatus("CANCELLED")}
              className="border-terracotta-200 text-terracotta-500 hover:bg-terracotta-50 rounded-full gap-1"
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <h2 className="font-heading text-lg font-semibold text-sand-900 mb-4">Stay Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <BedDouble className="h-5 w-5 text-terracotta-500" />
                <div>
                  <p className="text-sm text-sand-500">Room</p>
                  <p className="font-medium text-sand-900">{booking.room.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-olive-500" />
                <div>
                  <p className="text-sm text-sand-500">Dates</p>
                  <p className="font-medium text-sand-900">
                    {new Date(booking.checkIn).toLocaleDateString()} —{" "}
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gold-500" />
                <div>
                  <p className="text-sm text-sand-500">Guests</p>
                  <p className="font-medium text-sand-900">{booking.guests}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-sand-500" />
                <div>
                  <p className="text-sm text-sand-500">Total</p>
                  <p className="font-medium text-sand-900">€{Number(booking.totalAmount).toFixed(2)}</p>
                </div>
              </div>
            </div>
            {booking.specialRequests && (
              <div className="mt-4 p-3 bg-sand-50 rounded-xl">
                <p className="text-sm text-sand-500 mb-1">Special Requests</p>
                <p className="text-sm text-sand-700">{booking.specialRequests}</p>
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="font-heading text-lg font-semibold text-sand-900 mb-4">Messages</h2>
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {booking.messages.length === 0 && (
                <p className="text-sm text-sand-500">No messages yet</p>
              )}
              {booking.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 p-3 rounded-xl ${
                    msg.sender.role === "ADMIN" ? "bg-terracotta-50 ml-6" : "bg-sand-50 mr-6"
                  }`}
                >
                  <div className="h-8 w-8 rounded-full bg-white border border-sand-200 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-sand-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-sand-900">
                        {msg.sender.name || "Guest"}
                      </span>
                      <span className="text-xs text-sand-400">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-sand-700">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
                className="flex-1 px-4 py-2 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400 text-sm"
              />
              <Button
                size="sm"
                onClick={sendReply}
                className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full gap-1"
              >
                <Send className="h-4 w-4" />
                Reply
              </Button>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="font-heading text-lg font-semibold text-sand-900 mb-4">Guest Info</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-terracotta-500" />
                <div>
                  <p className="text-sm text-sand-500">Name</p>
                  <p className="font-medium text-sand-900">{booking.guestName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-olive-500" />
                <div>
                  <p className="text-sm text-sand-500">Email</p>
                  <p className="font-medium text-sand-900">{booking.guestEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold-500" />
                <div>
                  <p className="text-sm text-sand-500">Phone</p>
                  <p className="font-medium text-sand-900">{booking.guestPhone || "—"}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="font-heading text-lg font-semibold text-sand-900 mb-4">Payment</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-sand-500">Price/Night</span>
                <span className="font-medium text-sand-900">€{Number(booking.pricePerNight).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-sand-500">Nights</span>
                <span className="font-medium text-sand-900">{booking.totalNights}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-sand-500">Deposit</span>
                <span className="font-medium text-sand-900">€{Number(booking.depositAmount).toFixed(2)}</span>
              </div>
              <div className="border-t border-sand-100 pt-3 flex justify-between">
                <span className="font-medium text-sand-900">Total</span>
                <span className="font-bold text-sand-900">€{Number(booking.totalAmount).toFixed(2)}</span>
              </div>
              {booking.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-sm text-sand-500">Method</span>
                  <span className="font-medium text-sand-900">{booking.paymentMethod.replace(/_/g, " ")}</span>
                </div>
              )}
              {booking.paymentProof && (
                <a
                  href={booking.paymentProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-terracotta-500 hover:text-terracotta-600 font-medium block mt-2"
                >
                  View Payment Proof →
                </a>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
