"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  BedDouble,
  Bath,
  Maximize,
  Star,
  ArrowLeft,
  Check,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  pricePerNight: number;
  capacity: number;
  beds: string;
  bathrooms: number;
  size?: number;
  amenities: string[];
  images: string[];
  reviews: {
    id: string;
    rating: number;
    title: string | null;
    content: string;
    createdAt: string;
    user: { name: string | null; image: string | null };
  }[];
}

function BookingCard({ room }: { room: Room }) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const total = nights * Number(room.pricePerNight);
  const deposit = total * 0.3;

  function handleBook() {
    const params = new URLSearchParams({ room: room.slug });
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", String(guests));
    router.push(`/booking?${params.toString()}`);
  }

  return (
    <div className="sticky top-24 space-y-4">
      <GlassCard className="p-6">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <span className="font-heading text-3xl font-bold text-sand-900">€{room.pricePerNight}</span>
            <span className="text-sand-500 text-sm ml-1">/ night</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-sand-600">
            <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
            <span className="font-medium">4.9</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {/* Check-in */}
          <div>
            <label className="text-xs font-semibold text-sand-500 uppercase tracking-wide mb-1 block">
              Check In
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-terracotta-500 pointer-events-none" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (checkOut && e.target.value >= checkOut) setCheckOut("");
                }}
                min={today}
                className="w-full pl-10 pr-3 py-2.5 border border-sand-200 rounded-xl bg-sand-50 text-sand-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-300"
              />
            </div>
          </div>

          {/* Check-out */}
          <div>
            <label className="text-xs font-semibold text-sand-500 uppercase tracking-wide mb-1 block">
              Check Out
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-terracotta-500 pointer-events-none" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || today}
                className="w-full pl-10 pr-3 py-2.5 border border-sand-200 rounded-xl bg-sand-50 text-sand-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-300"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="text-xs font-semibold text-sand-500 uppercase tracking-wide mb-1 block">
              Guests
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-terracotta-500 pointer-events-none" />
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full pl-10 pr-3 py-2.5 border border-sand-200 rounded-xl bg-sand-50 text-sand-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-300 cursor-pointer appearance-none"
              >
                {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        {nights > 0 && (
          <div className="border-t border-sand-200 pt-4 mb-4 space-y-2">
            <div className="flex justify-between text-sm text-sand-600">
              <span>€{room.pricePerNight} × {nights} night{nights > 1 ? "s" : ""}</span>
              <span className="font-medium text-sand-900">€{total.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm text-sand-600">
              <span>Deposit due now (30%)</span>
              <span className="font-semibold text-terracotta-500">€{deposit.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-sand-900 pt-1 border-t border-sand-100">
              <span>Total</span>
              <span>€{total.toFixed(0)}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleBook}
          className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl py-5 text-base font-semibold"
        >
          <Calendar className="mr-2 h-5 w-5" />
          {nights > 0 ? `Book ${nights} Night${nights > 1 ? "s" : ""}` : "Check Availability"}
        </Button>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-sand-500">
            <Shield className="h-3.5 w-3.5 text-olive-500 shrink-0" />
            Free cancellation up to 7 days before check-in
          </div>
          <div className="flex items-center gap-2 text-xs text-sand-500">
            <Clock className="h-3.5 w-3.5 text-olive-500 shrink-0" />
            Only 30% deposit required to confirm your stay
          </div>
        </div>
      </GlassCard>

      {/* Quick Info */}
      <GlassCard className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Users, label: "Capacity", value: `${room.capacity} guests` },
            { icon: BedDouble, label: "Beds", value: room.beds },
            { icon: Bath, label: "Bathrooms", value: room.bathrooms },
            ...(room.size ? [{ icon: Maximize, label: "Size", value: `${room.size}m²` }] : []),
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-terracotta-50 flex items-center justify-center shrink-0">
                <item.icon className="h-3.5 w-3.5 text-terracotta-500" />
              </div>
              <div>
                <p className="text-xs text-sand-500">{item.label}</p>
                <p className="text-sm font-medium text-sand-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export default function RoomDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (slug) fetchRoom();
  }, [slug]);

  async function fetchRoom() {
    try {
      const res = await fetch(`/api/rooms/${slug}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.success) setRoom(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading room details..." />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl text-sand-900 mb-4">Room Not Found</h1>
          <Link href="/rooms">
            <Button className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rooms
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating =
    room.reviews.length > 0
      ? room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length
      : 0;

  return (
    <div className="min-h-full">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-sand-500">
            <Link href="/" className="hover:text-terracotta-500">Home</Link>
            <span>/</span>
            <Link href="/rooms" className="hover:text-terracotta-500">Rooms</Link>
            <span>/</span>
            <span className="text-sand-700">{room.name}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="relative h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden">
            <Image
              src={room.images[currentImage] || "/placeholder-room.jpg"}
              alt={room.name}
              fill
              className="object-cover"
              priority
            />
            {room.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImage((prev) =>
                      prev === 0 ? room.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-sand-800" />
                </button>
                <button
                  onClick={() =>
                    setCurrentImage((prev) =>
                      prev === room.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-sand-800" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {room.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentImage
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          {room.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {room.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`relative h-20 w-28 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    i === currentImage
                      ? "border-terracotta-500"
                      : "border-transparent"
                  }`}
                >
                  <Image src={img} alt={`${room.name} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Room Details */}
      <section className="py-8 md:py-12 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-sand-900 mb-2">
                    {room.name}
                  </h1>
                  <div className="flex items-center gap-4 text-sand-500">
                    {averageRating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                        <span className="font-medium text-sand-700">
                          {averageRating.toFixed(1)}
                        </span>
                        <span>({room.reviews.length} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading text-3xl font-bold text-terracotta-500">
                    €{room.pricePerNight}
                  </p>
                  <p className="text-sand-500 text-sm">per night</p>
                </div>
              </div>

              <Tabs defaultValue="overview" className="mt-8">
                <TabsList className="bg-sand-100">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <GlassCard className="p-6">
                    <p className="text-sand-600 leading-relaxed whitespace-pre-line">
                      {room.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      {[
                        { icon: Users, label: "Guests", value: room.capacity },
                        { icon: BedDouble, label: "Beds", value: room.beds },
                        { icon: Bath, label: "Bathrooms", value: room.bathrooms },
                        ...(room.size
                          ? [{ icon: Maximize, label: "Size", value: `${room.size}m²` }]
                          : []),
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex flex-col items-center p-4 bg-sand-50 rounded-xl"
                        >
                          <item.icon className="h-6 w-6 text-terracotta-500 mb-2" />
                          <span className="text-lg font-semibold text-sand-900">
                            {item.value}
                          </span>
                          <span className="text-sm text-sand-500">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </TabsContent>

                <TabsContent value="amenities" className="mt-6">
                  <GlassCard className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {room.amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-3 p-3 bg-sand-50 rounded-lg"
                        >
                          <Check className="h-5 w-5 text-olive-500 flex-shrink-0" />
                          <span className="text-sand-700 text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <GlassCard className="p-6">
                    {room.reviews.length === 0 ? (
                      <p className="text-sand-500 text-center py-8">
                        No reviews yet. Be the first to review this room!
                      </p>
                    ) : (
                      <div className="space-y-6">
                        {room.reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b border-sand-200 pb-6 last:border-0"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-full bg-terracotta-100 flex items-center justify-center">
                                <span className="text-terracotta-600 font-medium">
                                  {review.user.name?.[0] || "G"}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sand-900">
                                  {review.user.name || "Guest"}
                                </p>
                                <div className="flex gap-1">
                                  {Array.from({ length: review.rating }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className="h-3 w-3 fill-gold-400 text-gold-400"
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            {review.title && (
                              <h4 className="font-medium text-sand-800 mb-2">
                                {review.title}
                              </h4>
                            )}
                            <p className="text-sand-600 text-sm">{review.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </TabsContent>

                <TabsContent value="policies" className="mt-6">
                  <GlassCard className="p-6">
                    <div className="space-y-4">
                      {[
                        {
                          title: "Check-in / Check-out",
                          text: "Check-in from 2:00 PM. Check-out until 12:00 PM. Early check-in and late check-out available upon request.",
                        },
                        {
                          title: "Cancellation Policy",
                          text: "Free cancellation up to 7 days before arrival. Cancellations within 7 days are subject to a charge of the first night's stay.",
                        },
                        {
                          title: "Children & Extra Beds",
                          text: "Children of all ages are welcome. Extra beds available upon request for an additional charge.",
                        },
                        {
                          title: "Pets",
                          text: "Pets are not allowed in the riad to ensure a peaceful environment for all guests.",
                        },
                        {
                          title: "Smoking",
                          text: "Smoking is only permitted in designated outdoor areas. All rooms are non-smoking.",
                        },
                      ].map((policy) => (
                        <div key={policy.title}>
                          <h4 className="font-medium text-sand-800 mb-1">
                            {policy.title}
                          </h4>
                          <p className="text-sand-500 text-sm">{policy.text}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </TabsContent>
              </Tabs>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <BookingCard room={room} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
