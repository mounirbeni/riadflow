"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  Users,
  Calendar,
  Check,
  Sparkles,
  MapPin,
  Plane,
  UtensilsCrossed,
  Compass,
  ChefHat,
  ArrowRight,
  Shield,
  Star,
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  HAMMAM: Sparkles,
  MEDINA_TOUR: MapPin,
  AIRPORT_TRANSFER: Plane,
  DINNER: UtensilsCrossed,
  EXCURSION: Compass,
  COOKING_CLASS: ChefHat,
};

const categoryLabels: Record<string, string> = {
  HAMMAM: "Wellness",
  MEDINA_TOUR: "Culture",
  AIRPORT_TRANSFER: "Transport",
  DINNER: "Dining",
  EXCURSION: "Adventure",
  COOKING_CLASS: "Learning",
};

const inclusions: Record<string, string[]> = {
  HAMMAM: [
    "Black soap (beldi) full body exfoliation",
    "Ghassoul clay body mask application",
    "60-minute argan oil relaxation massage",
    "Access to traditional steam room",
    "Relaxation lounge with mint tea & sweets",
    "Premium organic Moroccan skincare products",
    "Complimentary bath robes & slippers",
  ],
  MEDINA_TOUR: [
    "Expert English-speaking local guide",
    "Entrance to Bahia Palace & Ben Youssef Medersa",
    "Visit to traditional artisan workshops (tanneries, ceramics, weaving)",
    "Hidden souk route away from tourist crowds",
    "Street food tastings at local stalls",
    "Traditional mint tea stop mid-tour",
    "Small group (max 8 people) or private option",
  ],
  AIRPORT_TRANSFER: [
    "Meet & greet at arrivals with name board",
    "Premium air-conditioned vehicle",
    "Professional licensed driver",
    "Luggage assistance",
    "Complimentary bottled water & WiFi",
    "Flight monitoring (no extra charge for delays)",
    "Door-to-door service to the riad",
  ],
  DINNER: [
    "5-course traditional Moroccan feast",
    "Live traditional Gnawa music performance",
    "Welcome cocktail on arrival",
    "Freshly baked Moroccan bread & dips",
    "Main course: tagine or couscous selection",
    "Traditional pastilla (pigeon or chicken)",
    "Dessert spread with Moroccan pastries & tea",
  ],
  EXCURSION: [
    "Private air-conditioned 4×4 transport",
    "Licensed English-speaking mountain guide",
    "Visit to 3 traditional Berber villages",
    "Guided hike through Ourika Valley",
    "Traditional Berber lunch at a family home",
    "Mule trek through the mountains (optional)",
    "All entrance fees and permits included",
  ],
  COOKING_CLASS: [
    "Guided morning market visit with Chef Hassan",
    "Hands-on cooking of 3 traditional dishes",
    "Full Moroccan lunch of your own creations",
    "Moroccan wine or juice pairing",
    "Printed recipe cards to take home",
    "Cooking apron as a souvenir",
    "Maximum 8 guests per class",
  ],
};

interface Experience {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  price: number;
  duration: string;
  image: string;
  category: string;
}

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    if (slug) fetchExperience();
  }, [slug]);

  async function fetchExperience() {
    try {
      const res = await fetch(`/api/experiences/${slug}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.success) setExperience(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading experience..." />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl text-sand-900 mb-4">Experience Not Found</h1>
          <Link href="/experiences">
            <Button className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Experiences
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = categoryIcons[experience.category] || Sparkles;
  const label = categoryLabels[experience.category] || experience.category;
  const included = inclusions[experience.category] || [];
  const totalPrice = experience.price * guests;

  return (
    <div className="min-h-full">
      <Navbar />

      {/* Hero Image */}
      <section className="relative h-[55vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src={experience.image}
            alt={experience.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sand-900/30 via-sand-900/20 to-sand-900/70" />
          <div className="absolute inset-0 zellige-pattern opacity-10" />
        </div>

        {/* Breadcrumb */}
        <div className="absolute top-24 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/experiences" className="hover:text-white transition-colors">Experiences</Link>
              <span>/</span>
              <span className="text-white">{experience.name}</span>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full mb-4">
                <Icon className="h-4 w-4" />
                {label}
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {experience.name}
              </h1>
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{experience.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                  <span>4.9 · Highly Rated</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-8">

              {/* Description */}
              <GlassCard className="p-8">
                <h2 className="font-heading text-2xl font-semibold text-sand-900 mb-4">
                  About This Experience
                </h2>
                <p className="text-sand-600 leading-relaxed text-lg">
                  {experience.description}
                </p>
              </GlassCard>

              {/* What's Included */}
              {included.length > 0 && (
                <GlassCard className="p-8">
                  <h2 className="font-heading text-2xl font-semibold text-sand-900 mb-6">
                    What&apos;s Included
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {included.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-olive-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-olive-600" />
                        </div>
                        <span className="text-sand-700 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Practical Info */}
              <GlassCard className="p-8">
                <h2 className="font-heading text-2xl font-semibold text-sand-900 mb-6">
                  Good to Know
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: Clock,
                      title: "Duration",
                      detail: experience.duration,
                    },
                    {
                      icon: Users,
                      title: "Group Size",
                      detail: experience.category === "AIRPORT_TRANSFER" ? "Private" : "Max 8 guests",
                    },
                    {
                      icon: Calendar,
                      title: "Availability",
                      detail: "Daily, subject to booking",
                    },
                    {
                      icon: MapPin,
                      title: "Meeting Point",
                      detail: experience.category === "AIRPORT_TRANSFER"
                        ? "Marrakech Airport Arrivals"
                        : "Riad Al Baraka reception",
                    },
                  ].map((info) => (
                    <div key={info.title} className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-terracotta-50 flex items-center justify-center shrink-0">
                        <info.icon className="h-5 w-5 text-terracotta-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sand-800 text-sm">{info.title}</p>
                        <p className="text-sand-500 text-sm mt-0.5">{info.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Right: Booking Widget */}
            <div className="space-y-4">
              <div className="sticky top-24">
                <GlassCard className="p-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <span className="font-heading text-3xl font-bold text-sand-900">
                        €{experience.price}
                      </span>
                      <span className="text-sand-500 text-sm ml-1">/ person</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                      <span className="text-sm font-medium text-sand-700">4.9</span>
                    </div>
                  </div>

                  <p className="text-sand-500 text-sm mb-6 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    {experience.duration}
                  </p>

                  {/* Guests selector */}
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-sand-500 uppercase tracking-wide mb-1.5 block">
                      Number of Guests
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-terracotta-500 pointer-events-none" />
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-2.5 border border-sand-200 rounded-xl bg-sand-50 text-sand-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-300 cursor-pointer appearance-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="border-t border-sand-200 pt-4 mb-5 space-y-2">
                    <div className="flex justify-between text-sm text-sand-600">
                      <span>€{experience.price} × {guests} {guests === 1 ? "guest" : "guests"}</span>
                      <span className="font-medium text-sand-900">€{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-sand-900">
                      <span>Total</span>
                      <span>€{totalPrice}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push(`/booking?experience=${experience.slug}&guests=${guests}`)}
                    className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl py-5 text-base font-semibold"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book This Experience
                  </Button>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-sand-500">
                      <Shield className="h-3.5 w-3.5 text-olive-500 shrink-0" />
                      Free cancellation up to 48 hours before
                    </div>
                    <div className="flex items-center gap-2 text-xs text-sand-500">
                      <Check className="h-3.5 w-3.5 text-olive-500 shrink-0" />
                      Instant confirmation
                    </div>
                  </div>
                </GlassCard>

                {/* Need help? */}
                <GlassCard className="p-4 mt-4">
                  <p className="text-sm font-medium text-sand-800 mb-1">Need help deciding?</p>
                  <p className="text-xs text-sand-500 mb-3">Our team is happy to answer any questions about this experience.</p>
                  <a href="https://wa.me/212524123456" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full border-olive-300 text-olive-700 hover:bg-olive-50 rounded-lg text-xs">
                      WhatsApp Us
                    </Button>
                  </a>
                </GlassCard>
              </div>
            </div>
          </div>

          {/* Back to Experiences */}
          <div className="mt-12 pt-8 border-t border-sand-200">
            <Link href="/experiences">
              <Button variant="outline" className="border-terracotta-500 text-terracotta-500 hover:bg-terracotta-50 rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Experiences
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
            alt="Riad Al Baraka"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-sand-900/70" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <p className="font-accent italic text-gold-300 text-xl mb-4">Complete Your Stay</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
            Combine with a Room Booking
          </h2>
          <p className="text-white/80 mb-8">
            Book a room and add experiences at checkout for a seamlessly curated Moroccan stay.
          </p>
          <Link href="/rooms">
            <Button size="lg" className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full px-10">
              Explore Our Rooms
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
