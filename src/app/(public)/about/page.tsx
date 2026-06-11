"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { SectionHeader } from "@/components/shared/section-header";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Heart, Award, Leaf, Clock, Star, Users, Home, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Authentic Hospitality",
    description:
      "We believe in the Moroccan tradition of generous hospitality — every guest is welcomed like family, with warmth and care.",
    color: "bg-terracotta-100 text-terracotta-600",
  },
  {
    icon: Award,
    title: "Uncompromising Quality",
    description:
      "From hand-carved cedar ceilings to bespoke zellige tiles, every detail reflects our dedication to authentic Moroccan craftsmanship.",
    color: "bg-gold-100 text-gold-600",
  },
  {
    icon: Leaf,
    title: "Sustainable Luxury",
    description:
      "We source locally, support artisan communities, and implement eco-friendly practices to preserve Morocco's beauty.",
    color: "bg-olive-100 text-olive-600",
  },
  {
    icon: Clock,
    title: "Timeless Experience",
    description:
      "In a world of rushing, we offer a sanctuary for slow living, meaningful connections, and memories that last a lifetime.",
    color: "bg-sand-200 text-sand-700",
  },
];

const team = [
  {
    name: "Karim El Mansouri",
    role: "Owner & Host",
    bio: "Born and raised in the Marrakech medina, Karim has spent 15 years restoring historic riads and sharing Moroccan hospitality with the world.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "Fatima Benali",
    role: "Guest Experience Manager",
    bio: "Fatima curates every detail of your stay — from airport arrival to the final farewell mint tea. Her attention to detail is legendary among our guests.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "Hassan Oumlil",
    role: "Head Chef",
    bio: "Chef Hassan learned traditional Moroccan cuisine from his grandmother and has refined it over 20 years in the finest riads of Marrakech and Fez.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Aicha Tazi",
    role: "Wellness & Hammam Specialist",
    bio: "A certified hammam therapist with 12 years of experience, Aicha provides traditional treatments that reconnect guests with ancient Moroccan wellness traditions.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
];

const achievements = [
  { icon: Star, value: "4.9★", label: "TripAdvisor Rating" },
  { icon: Users, value: "500+", label: "Happy Guests" },
  { icon: Home, value: "6", label: "Luxury Rooms" },
  { icon: Award, value: "4×", label: "Travellers' Choice" },
];

const timeline = [
  { year: "2012", event: "Karim discovers the abandoned 17th-century riad in the heart of Marrakech's medina and begins the restoration process." },
  { year: "2014", event: "After two years of meticulous restoration by master craftsmen, Riad Al Baraka opens its doors to its first guests." },
  { year: "2016", event: "Recognised as 'Best Boutique Riad in Marrakech' by Condé Nast Traveller. The hammam and rooftop terrace are added." },
  { year: "2019", event: "The riad expands to six rooms and launches its curated experiences programme — hammam, cooking classes, and medina tours." },
  { year: "2023", event: "Awarded TripAdvisor Travellers' Choice for the fourth consecutive year. Over 500 five-star reviews and counting." },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function AboutPage() {
  return (
    <div className="min-h-full">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1577898478989?w=1920&q=80"
            alt="About Riad Al Baraka"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sand-900/60 via-sand-900/40 to-sand-900/60" />
          <div className="absolute inset-0 zellige-pattern opacity-15" />
        </div>
        <div className="relative z-10 text-center px-4">
          <p className="font-accent italic text-gold-300 text-xl mb-4">Est. 2014 · Marrakech, Morocco</p>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            Our Story
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            A passion for Moroccan heritage, luxury hospitality, and human connection.
          </p>
        </div>
      </section>

      {/* Achievement Stats */}
      <section className="bg-sand-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {achievements.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="font-heading text-3xl font-bold text-gold-400 mb-1">{a.value}</p>
                <p className="text-sand-400 text-sm">{a.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32 bg-sand-50 zellige-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1528360983277?w=800&q=80"
                  alt="Riad Al Baraka Courtyard"
                  fill
                  className="object-cover"
                />
              </div>
              <GlassCard className="absolute -bottom-6 -right-6 p-4 max-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold-100 flex items-center justify-center shrink-0">
                    <Award className="h-5 w-5 text-gold-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sand-900 text-sm">Award Winning</p>
                    <p className="text-xs text-sand-500">Condé Nast Traveller</p>
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
              <p className="font-accent italic text-terracotta-500 text-xl mb-3">Since 2014</p>
              <h2 className="font-heading text-4xl md:text-5xl font-semibold text-sand-900 mb-6">
                A Sanctuary in the Heart of the Medina
              </h2>
              <div className="space-y-4 text-sand-600 leading-relaxed">
                <p>
                  Riad Al Baraka began as a single restored 17th-century riad — a building that
                  had stood for centuries, witnessed empires, and sheltered generations of Moroccan
                  families. Our founder Karim discovered it in 2012, half-abandoned and in need of
                  love. He saw not a ruin, but a story waiting to be told.
                </p>
                <p>
                  Two years of painstaking restoration followed. Master craftsmen from across
                  Morocco were brought in to revive the zellige tilework, carve the cedar ceilings,
                  and apply the traditional tadelakt plaster. Every material was sourced locally.
                  Every decision was made to honour the original architecture while adding the
                  comforts modern travelers expect.
                </p>
                <p>
                  Today, Riad Al Baraka is home to six exquisite suites, a traditional hammam,
                  a rooftop terrace, and a team of local experts devoted to one thing: making
                  your stay the most memorable of your life.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Timeline */}
          <div className="mb-24">
            <SectionHeader title="Our Journey" subtitle="From restoration dream to award-winning riad." />
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-sand-200 -translate-x-1/2" />
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex gap-6 mb-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"} text-left`}>
                    <GlassCard className="p-4">
                      <span className="font-heading text-terracotta-500 font-bold text-lg">{item.year}</span>
                      <p className="text-sand-600 text-sm mt-1 leading-relaxed">{item.event}</p>
                    </GlassCard>
                  </div>
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-terracotta-500 ring-4 ring-sand-50 mt-4 shrink-0" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Values */}
          <SectionHeader title="Our Values" subtitle="The principles that guide everything we do." />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24"
          >
            {values.map((value) => (
              <motion.div key={value.title} variants={fadeInUp}>
                <GlassCard className="p-6 h-full hover:shadow-xl transition-shadow">
                  <div className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl mb-4 ${value.color}`}>
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-sand-900 mb-2">{value.title}</h3>
                  <p className="text-sand-500 text-sm leading-relaxed">{value.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Team */}
          <SectionHeader
            title="Meet Our Team"
            subtitle="The passionate people behind every perfect stay."
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member) => (
              <motion.div key={member.name} variants={fadeInUp}>
                <GlassCard className="overflow-hidden h-full group hover:shadow-xl transition-shadow">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sand-900/60 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <p className="font-heading text-white font-semibold">{member.name}</p>
                      <p className="text-terracotta-300 text-xs">{member.role}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sand-500 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1587974928442?w=1920&q=80"
            alt="Riad courtyard"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-sand-900/70" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-accent italic text-gold-300 text-xl mb-4">Ready to Experience It?</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Come Stay With Us
            </h2>
            <p className="text-white/80 text-lg mb-10">
              Join over 500 guests who have discovered the magic of Riad Al Baraka.
              Book your stay today — we would love to welcome you.
            </p>
            <Link href="/booking">
              <Button
                size="lg"
                className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full px-10 py-6 text-lg"
              >
                Book Your Stay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
