"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import {
  ArrowRight,
  Star,
  ChevronDown,
  Sparkles,
  MapPin,
  Clock,
  Users,
  UtensilsCrossed,
  Calendar,
  Award,
  Shield,
  Leaf,
  ChefHat,
  Waves,
  Mountain,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const featuredRooms = [
  {
    name: "Sultan Suite",
    slug: "sultan-suite",
    price: 280,
    rating: 5.0,
    reviews: 3,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    guests: 2,
    beds: "1 King Bed",
    size: "55m²",
    badge: "Most Popular",
  },
  {
    name: "Kasbah Suite",
    slug: "kasbah-suite",
    price: 420,
    rating: 5.0,
    reviews: 2,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    guests: 2,
    beds: "1 King Bed",
    size: "60m²",
    badge: "Romantic Pick",
  },
  {
    name: "Atlas Suite",
    slug: "atlas-suite",
    price: 350,
    rating: 5.0,
    reviews: 1,
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
    guests: 4,
    beds: "2 King Beds",
    size: "75m²",
    badge: "Family Suite",
  },
];

const experiences = [
  {
    name: "Traditional Hammam",
    slug: "traditional-hammam",
    description: "Authentic black soap ritual, ghassoul clay mask & argan oil massage in our private steam room.",
    price: 75,
    duration: "2 hours",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    icon: Waves,
    color: "from-terracotta-500/80",
  },
  {
    name: "Medina Walking Tour",
    slug: "medina-walking-tour",
    description: "Discover hidden souks, historic palaces, and artisan workshops with our expert local guide.",
    price: 45,
    duration: "3 hours",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
    icon: MapPin,
    color: "from-sand-700/80",
  },
  {
    name: "Rooftop Dinner",
    slug: "rooftop-dinner",
    description: "Multi-course Moroccan feast under the stars with live traditional music and candlelit ambiance.",
    price: 85,
    duration: "3 hours",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    icon: ChefHat,
    color: "from-gold-500/80",
  },
  {
    name: "Atlas Mountains",
    slug: "atlas-mountains-excursion",
    description: "Full-day adventure to Berber villages, mountain valleys, and lunch with a local family.",
    price: 120,
    duration: "8 hours",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    icon: Mountain,
    color: "from-olive-600/80",
  },
];

const reviews = [
  {
    name: "Sophie Laurent",
    location: "Paris, France",
    rating: 5,
    text: "The most magical anniversary trip of our lives. The Sultan Suite was breathtaking — rooftop views at sunset, rose petals on arrival, and a private hammam session. Karim and his team make you feel like royalty. We will absolutely return.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    stay: "7 nights · Sultan Suite",
  },
  {
    name: "James Wilson",
    location: "London, UK",
    rating: 5,
    text: "Absolute luxury in the heart of the medina. The Kasbah Suite's private plunge pool was our favourite spot. The rooftop dinner was the highlight of our entire Morocco trip. Every detail was thoughtfully arranged. Highly recommend.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    stay: "5 nights · Kasbah Suite",
  },
  {
    name: "Alessandro Ferrari",
    location: "Milan, Italy",
    rating: 5,
    text: "As Italians we have high standards for food and hospitality — and Riad Al Baraka surpassed them completely. We had rooftop dinners every evening and each one was a masterpiece. Every corner of this riad is a work of art.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    stay: "5 nights · Sultan Suite",
  },
];

const whyUs = [
  {
    icon: MapPin,
    title: "Prime Medina Location",
    description: "5-minute walk to Jemaa el-Fnaa square. Hidden inside the ancient medina, yet perfectly connected to all of Marrakech.",
    color: "bg-terracotta-100 text-terracotta-600",
  },
  {
    icon: UtensilsCrossed,
    title: "Moroccan Breakfast Included",
    description: "Every morning a lavish traditional breakfast — fresh msemen, amlou, seasonal fruits, and freshly brewed mint tea.",
    color: "bg-gold-100 text-gold-600",
  },
  {
    icon: Award,
    title: "Award-Winning Hospitality",
    description: "Recognised by Condé Nast Traveller and TripAdvisor Travellers' Choice. Over 500 five-star reviews worldwide.",
    color: "bg-olive-100 text-olive-600",
  },
  {
    icon: Shield,
    title: "Secure & Easy Booking",
    description: "Book online in minutes, pay only a 30% deposit. Full flexibility — free cancellation up to 7 days before arrival.",
    color: "bg-sand-200 text-sand-700",
  },
];

const stats = [
  { value: "4.9★", label: "Average Rating" },
  { value: "500+", label: "Happy Guests" },
  { value: "6", label: "Luxury Rooms" },
  { value: "10+", label: "Years of Excellence" },
];

const pressLogos = [
  "Condé Nast Traveller",
  "Travel + Leisure",
  "The Guardian",
  "Lonely Planet",
];

export default function HomePage() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    router.push(`/booking?${params.toString()}`);
  }

  return (
    <div className="min-h-full">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
            alt="Luxury Moroccan Riad courtyard"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sand-900/50 via-sand-900/30 to-sand-900/70" />
          <div className="absolute inset-0 zellige-pattern opacity-20" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full"
        >
          <motion.p
            variants={fadeInUp}
            className="font-accent italic text-gold-300 text-xl md:text-2xl mb-4 tracking-wide"
          >
            Bienvenue à Marrakech
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
          >
            Where Morocco
            <br />
            <span className="text-terracotta-400">Comes Alive</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Discover Riad Al Baraka — a 17th-century treasure in the heart of the
            ancient medina. Six exquisite suites, eight curated experiences,
            and a team devoted to making your stay unforgettable.
          </motion.p>

          {/* Hero booking widget */}
          <motion.form
            variants={fadeInUp}
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto"
          >
            <GlassCard className="p-2 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <div className="flex items-center gap-2 flex-1 px-3 py-2">
                <Calendar className="h-4 w-4 text-terracotta-500 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-xs text-sand-500 font-medium">CHECK IN</p>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-sand-900 text-sm font-medium focus:outline-none"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-sand-200" />
              <div className="flex items-center gap-2 flex-1 px-3 py-2">
                <Calendar className="h-4 w-4 text-terracotta-500 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-xs text-sand-500 font-medium">CHECK OUT</p>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-sand-900 text-sm font-medium focus:outline-none"
                    min={checkIn || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-sand-200" />
              <div className="flex items-center gap-2 px-3 py-2 min-w-[120px]">
                <Users className="h-4 w-4 text-terracotta-500 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-xs text-sand-500 font-medium">GUESTS</p>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent text-sand-900 text-sm font-medium focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl px-6 py-3 text-sm font-semibold shrink-0"
              >
                Search
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </GlassCard>
          </motion.form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-8 w-8 text-white/60 animate-bounce" />
        </motion.div>
      </section>

      {/* ── Trust Stats Strip ────────────────────────────────────────────── */}
      <section className="bg-sand-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="font-heading text-2xl md:text-3xl font-bold text-gold-400">
                  {stat.value}
                </p>
                <p className="text-sand-400 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Rooms ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-sand-50 zellige-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Rooms & Suites"
            subtitle="Six sanctuary-like spaces — each one handcrafted with authentic zellige, cedarwood, and tadelakt plaster."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredRooms.map((room) => (
              <motion.div key={room.slug} variants={fadeInUp}>
                <Link href={`/rooms/${room.slug}`}>
                  <GlassCard className="overflow-hidden group cursor-pointer h-full flex flex-col">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={room.image}
                        alt={room.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-sand-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Badge */}
                      <div className="absolute top-4 left-4 bg-terracotta-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {room.badge}
                      </div>
                      {/* Price */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5">
                        <span className="font-heading text-lg font-bold text-sand-900">€{room.price}</span>
                        <span className="text-sand-500 text-xs">/night</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-heading text-xl font-semibold text-sand-900">
                          {room.name}
                        </h3>
                        <div className="flex items-center gap-1 ml-2 shrink-0">
                          <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                          <span className="text-sm font-medium text-sand-700">{room.rating.toFixed(1)}</span>
                          <span className="text-xs text-sand-400">({room.reviews})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sand-500 text-sm mt-auto pt-3 border-t border-sand-100">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {room.guests} guests
                        </span>
                        <span>{room.beds}</span>
                        <span>{room.size}</span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link href="/rooms">
              <Button
                variant="outline"
                size="lg"
                className="border-terracotta-500 text-terracotta-500 hover:bg-terracotta-50 rounded-full px-10"
              >
                View All 6 Rooms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Guests Choose Us"
            subtitle="More than a place to sleep — a complete Moroccan experience designed around you."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {whyUs.map((item) => (
              <motion.div key={item.title} variants={fadeInUp}>
                <GlassCard className="p-6 h-full flex flex-col items-start hover:shadow-xl transition-shadow duration-300">
                  <div className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl mb-4 ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-sand-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sand-500 text-sm leading-relaxed">{item.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Experiences ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-sand-900 relative overflow-hidden">
        <div className="absolute inset-0 zellige-pattern opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Curated Experiences"
            subtitle="Eight hand-picked activities that bring the magic of Morocco directly to you."
            light
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {experiences.map((exp) => (
              <motion.div key={exp.slug} variants={fadeInUp}>
                <Link href="/experiences">
                  <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
                    <Image
                      src={exp.image}
                      alt={exp.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${exp.color} to-transparent`} />
                    <div className="absolute inset-0 p-5 flex flex-col justify-end">
                      <div className="mb-2">
                        <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm mb-3">
                          <exp.icon className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-white mb-1">
                          {exp.name}
                        </h3>
                        <p className="text-white/75 text-xs leading-relaxed line-clamp-2 mb-3">
                          {exp.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-white/80 text-xs">
                          <Clock className="h-3.5 w-3.5" />
                          {exp.duration}
                        </div>
                        <span className="bg-white/20 backdrop-blur-sm text-white font-semibold text-sm px-3 py-1 rounded-full">
                          From €{exp.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link href="/experiences">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-full px-10"
              >
                Explore All Experiences
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Breakfast Section ────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-sand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
                  alt="Moroccan Breakfast spread"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating badge */}
              <GlassCard className="absolute -bottom-6 -right-6 p-4 max-w-[180px]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-terracotta-100 flex items-center justify-center shrink-0">
                    <UtensilsCrossed className="h-5 w-5 text-terracotta-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sand-900 text-sm">Free Daily</p>
                    <p className="text-xs text-sand-500">Moroccan Breakfast</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="font-accent italic text-terracotta-500 text-xl mb-3">
                A Feast for the Senses
              </p>
              <h2 className="font-heading text-4xl md:text-5xl font-semibold text-sand-900 mb-6">
                Authentic Moroccan
                <br />Breakfast, Every Morning
              </h2>
              <p className="text-sand-600 mb-8 leading-relaxed text-lg">
                Start your day in our sunlit courtyard or on the rooftop terrace.
                Our chef prepares a traditional spread each morning — the same
                breakfast Moroccan families have been sharing for centuries.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Freshly baked msemen, baghrir & Moroccan breads",
                  "Local organic honey, amlou & seasonal jams",
                  "Fresh-squeezed orange juice & seasonal fruits",
                  "Made-to-order eggs & traditional omelettes",
                  "Traditional mint tea ceremony",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sand-700">
                    <div className="h-5 w-5 rounded-full bg-terracotta-100 flex items-center justify-center shrink-0">
                      <UtensilsCrossed className="h-3 w-3 text-terracotta-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm bg-terracotta-50 border border-terracotta-200 rounded-xl px-4 py-3 text-terracotta-700 inline-block">
                <span className="font-semibold">Complimentary</span> — included with every room booking, every morning.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Guest Reviews ────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-sand-50 zellige-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="What Our Guests Say"
            subtitle="Real stories from travellers who experienced the magic of Riad Al Baraka."
          />

          {/* Overall rating banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 p-6 bg-white rounded-2xl border border-sand-200 max-w-xl mx-auto"
          >
            <div className="text-center">
              <p className="font-heading text-5xl font-bold text-sand-900">4.9</p>
              <div className="flex gap-1 justify-center my-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="text-sand-500 text-sm">Overall Rating</p>
            </div>
            <div className="w-px h-16 bg-sand-200 hidden sm:block" />
            <div className="space-y-2 flex-1 w-full">
              {[["Cleanliness", 98], ["Service", 100], ["Location", 96], ["Value", 95]].map(([label, pct]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs text-sand-500 w-20 shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 bg-sand-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-sand-600 font-medium w-8 shrink-0">{pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {reviews.map((review) => (
              <motion.div key={review.name} variants={fadeInUp}>
                <GlassCard className="p-8 h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <p className="text-sand-600 mb-6 flex-1 leading-relaxed italic">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-sand-100">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-terracotta-200">
                      <Image src={review.image} alt={review.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-sand-900">{review.name}</p>
                      <p className="text-xs text-sand-500">{review.location}</p>
                      <p className="text-xs text-terracotta-500 mt-0.5">{review.stay}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── As Featured In ───────────────────────────────────────────────── */}
      <section className="py-12 bg-white border-y border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sand-400 text-sm font-medium tracking-widest uppercase mb-8">
            As Featured In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {pressLogos.map((name) => (
              <motion.div
                key={name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-sand-400 font-heading text-lg md:text-xl font-semibold tracking-tight hover:text-sand-600 transition-colors cursor-default"
              >
                {name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="font-accent italic text-terracotta-500 text-xl mb-3">
                Find Us
              </p>
              <h2 className="font-heading text-4xl font-semibold text-sand-900 mb-6">
                In the Heart of the
                <br />Ancient Medina
              </h2>
              <div className="space-y-4 text-sand-600 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-terracotta-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sand-800">12 Derb Lalla Aziza</p>
                    <p className="text-sm">Medina, Marrakech 40000, Morocco</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-terracotta-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sand-800">Check-in 3:00 PM · Check-out 11:00 AM</p>
                    <p className="text-sm">Early/late available on request</p>
                  </div>
                </div>
              </div>
              <ul className="space-y-2 mb-8">
                {[
                  "5 min walk to Jemaa el-Fnaa",
                  "10 min walk to the Bahia Palace",
                  "15 min drive from Marrakech Menara Airport",
                  "Private airport transfer available from €35",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sand-600 text-sm">
                    <Leaf className="h-3.5 w-3.5 text-olive-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-terracotta-500 text-terracotta-500 hover:bg-terracotta-50 rounded-full"
                >
                  Get Directions
                  <MapPin className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80"
                alt="Marrakech Medina"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sand-900/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <GlassCard className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-terracotta-100 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-terracotta-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sand-900 text-sm">Riad Al Baraka</p>
                      <p className="text-xs text-sand-500">Medina, Marrakech · 4.9★ on TripAdvisor</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="h-3 w-3 fill-gold-400 text-gold-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&q=80"
            alt="Riad courtyard at night"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-sand-900/75" />
          <div className="absolute inset-0 zellige-pattern opacity-10" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-accent italic text-gold-300 text-2xl mb-4">
              Your Moroccan Story Begins Here
            </p>
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
              Book Your Stay Today
            </h2>
            <p className="text-white/80 text-lg mb-4 max-w-xl mx-auto">
              Reserve with just a 30% deposit. Free cancellation up to 7 days
              before arrival. Complimentary hammam for stays of 3 nights or more.
            </p>
            <p className="text-gold-300 text-sm mb-10 font-accent italic">
              &ldquo;The best riads sell out months in advance — don&apos;t miss your dates.&rdquo;
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <Button
                  size="lg"
                  className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full px-10 py-6 text-lg shadow-lg"
                >
                  Check Availability
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="https://wa.me/212524123456" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 rounded-full px-10 py-6 text-lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
