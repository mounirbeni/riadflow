"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
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
  Quote,
} from "lucide-react";

/* ── Animation variants ─────────────────────────────────────────────── */
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_EXPO } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

/* ── Data ───────────────────────────────────────────────────────────── */
const featuredRooms = [
  {
    name: "Sultan Suite",
    slug: "sultan-suite",
    price: 280,
    rating: 5.0,
    reviews: 3,
    image: "https://images.unsplash.com/photo-1528360983277?w=800&q=80",
    guests: 2,
    beds: "1 King Bed",
    size: "55m²",
    badge: "Most Popular",
    badgeColor: "bg-terracotta-500",
  },
  {
    name: "Kasbah Suite",
    slug: "kasbah-suite",
    price: 420,
    rating: 5.0,
    reviews: 2,
    image: "https://images.unsplash.com/photo-1587974928442?w=800&q=80",
    guests: 2,
    beds: "1 King Bed",
    size: "60m²",
    badge: "Romantic Pick",
    badgeColor: "bg-gold-500",
  },
  {
    name: "Atlas Suite",
    slug: "atlas-suite",
    price: 350,
    rating: 5.0,
    reviews: 1,
    image: "https://images.unsplash.com/photo-1577898478989?w=800&q=80",
    guests: 4,
    beds: "2 King Beds",
    size: "75m²",
    badge: "Family Suite",
    badgeColor: "bg-olive-500",
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
    gradient: "from-terracotta-600/70 via-terracotta-500/50 to-transparent",
  },
  {
    name: "Medina Walking Tour",
    slug: "medina-walking-tour",
    description: "Discover hidden souks, historic palaces, and artisan workshops with our expert local guide.",
    price: 45,
    duration: "3 hours",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
    icon: MapPin,
    gradient: "from-sand-800/70 via-sand-700/50 to-transparent",
  },
  {
    name: "Rooftop Dinner",
    slug: "rooftop-dinner",
    description: "Multi-course Moroccan feast under the stars with live traditional music and candlelit ambiance.",
    price: 85,
    duration: "3 hours",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    icon: ChefHat,
    gradient: "from-gold-600/70 via-gold-500/50 to-transparent",
  },
  {
    name: "Atlas Mountains",
    slug: "atlas-mountains-excursion",
    description: "Full-day adventure to Berber villages, mountain valleys, and lunch with a local family.",
    price: 120,
    duration: "8 hours",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    icon: Mountain,
    gradient: "from-olive-700/70 via-olive-600/50 to-transparent",
  },
];

const reviews = [
  {
    name: "Sophie Laurent",
    location: "Paris, France",
    rating: 5,
    text: "The most magical anniversary trip of our lives. The Sultan Suite was breathtaking — rooftop views at sunset, rose petals on arrival, and a private hammam session. Karim and his team make you feel like royalty.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    stay: "7 nights · Sultan Suite",
  },
  {
    name: "James Wilson",
    location: "London, UK",
    rating: 5,
    text: "Absolute luxury in the heart of the medina. The Kasbah Suite's private plunge pool was our favourite spot. The rooftop dinner was the highlight of our entire Morocco trip. Every detail was thoughtfully arranged.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    stay: "5 nights · Kasbah Suite",
  },
  {
    name: "Alessandro Ferrari",
    location: "Milan, Italy",
    rating: 5,
    text: "As Italians we have high standards for food and hospitality — and Riad Al Baraka surpassed them completely. Every corner of this riad is a work of art.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    stay: "5 nights · Sultan Suite",
  },
];

const whyUs = [
  {
    icon: MapPin,
    title: "Prime Medina Location",
    description: "5-minute walk to Jemaa el-Fnaa square. Hidden inside the ancient medina, yet perfectly connected.",
    iconBg: "bg-terracotta-100",
    iconColor: "text-terracotta-600",
  },
  {
    icon: UtensilsCrossed,
    title: "Breakfast Included",
    description: "Every morning a lavish traditional breakfast — fresh msemen, amlou, seasonal fruits, and mint tea.",
    iconBg: "bg-gold-100",
    iconColor: "text-gold-600",
  },
  {
    icon: Award,
    title: "Award-Winning",
    description: "Recognised by Condé Nast Traveller and TripAdvisor Travellers' Choice. 500+ five-star reviews.",
    iconBg: "bg-olive-100",
    iconColor: "text-olive-600",
  },
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Book in minutes, pay only 30% deposit. Free cancellation up to 7 days before arrival.",
    iconBg: "bg-sand-200",
    iconColor: "text-sand-700",
  },
];

const stats = [
  { value: "4.9", suffix: "★", label: "Average Rating" },
  { value: "500", suffix: "+", label: "Happy Guests" },
  { value: "6", suffix: "", label: "Luxury Rooms" },
  { value: "10", suffix: "+", label: "Years of Excellence" },
];

const pressLogos = [
  "Condé Nast Traveller",
  "Travel + Leisure",
  "The Guardian",
  "Lonely Planet",
  "Vogue",
  "Forbes Travel",
];

/* ── Animated Counter ───────────────────────────────────────────────── */
function AnimatedStat({ value, suffix, label }: { value: string; suffix: string; label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE_EXPO }}
      className="text-center"
    >
      <p className="font-heading text-3xl md:text-4xl font-bold text-gold-400 tabular-nums">
        {value}
        <span className="text-gold-300">{suffix}</span>
      </p>
      <p className="text-sand-400 text-sm mt-1.5 tracking-wide">{label}</p>
    </motion.div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */
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

  /* Hero heading word-by-word animation */
  const heroWords = ["Where", "Morocco", "Comes", "Alive"];

  return (
    <div className="min-h-full">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1528360983277?w=1920&q=80"
            alt="Luxury Moroccan Riad courtyard"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sand-900/60 via-sand-900/35 to-sand-900/75" />
          <div className="absolute inset-0 zellige-pattern opacity-15" />
        </div>

        {/* Ambient glow orbs */}
        <div
          className="orb w-96 h-96 bg-terracotta-500/20 top-1/4 -left-24 animate-glow-pulse"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="orb w-80 h-80 bg-gold-400/15 bottom-1/4 -right-16 animate-glow-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full">

          {/* Award badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE_EXPO }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8"
          >
            <Award className="h-3.5 w-3.5 text-gold-300" />
            <span className="text-white/90 text-xs font-medium tracking-wide">
              Condé Nast Traveller · Best Riad 2024
            </span>
          </motion.div>

          {/* Accent text */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: EASE_EXPO }}
            className="font-accent italic text-gold-300 text-xl md:text-2xl mb-5 tracking-wide"
          >
            Bienvenue à Marrakech
          </motion.p>

          {/* Kinetic heading */}
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-3 leading-tight">
            <span className="block">
              {heroWords.slice(0, 2).map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" }}
                  animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.7, ease: EASE_EXPO }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block">
              {heroWords.slice(2).map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" }}
                  animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                  transition={{ delay: 0.74 + i * 0.12, duration: 0.7, ease: EASE_EXPO }}
                  className={`inline-block mr-[0.25em] ${i === 1 ? "text-terracotta-400" : ""}`}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7, ease: EASE_EXPO }}
            className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Discover Riad Al Baraka — a 17th-century treasure in the heart of the
            ancient medina. Six exquisite suites, eight curated experiences,
            and a team devoted to making your stay unforgettable.
          </motion.p>

          {/* Booking widget */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7, ease: EASE_EXPO }}
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto"
          >
            <GlassCard variant="elevated" className="p-2 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-white/85 border-white/60 shadow-[0_8px_40px_rgba(31,24,15,0.2)]">
              <div className="flex items-center gap-2 flex-1 px-4 py-2.5">
                <Calendar className="h-4 w-4 text-terracotta-500 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-[10px] text-sand-400 font-semibold tracking-widest uppercase">Check In</p>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-sand-900 text-sm font-medium focus:outline-none"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-sand-200" />
              <div className="flex items-center gap-2 flex-1 px-4 py-2.5">
                <Calendar className="h-4 w-4 text-terracotta-500 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-[10px] text-sand-400 font-semibold tracking-widest uppercase">Check Out</p>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-sand-900 text-sm font-medium focus:outline-none"
                    min={checkIn || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-sand-200" />
              <div className="flex items-center gap-2 px-4 py-2.5 min-w-[110px]">
                <Users className="h-4 w-4 text-terracotta-500 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-[10px] text-sand-400 font-semibold tracking-widest uppercase">Guests</p>
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
                className="bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white rounded-xl px-6 text-sm font-semibold shrink-0 shadow-sm hover:shadow-md hover:shadow-terracotta-500/30 transition-all"
              >
                Search
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </GlassCard>
          </motion.form>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <span className="text-white/40 text-[10px] tracking-widest uppercase font-medium">Scroll</span>
          <ChevronDown className="h-6 w-6 text-white/50 animate-bounce" />
        </motion.div>
      </section>

      {/* ── Trust Stats ──────────────────────────────────────────────────── */}
      <section className="bg-sand-900 py-8 zellige-pattern-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-sand-800/60">
            {stats.map((stat) => (
              <AnimatedStat key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform Preview ─────────────────────────────────────────────── */}
      <section className="bg-sand-50 overflow-hidden">
        <ContainerScroll
          titleComponent={
            <div className="mb-6">
              <p className="font-accent italic text-terracotta-500 text-lg md:text-xl mb-3 tracking-wide">
                The Riad Experience
              </p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-sand-900 leading-tight">
                Every corner tells
                <br />
                <span className="text-terracotta-500">a story</span>
              </h2>
              <p className="text-sand-600 text-base md:text-lg mt-4 max-w-xl mx-auto">
                Step inside Riad Al Baraka — centuries of Moroccan craftsmanship
                await you at every turn.
              </p>
            </div>
          }
        >
          <Image
            src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1400&q=80"
            alt="Riad Al Baraka interior courtyard"
            width={1400}
            height={700}
            className="mx-auto rounded-2xl object-cover h-full w-full object-center"
            draggable={false}
          />
        </ContainerScroll>
      </section>

      {/* ── Featured Rooms ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-sand-50 zellige-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            accent="Handcrafted Sanctuaries"
            title="Our Rooms & Suites"
            subtitle="Six sanctuary-like spaces — each handcrafted with authentic zellige, cedarwood, and tadelakt plaster."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-3 md:pb-0"
          >
            {featuredRooms.map((room) => (
              <motion.div key={room.slug} variants={fadeInUp} className="w-[82vw] sm:w-80 md:w-auto flex-none md:flex-auto snap-start">
                <Link href={`/rooms/${room.slug}`}>
                  <div className="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer h-full flex flex-col"
                    style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}>

                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={room.image}
                        alt={room.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-sand-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Badge */}
                      <div className={`absolute top-4 left-4 ${room.badgeColor} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm`}>
                        {room.badge}
                      </div>

                      {/* Price */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm">
                        <span className="font-heading text-lg font-bold text-sand-900">€{room.price}</span>
                        <span className="text-sand-500 text-xs">/night</span>
                      </div>

                      {/* Hover CTA overlay — slides up from bottom */}
                      <div className="card-reveal-overlay absolute bottom-0 left-0 right-0 p-4">
                        <Button size="sm" className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl font-semibold">
                          View Room
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-heading text-xl font-semibold text-sand-900 group-hover:text-terracotta-600 transition-colors duration-300">
                          {room.name}
                        </h3>
                        <div className="flex items-center gap-1 ml-2 shrink-0">
                          <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                          <span className="text-sm font-medium text-sand-700">{room.rating.toFixed(1)}</span>
                          <span className="text-xs text-sand-400">({room.reviews})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sand-400 text-xs mt-auto pt-3 border-t border-sand-100">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {room.guests} guests
                        </span>
                        <span>{room.beds}</span>
                        <span>{room.size}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE_EXPO }}
            className="text-center mt-12"
          >
            <Link href="/rooms">
              <Button
                variant="outline"
                size="lg"
                className="border-sand-300 text-sand-700 hover:border-terracotta-400 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-full px-10 transition-all duration-300"
              >
                View All 6 Rooms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            accent="The Riad Al Baraka Difference"
            title="Why Guests Choose Us"
            subtitle="More than a place to sleep — a complete Moroccan experience designed around you."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-3 md:pb-0"
          >
            {whyUs.map((item) => (
              <motion.div key={item.title} variants={fadeInUp} className="w-[75vw] sm:w-72 md:w-auto flex-none md:flex-auto snap-start">
                <GlassCard className="p-6 h-full flex flex-col items-start group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}>
                  <div className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl mb-4 ${item.iconBg} ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-5 w-5" />
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
        <div className="absolute inset-0 zellige-pattern-dark opacity-30" />
        {/* Ambient orb */}
        <div className="orb w-[500px] h-[500px] bg-terracotta-700/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            accent="Eight Curated Activities"
            title="Curated Experiences"
            subtitle="Hand-picked activities that bring the magic of Morocco directly to you."
            light
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-3 sm:pb-0"
          >
            {experiences.map((exp) => (
              <motion.div key={exp.slug} variants={fadeInUp} className="w-[82vw] sm:w-auto flex-none sm:flex-auto snap-start">
                <Link href="/experiences">
                  <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                  >
                    <Image
                      src={exp.image}
                      alt={exp.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                    />
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${exp.gradient}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-sand-900/80 via-transparent to-transparent" />

                    {/* Hover border glow */}
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/25 transition-all duration-500" />

                    <div className="absolute inset-0 p-5 flex flex-col justify-end">
                      <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/15 backdrop-blur-sm mb-3 border border-white/20">
                        <exp.icon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-white mb-1">
                        {exp.name}
                      </h3>
                      <p className="text-white/70 text-xs leading-relaxed line-clamp-2 mb-3">
                        {exp.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-white/70 text-xs">
                          <Clock className="h-3 w-3" />
                          {exp.duration}
                        </div>
                        <span className="bg-white/20 backdrop-blur-sm text-white font-semibold text-sm px-3 py-1 rounded-full border border-white/10">
                          From €{exp.price}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE_EXPO }}
            className="text-center mt-12"
          >
            <Link href="/experiences">
              <Button
                size="lg"
                variant="outline"
                className="border-white/25 text-white hover:bg-white/10 hover:border-white/40 rounded-full px-10 transition-all duration-300"
              >
                Explore All Experiences
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
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
              transition={{ duration: 0.8, ease: EASE_EXPO }}
              className="relative"
            >
              <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
                  alt="Moroccan Breakfast spread"
                  fill
                  className="object-cover"
                />
                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-sand-900/20 to-transparent" />
              </div>
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, x: 16 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6, ease: EASE_EXPO }}
                className="absolute -bottom-6 -right-6 max-w-[190px]"
              >
                <GlassCard variant="elevated" className="p-4">
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE_EXPO }}
            >
              <p className="font-accent italic text-terracotta-500 text-xl mb-3">
                A Feast for the Senses
              </p>
              <h2 className="font-heading text-4xl md:text-5xl font-semibold text-sand-900 mb-6 leading-tight">
                Authentic Moroccan
                <br />Breakfast, Every Morning
              </h2>
              <p className="text-sand-600 mb-8 leading-relaxed text-lg">
                Start your day in our sunlit courtyard or on the rooftop terrace.
                Our chef prepares a traditional spread each morning — the same
                breakfast Moroccan families have been sharing for centuries.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Freshly baked msemen, baghrir & Moroccan breads",
                  "Local organic honey, amlou & seasonal jams",
                  "Fresh-squeezed orange juice & seasonal fruits",
                  "Made-to-order eggs & traditional omelettes",
                  "Traditional mint tea ceremony",
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5, ease: EASE_EXPO }}
                    className="flex items-center gap-3 text-sand-700"
                  >
                    <div className="h-5 w-5 rounded-full bg-terracotta-100 flex items-center justify-center shrink-0">
                      <UtensilsCrossed className="h-2.5 w-2.5 text-terracotta-500" />
                    </div>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </motion.li>
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
            accent="Real Stories"
            title="What Our Guests Say"
            subtitle="From Paris to Milan — travellers who experienced the magic of Riad Al Baraka."
          />

          {/* Rating banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_EXPO }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 p-6 bg-white rounded-2xl border border-sand-200 max-w-xl mx-auto shadow-sm"
          >
            <div className="text-center shrink-0">
              <p className="font-heading text-5xl font-bold text-sand-900">4.9</p>
              <div className="flex gap-0.5 justify-center my-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="text-sand-400 text-xs font-medium tracking-wide uppercase">Overall Rating</p>
            </div>
            <div className="w-px h-14 bg-sand-200 hidden sm:block" />
            <div className="space-y-2.5 flex-1 w-full">
              {[["Cleanliness", 98], ["Service", 100], ["Location", 96], ["Value", 95]].map(([label, pct]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs text-sand-500 w-20 shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 bg-sand-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: EASE_EXPO, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full"
                    />
                  </div>
                  <span className="text-xs text-sand-600 font-medium w-8 shrink-0 text-right">{pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex md:grid md:grid-cols-3 gap-5 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-3 md:pb-0"
          >
            {reviews.map((review) => (
              <motion.div key={review.name} variants={fadeInUp} className="w-[88vw] sm:w-96 md:w-auto flex-none md:flex-auto snap-start">
                <GlassCard className="p-7 h-full flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}>
                  {/* Quote icon */}
                  <Quote className="h-8 w-8 text-terracotta-200 mb-3 fill-terracotta-100 group-hover:text-terracotta-300 transition-colors duration-300" />

                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <p className="text-sand-600 mb-6 flex-1 leading-relaxed text-sm">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-sand-100">
                    <div className="relative h-11 w-11 rounded-full overflow-hidden ring-2 ring-terracotta-200 shrink-0">
                      <Image src={review.image} alt={review.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-sand-900 text-sm">{review.name}</p>
                      <p className="text-xs text-sand-400">{review.location}</p>
                      <p className="text-xs text-terracotta-500 mt-0.5 font-medium">{review.stay}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Press Logos Marquee ───────────────────────────────────────────── */}
      <section className="py-10 bg-white border-y border-sand-200 overflow-hidden">
        <p className="text-center text-sand-400 text-[11px] font-semibold tracking-widest uppercase mb-7">
          As Featured In
        </p>
        <div className="relative">
          <div className="flex w-max animate-marquee gap-16 items-center">
            {[...pressLogos, ...pressLogos].map((name, i) => (
              <span
                key={i}
                className="font-heading text-xl font-semibold text-sand-300 hover:text-sand-500 transition-colors duration-300 cursor-default whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
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
              transition={{ duration: 0.8, ease: EASE_EXPO }}
            >
              <p className="font-accent italic text-terracotta-500 text-xl mb-3">Find Us</p>
              <h2 className="font-heading text-4xl font-semibold text-sand-900 mb-6 leading-tight">
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
                <Button variant="outline" className="border-terracotta-500 text-terracotta-500 hover:bg-terracotta-50 rounded-full transition-all duration-300">
                  Get Directions
                  <MapPin className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE_EXPO }}
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
                <GlassCard variant="elevated" className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-terracotta-100 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-terracotta-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sand-900 text-sm">Riad Al Baraka</p>
                      <p className="text-xs text-sand-500">Medina, Marrakech · 4.9★ on TripAdvisor</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-3 w-3 fill-gold-400 text-gold-400" />
                      ))}
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
            src="https://images.unsplash.com/photo-1577898478989?w=1920&q=80"
            alt="Riad courtyard at night"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sand-900/85 via-sand-900/75 to-sand-800/85" />
          <div className="absolute inset-0 zellige-pattern-dark opacity-20" />
        </div>
        {/* Glow orb */}
        <div className="orb w-[400px] h-[400px] bg-terracotta-600/25 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_EXPO }}
          >
            <p className="font-accent italic text-gold-300 text-2xl mb-4">
              Your Moroccan Story Begins Here
            </p>
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Book Your Stay Today
            </h2>
            <p className="text-white/75 text-lg mb-4 max-w-xl mx-auto">
              Reserve with just a 30% deposit. Free cancellation up to 7 days
              before arrival. Complimentary hammam for stays of 3 nights or more.
            </p>
            <p className="text-gold-300/80 text-sm mb-10 font-accent italic">
              &ldquo;The best riads sell out months in advance — don&apos;t miss your dates.&rdquo;
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <Button
                  size="lg"
                  className="bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white rounded-full px-10 py-6 text-lg shadow-lg hover:shadow-xl hover:shadow-terracotta-500/30 transition-all duration-300"
                >
                  Check Availability
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="https://wa.me/212524123456" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-10 py-6 text-lg transition-all duration-300"
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
