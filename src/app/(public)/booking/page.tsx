"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { CalendarDays, Users, ArrowLeft, BedDouble } from "lucide-react";

interface Room {
  id: string;
  name: string;
  slug: string;
  pricePerNight: number;
  capacity: number;
  images: string[];
}

export default function BookingPage() {
  const { data: session } = useSession();
  const [preselectedRoom, setPreselectedRoom] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setPreselectedRoom(params.get("room"));
    }
  }, []);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    roomId: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    guestName: session?.user?.name || "",
    guestEmail: session?.user?.email || "",
    guestPhone: "",
    specialRequests: "",
  });

  const [nights, setNights] = useState(0);
  const [total, setTotal] = useState(0);
  const [deposit, setDeposit] = useState(0);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        guestName: session.user?.name || prev.guestName,
        guestEmail: session.user?.email || prev.guestEmail,
      }));
    }
  }, [session]);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setNights(diff > 0 ? diff : 0);

      const room = rooms.find((r) => r.id === formData.roomId);
      if (room && diff > 0) {
        const t = diff * Number(room.pricePerNight);
        setTotal(t);
        setDeposit(Math.round(t * 0.3));
      }
    }
  }, [formData.checkIn, formData.checkOut, formData.roomId, rooms]);

  async function fetchRooms() {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (data.success) {
        setRooms(data.data);
        if (preselectedRoom) {
          const room = data.data.find((r: Room) => r.slug === preselectedRoom);
          if (room) setFormData((prev) => ({ ...prev, roomId: room.id }));
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.roomId) {
      toast.error("Please select a room");
      return;
    }
    if (!formData.checkIn || !formData.checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Booking created successfully!");
        window.location.href = "/dashboard/bookings";
      } else {
        toast.error(data.error || "Failed to create booking");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedRoom = rooms.find((r) => r.id === formData.roomId);

  return (
    <div className="min-h-full">
      <Navbar />

      <section className="pt-24 pb-12 bg-sand-50 zellige-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/rooms">
              <Button variant="ghost" className="gap-2 text-sand-600">
                <ArrowLeft className="h-4 w-4" />
                Back to Rooms
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-sand-900 mb-2">
              Book Your Stay
            </h1>
            <p className="text-sand-500 mb-8">
              Complete the form below to reserve your room.
            </p>
          </motion.div>

          {loading ? (
            <LoadingSpinner text="Loading rooms..." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <GlassCard className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Room Selection */}
                    <div className="space-y-2">
                      <Label>Select Room</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {rooms.map((room) => (
                          <button
                            key={room.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, roomId: room.id })}
                            className={`relative rounded-xl overflow-hidden border-2 transition-all text-left ${
                              formData.roomId === room.id
                                ? "border-terracotta-500 ring-2 ring-terracotta-200"
                                : "border-transparent hover:border-sand-300"
                            }`}
                          >
                            <div className="relative h-32">
                              <Image
                                src={room.images[0] || "/placeholder-room.jpg"}
                                alt={room.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-sand-900/70 to-transparent" />
                              <div className="absolute bottom-3 left-3 right-3">
                                <p className="text-white font-medium">{room.name}</p>
                                <p className="text-white/80 text-sm">
                                  €{room.pricePerNight}/night · {room.capacity} guests
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dates & Guests */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkIn">Check-in</Label>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-400" />
                          <Input
                            id="checkIn"
                            type="date"
                            value={formData.checkIn}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                            required
                            className="pl-10 bg-sand-50 border-sand-200"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkOut">Check-out</Label>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-400" />
                          <Input
                            id="checkOut"
                            type="date"
                            value={formData.checkOut}
                            min={formData.checkIn || new Date().toISOString().split("T")[0]}
                            onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                            required
                            className="pl-10 bg-sand-50 border-sand-200"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guests">Guests</Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-400" />
                          <Input
                            id="guests"
                            type="number"
                            min={1}
                            max={selectedRoom?.capacity || 10}
                            value={formData.guests}
                            onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                            required
                            className="pl-10 bg-sand-50 border-sand-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Guest Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guestName">Full Name</Label>
                        <Input
                          id="guestName"
                          value={formData.guestName}
                          onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                          placeholder="John Doe"
                          required
                          className="bg-sand-50 border-sand-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guestEmail">Email</Label>
                        <Input
                          id="guestEmail"
                          type="email"
                          value={formData.guestEmail}
                          onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                          placeholder="john@example.com"
                          required
                          className="bg-sand-50 border-sand-200"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guestPhone">Phone</Label>
                      <Input
                        id="guestPhone"
                        type="tel"
                        value={formData.guestPhone}
                        onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                        placeholder="+212 6XX XXX XXX"
                        required
                        className="bg-sand-50 border-sand-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialRequests">Special Requests (optional)</Label>
                      <textarea
                        id="specialRequests"
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                        rows={3}
                        className="w-full rounded-xl border border-sand-200 bg-sand-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-400 resize-none"
                        placeholder="Any special requests or preferences..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full py-6 text-lg"
                    >
                      {submitting ? "Creating Booking..." : "Confirm Booking"}
                    </Button>
                  </form>
                </GlassCard>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <GlassCard className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-sand-900 mb-6">
                      Booking Summary
                    </h3>

                    {selectedRoom ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                            <Image
                              src={selectedRoom.images[0]}
                              alt={selectedRoom.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sand-900">{selectedRoom.name}</p>
                            <p className="text-sm text-sand-500">
                              <BedDouble className="inline h-3 w-3 mr-1" />
                              {selectedRoom.capacity} guests max
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-sand-200 pt-4 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-sand-500">Price per night</span>
                            <span className="text-sand-700">€{selectedRoom.pricePerNight}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-sand-500">Nights</span>
                            <span className="text-sand-700">{nights}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-sand-500">Guests</span>
                            <span className="text-sand-700">{formData.guests}</span>
                          </div>
                        </div>

                        <div className="border-t border-sand-200 pt-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span className="text-sand-900">Total</span>
                            <span className="text-terracotta-500">€{total}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-sand-500">Deposit due now (30%)</span>
                            <span className="text-gold-600 font-medium">€{deposit}</span>
                          </div>
                        </div>

                        <div className="bg-sand-50 rounded-lg p-4 text-sm text-sand-600">
                          <p className="font-medium text-sand-700 mb-1">Payment</p>
                          <p>
                            You'll receive payment instructions after booking confirmation.
                            We accept bank transfer, PayPal, or cash on arrival.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sand-500 text-center py-8">
                        Select a room to see the booking summary.
                      </p>
                    )}
                  </GlassCard>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
