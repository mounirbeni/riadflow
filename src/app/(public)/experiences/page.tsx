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
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, Clock, Plane, UtensilsCrossed, Compass, ChefHat } from "lucide-react";

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

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  async function fetchExperiences() {
    try {
      const res = await fetch("/api/experiences");
      const data = await res.json();
      if (data.success) setExperiences(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const categories = [...new Set(experiences.map((e) => e.category))];
  const filtered = activeCategory
    ? experiences.filter((e) => e.category === activeCategory)
    : experiences;

  return (
    <div className="min-h-full">
      <Navbar />

      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920&q=80"
            alt="Experiences"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-sand-900/50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Curated Experiences
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Discover the rich culture, traditions, and flavors of Morocco.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-sand-50 zellige-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-12">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !activeCategory
                    ? "bg-terracotta-500 text-white"
                    : "bg-white text-sand-600 hover:bg-sand-100"
                }`}
              >
                All
              </button>
              {categories.map((cat) => {
                const Icon = categoryIcons[cat] || Sparkles;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeCategory === cat
                        ? "bg-terracotta-500 text-white"
                        : "bg-white text-sand-600 hover:bg-sand-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {categoryLabels[cat] || cat}
                  </button>
                );
              })}
            </div>
          )}

          {loading ? (
            <LoadingSpinner text="Loading experiences..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((exp, index) => {
                const Icon = categoryIcons[exp.category] || Sparkles;
                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/experiences/${exp.slug}`}>
                      <GlassCard className="overflow-hidden h-full group cursor-pointer hover:shadow-xl transition-shadow duration-300">
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={exp.image}
                            alt={exp.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-sand-900/50 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/90 text-sand-800 backdrop-blur-sm">
                              <Icon className="h-3 w-3 mr-1" />
                              {categoryLabels[exp.category] || exp.category}
                            </Badge>
                          </div>
                          <div className="absolute bottom-4 right-4 bg-terracotta-500 text-white text-xs font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details →
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-heading text-xl font-semibold text-sand-900 mb-2 group-hover:text-terracotta-600 transition-colors">
                            {exp.name}
                          </h3>
                          <p className="text-sand-500 text-sm mb-4 line-clamp-3">
                            {exp.shortDesc || exp.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-sand-500">
                              <Clock className="h-4 w-4" />
                              {exp.duration}
                            </div>
                            <span className="font-heading text-xl font-semibold text-terracotta-500">
                              from €{exp.price}
                            </span>
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
      </section>

      <Footer />
    </div>
  );
}
