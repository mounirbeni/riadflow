"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Users,
  ArrowRight,
  Check,
  BedDouble,
  Bath,
  Maximize,
  Star,
  ChevronLeft,
  Shield,
  LogIn,
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  slug: string;
  shortDesc?: string;
  pricePerNight: number;
  capacity: number;
  beds: string;
  bathrooms: number;
  size?: number;
  images: string[];
  amenities: string[];
  averageRating: number | null;
  reviewCount: number;
}

const STEPS = [
  { id: 1, label: "Dates" },
  { id: 2, label: "Room" },
  { id: 3, label: "Details" },
  { id: 4, label: "Confirm" },
];

const slideVariants = {
  enter: { opacity: 0, x: 32 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
};

export default function BookingPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();

  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.floor(diff / 86400000));
  }, [checkIn, checkOut]);

  const total = selectedRoom ? nights * selectedRoom.pricePerNight : 0;
  const deposit = total * 0.3;

  // Pre-fill from session
  useEffect(() => {
    if (session?.user) {
      setGuestName((p) => p || session.user?.name || "");
      setGuestEmail((p) => p || session.user?.email || "");
    }
  }, [session]);

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ci = params.get("checkIn");
    const co = params.get("checkOut");
    const g = parseInt(params.get("guests") || "2");
    const roomSlug = params.get("room");

    if (ci) setCheckIn(ci);
    if (co) setCheckOut(co);
    if (g) setGuests(g);

    // If dates + room pre-supplied, run search immediately
    if (ci && co && roomSlug) {
      runSearch(ci, co, g || 2, roomSlug);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function runSearch(
    ci: string,
    co: string,
    g: number,
    preselectSlug?: string
  ) {
    const ciDate = new Date(ci);
    const coDate = new Date(co);
    if (isNaN(ciDate.getTime()) || isNaN(coDate.getTime()) || ciDate >= coDate) {
      toast.error("Please select valid check-in and check-out dates");
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(
        `/api/rooms/available?checkIn=${ci}&checkOut=${co}&guests=${g}`
      );
      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Failed to search rooms");
        return;
      }

      setAvailableRooms(data.data);

      if (preselectSlug) {
        const room = data.data.find((r: Room) => r.slug === preselectSlug);
        if (room) {
          setSelectedRoom(room);
          setStep(3);
        } else {
          setStep(2);
          if (data.data.length > 0) {
            toast.info(
              "That room isn't available for these dates — see other options below."
            );
          }
        }
      } else {
        setStep(2);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  function handleSearch() {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    runSearch(checkIn, checkOut, guests);
  }

  function selectRoom(room: Room) {
    if (authStatus === "unauthenticated") {
      const params = new URLSearchParams({
        room: room.slug,
        checkIn,
        checkOut,
        guests: String(guests),
      });
      router.push(`/login?callbackUrl=${encodeURIComponent(`/booking?${params}`)}`);
      return;
    }
    setSelectedRoom(room);
    setStep(3);
  }

  async function handleSubmit() {
    if (!selectedRoom || !checkIn || !checkOut || !guestName || !guestEmail || !guestPhone) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          checkIn,
          checkOut,
          guests,
          guestName,
          guestEmail,
          guestPhone,
          specialRequests,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Booking confirmed! Redirecting to your bookings…");
        router.push("/dashboard/bookings");
      } else {
        toast.error(data.error || "Failed to create booking");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function goBack() {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(selectedRoom ? 2 : 1);
    else if (step === 4) setStep(3);
  }

  return (
    <div className="min-h-full">
      <Navbar />

      {/* Step header */}
      <div className="pt-20 md:pt-24 pb-4 bg-white border-b border-sand-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {step > 1 && (
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 text-sand-500 text-sm mb-4 hover:text-terracotta-500 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          )}
          <div className="flex items-start gap-0">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0",
                      step > s.id
                        ? "bg-olive-500 text-white"
                        : step === s.id
                        ? "bg-terracotta-500 text-white"
                        : "bg-sand-200 text-sand-400"
                    )}
                  >
                    {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] mt-1 font-medium whitespace-nowrap",
                      step >= s.id ? "text-sand-700" : "text-sand-400"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-1 mb-4",
                      step > s.id ? "bg-olive-400" : "bg-sand-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-sand-50 zellige-pattern min-h-[calc(100vh-160px)] py-6 md:py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {/* ── STEP 1: Dates & Guests ─────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <div className="text-center mb-8">
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-sand-900 mb-2">
                    When are you visiting?
                  </h1>
                  <p className="text-sand-500">
                    Select your dates — we'll show you exactly what's available.
                  </p>
                </div>

                <GlassCard className="p-6 md:p-8">
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-sand-700 font-semibold text-xs uppercase tracking-wide">
                          Check-in
                        </Label>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-terracotta-500 pointer-events-none" />
                          <Input
                            type="date"
                            value={checkIn}
                            min={today}
                            onChange={(e) => {
                              setCheckIn(e.target.value);
                              if (checkOut && e.target.value >= checkOut)
                                setCheckOut("");
                            }}
                            className="pl-10 bg-white border-sand-200 h-11"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sand-700 font-semibold text-xs uppercase tracking-wide">
                          Check-out
                        </Label>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-terracotta-500 pointer-events-none" />
                          <Input
                            type="date"
                            value={checkOut}
                            min={
                              checkIn
                                ? new Date(
                                    new Date(checkIn).getTime() + 86400000
                                  )
                                    .toISOString()
                                    .split("T")[0]
                                : today
                            }
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="pl-10 bg-white border-sand-200 h-11"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sand-700 font-semibold text-xs uppercase tracking-wide">
                        Guests
                      </Label>
                      <div className="flex items-center gap-4 bg-white border border-sand-200 rounded-xl px-4 h-11">
                        <Users className="h-4 w-4 text-terracotta-500 shrink-0" />
                        <span className="flex-1 text-sand-700 text-sm">
                          {guests} {guests === 1 ? "Guest" : "Guests"}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="h-8 w-8 rounded-full bg-sand-100 hover:bg-sand-200 flex items-center justify-center font-bold text-sand-700 text-lg transition-colors active:scale-90"
                          >
                            −
                          </button>
                          <span className="w-5 text-center font-semibold text-sand-900 text-sm">
                            {guests}
                          </span>
                          <button
                            type="button"
                            onClick={() => setGuests(Math.min(10, guests + 1))}
                            className="h-8 w-8 rounded-full bg-sand-100 hover:bg-sand-200 flex items-center justify-center font-bold text-sand-700 text-lg transition-colors active:scale-90"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {checkIn && checkOut && nights > 0 && (
                      <div className="bg-terracotta-50 border border-terracotta-200 rounded-xl px-4 py-3 text-sm text-terracotta-700">
                        <span className="font-semibold">
                          {nights} night{nights > 1 ? "s" : ""}
                        </span>{" "}
                        · {guests} guest{guests > 1 ? "s" : ""} ·{" "}
                        {new Date(checkIn).toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        →{" "}
                        {new Date(checkOut).toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    )}

                    <Button
                      onClick={handleSearch}
                      disabled={!checkIn || !checkOut || searching}
                      className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl h-12 text-base font-semibold"
                    >
                      {searching ? (
                        "Searching…"
                      ) : (
                        <>
                          Search Available Rooms
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* ── STEP 2: Pick a Room ────────────────────────────────── */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <div className="mb-5">
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-sand-900 mb-1">
                    Available Rooms
                  </h2>
                  <p className="text-sand-500 text-sm">
                    {nights} night{nights > 1 ? "s" : ""} · {guests} guest
                    {guests > 1 ? "s" : ""} ·{" "}
                    {new Date(checkIn).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    –{" "}
                    {new Date(checkOut).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    })}
                    <button
                      onClick={() => setStep(1)}
                      className="ml-2 text-terracotta-500 underline underline-offset-2"
                    >
                      Edit
                    </button>
                  </p>
                </div>

                {availableRooms.length === 0 ? (
                  <GlassCard className="p-12 text-center">
                    <CalendarDays className="h-12 w-12 text-sand-300 mx-auto mb-4" />
                    <h3 className="font-heading text-xl text-sand-700 mb-2">
                      No rooms available
                    </h3>
                    <p className="text-sand-500 mb-6">
                      All rooms are booked for those dates. Try a different
                      date range or fewer guests.
                    </p>
                    <Button
                      onClick={() => setStep(1)}
                      className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full"
                    >
                      Change Dates
                    </Button>
                  </GlassCard>
                ) : (
                  <div className="space-y-4">
                    {availableRooms.map((room, i) => (
                      <motion.div
                        key={room.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <button
                          type="button"
                          onClick={() => selectRoom(room)}
                          className="w-full text-left bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-terracotta-300 hover:shadow-lg transition-all active:scale-[0.99]"
                        >
                          <div className="flex flex-col sm:flex-row">
                            <div className="relative h-44 sm:h-auto sm:w-44 shrink-0">
                              <Image
                                src={room.images[0] || ""}
                                alt={room.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h3 className="font-heading text-lg font-semibold text-sand-900">
                                      {room.name}
                                    </h3>
                                    {room.shortDesc && (
                                      <p className="text-sand-500 text-xs mt-0.5 line-clamp-2">
                                        {room.shortDesc}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="font-heading text-xl font-bold text-terracotta-500">
                                      €{room.pricePerNight}
                                    </p>
                                    <p className="text-sand-400 text-xs">
                                      per night
                                    </p>
                                    {nights > 0 && (
                                      <p className="text-sand-600 text-sm font-semibold mt-0.5">
                                        €{(room.pricePerNight * nights).toFixed(0)} total
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-3 mt-3 text-xs text-sand-500">
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {room.capacity} guests
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <BedDouble className="h-3 w-3" />
                                    {room.beds}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Bath className="h-3 w-3" />
                                    {room.bathrooms} bath
                                  </span>
                                  {room.size && (
                                    <span className="flex items-center gap-1">
                                      <Maximize className="h-3 w-3" />
                                      {room.size}m²
                                    </span>
                                  )}
                                  {room.averageRating && (
                                    <span className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-gold-400 text-gold-400" />
                                      {room.averageRating.toFixed(1)} (
                                      {room.reviewCount})
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-end mt-3">
                                <span className="text-terracotta-500 text-sm font-semibold flex items-center gap-1">
                                  Select <ArrowRight className="h-4 w-4" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── STEP 3: Guest Details ──────────────────────────────── */}
            {step === 3 && selectedRoom && (
              <motion.div
                key="step3"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-sand-900">
                      Your Details
                    </h2>

                    <GlassCard className="p-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="guestName">Full Name *</Label>
                          <Input
                            id="guestName"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Your full name"
                            className="bg-white border-sand-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="guestEmail">Email *</Label>
                          <Input
                            id="guestEmail"
                            type="email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="bg-white border-sand-200"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="guestPhone">Phone Number *</Label>
                        <Input
                          id="guestPhone"
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+212 6XX XXX XXX"
                          className="bg-white border-sand-200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="specialRequests">
                          Special Requests
                          <span className="text-sand-400 text-xs ml-1">
                            (optional)
                          </span>
                        </Label>
                        <textarea
                          id="specialRequests"
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          rows={3}
                          className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-400 resize-none"
                          placeholder="Dietary requirements, arrival time, room preferences…"
                        />
                      </div>

                      <Button
                        onClick={() => {
                          if (!guestName || !guestEmail || !guestPhone) {
                            toast.error("Please fill in all required fields");
                            return;
                          }
                          setStep(4);
                        }}
                        className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl h-12 font-semibold"
                      >
                        Review Booking
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </GlassCard>
                  </div>

                  <div className="lg:col-span-1">
                    <BookingSummary
                      room={selectedRoom}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      guests={guests}
                      nights={nights}
                      total={total}
                      deposit={deposit}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 4: Confirm ────────────────────────────────────── */}
            {step === 4 && selectedRoom && (
              <motion.div
                key="step4"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-sand-900">
                      Review & Confirm
                    </h2>

                    {/* Guest info review */}
                    <GlassCard className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sand-900">
                          Guest Information
                        </h3>
                        <button
                          onClick={() => setStep(3)}
                          className="text-terracotta-500 text-sm hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-sand-400 text-xs mb-0.5">Name</p>
                          <p className="font-medium text-sand-900">
                            {guestName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sand-400 text-xs mb-0.5">Email</p>
                          <p className="font-medium text-sand-900">
                            {guestEmail}
                          </p>
                        </div>
                        <div>
                          <p className="text-sand-400 text-xs mb-0.5">Phone</p>
                          <p className="font-medium text-sand-900">
                            {guestPhone}
                          </p>
                        </div>
                        {specialRequests && (
                          <div className="col-span-2">
                            <p className="text-sand-400 text-xs mb-0.5">
                              Special Requests
                            </p>
                            <p className="font-medium text-sand-900">
                              {specialRequests}
                            </p>
                          </div>
                        )}
                      </div>
                    </GlassCard>

                    {/* Payment info */}
                    <GlassCard className="p-5">
                      <h3 className="font-semibold text-sand-900 mb-3">
                        Payment
                      </h3>
                      <div className="bg-sand-50 rounded-xl p-4 text-sm text-sand-600 space-y-2">
                        <p>
                          You'll receive payment instructions by email after
                          confirmation.
                        </p>
                        <p className="text-sand-500">
                          We accept: Bank Transfer · PayPal · Cash on Arrival
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-sand-200">
                          <span className="font-medium text-sand-800">
                            Deposit due now (30%)
                          </span>
                          <span className="font-bold text-gold-600 text-xl">
                            €{deposit.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </GlassCard>

                    {/* Auth guard */}
                    {authStatus === "unauthenticated" && (
                      <GlassCard className="p-5 border-terracotta-200 bg-terracotta-50/50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-terracotta-100 flex items-center justify-center shrink-0">
                            <LogIn className="h-5 w-5 text-terracotta-500" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sand-900 text-sm">
                              Sign in to complete your booking
                            </p>
                            <p className="text-sand-500 text-xs">
                              Create an account or sign in — it only takes a moment.
                            </p>
                          </div>
                          <Link
                            href={`/login?callbackUrl=${encodeURIComponent(
                              `/booking?room=${selectedRoom.slug}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
                            )}`}
                          >
                            <Button
                              size="sm"
                              className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full shrink-0"
                            >
                              Sign In
                            </Button>
                          </Link>
                        </div>
                      </GlassCard>
                    )}

                    <Button
                      onClick={handleSubmit}
                      disabled={
                        submitting || authStatus === "unauthenticated"
                      }
                      className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl h-14 text-base font-semibold disabled:opacity-60"
                    >
                      {submitting ? (
                        "Confirming…"
                      ) : (
                        <>
                          Confirm Booking
                          <Check className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                    <div className="flex items-start gap-2 text-xs text-sand-400">
                      <Shield className="h-3.5 w-3.5 text-olive-500 mt-0.5 shrink-0" />
                      Free cancellation up to 7 days before check-in. By
                      confirming you agree to our booking policies.
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <BookingSummary
                      room={selectedRoom}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      guests={guests}
                      nights={nights}
                      total={total}
                      deposit={deposit}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function BookingSummary({
  room,
  checkIn,
  checkOut,
  guests,
  nights,
  total,
  deposit,
}: {
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
  deposit: number;
}) {
  return (
    <div className="sticky top-36">
      <GlassCard className="p-5">
        <h3 className="font-heading text-base font-semibold text-sand-900 mb-4">
          Booking Summary
        </h3>

        <div className="relative h-32 rounded-xl overflow-hidden mb-4">
          <Image
            src={room.images[0]}
            alt={room.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sand-900/60 to-transparent" />
          <p className="absolute bottom-2.5 left-3 text-white font-semibold text-sm">
            {room.name}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          {[
            {
              label: "Check-in",
              value: checkIn
                ? new Date(checkIn).toLocaleDateString("en", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                : "—",
            },
            {
              label: "Check-out",
              value: checkOut
                ? new Date(checkOut).toLocaleDateString("en", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                : "—",
            },
            { label: "Guests", value: `${guests}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-sand-400">{label}</span>
              <span className="text-sand-800 font-medium">{value}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-sand-200 mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-sand-500">
              €{room.pricePerNight} × {nights} night
              {nights !== 1 ? "s" : ""}
            </span>
            <span className="text-sand-800">€{total.toFixed(0)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span className="text-sand-900">Total</span>
            <span className="text-terracotta-500 text-xl">
              €{total.toFixed(0)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-sand-500">Deposit (30%)</span>
            <span className="text-gold-600 font-semibold">
              €{deposit.toFixed(0)}
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
