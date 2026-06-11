"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { GlassCard } from "@/components/shared/glass-card";
import { SectionHeader } from "@/components/shared/section-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BedDouble,
  Bath,
  Maximize,
  Star,
  ArrowRight,
  Search,
  SlidersHorizontal,
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
  featured: boolean;
  averageRating: number | null;
  reviewCount: number;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestsFilter, setGuestsFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (data.success) setRooms(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredRooms = rooms.filter((room) => {
    if (guestsFilter && room.capacity < parseInt(guestsFilter)) return false;
    return true;
  });

  return (
    <div className="min-h-full">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1587974928442?w=1920&q=80"
            alt="Our Rooms"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-sand-900/50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Our Rooms
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Each room is a unique sanctuary blending traditional Moroccan elegance with modern comfort.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b border-sand-200 sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-400" />
                <Input
                  type="number"
                  placeholder="Min guests"
                  value={guestsFilter}
                  onChange={(e) => setGuestsFilter(e.target.value)}
                  className="pl-10 bg-sand-50 border-sand-200"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Room Grid */}
      <section className="py-12 md:py-20 bg-sand-50 zellige-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingSpinner text="Loading rooms..." />
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sand-500 text-lg">No rooms match your criteria.</p>
            </div>
          ) : (
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-3 md:pb-0">
              {filteredRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  className="w-[82vw] sm:w-80 md:w-auto flex-none md:flex-auto snap-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/rooms/${room.slug}`}>
                    <GlassCard className="overflow-hidden group cursor-pointer h-full">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={room.images[0] || "/placeholder-room.jpg"}
                          alt={room.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {room.featured && (
                          <Badge className="absolute top-4 left-4 bg-gold-500 text-white">
                            Featured
                          </Badge>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5">
                          <span className="font-heading text-lg font-semibold text-sand-900">
                            €{room.pricePerNight}
                          </span>
                          <span className="text-sand-500 text-sm">/night</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-heading text-xl font-semibold text-sand-900">
                            {room.name}
                          </h3>
                          {room.averageRating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                              <span className="text-sm text-sand-600">
                                {room.averageRating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sand-500 text-sm mb-4 line-clamp-2">
                          {room.shortDesc || room.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm text-sand-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {room.capacity}
                          </span>
                          <span className="flex items-center gap-1">
                            <BedDouble className="h-4 w-4" />
                            {room.beds}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            {room.bathrooms}
                          </span>
                          {room.size && (
                            <span className="flex items-center gap-1">
                              <Maximize className="h-4 w-4" />
                              {room.size}m²
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.slice(0, 3).map((amenity) => (
                            <Badge
                              key={amenity}
                              variant="secondary"
                              className="bg-sand-100 text-sand-600 text-xs"
                            >
                              {amenity}
                            </Badge>
                          ))}
                          {room.amenities.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="bg-sand-100 text-sand-600 text-xs"
                            >
                              +{room.amenities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
