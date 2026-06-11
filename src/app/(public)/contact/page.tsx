"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full">
      <Navbar />

      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920&q=80"
            alt="Contact"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-sand-900/50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            We'd love to hear from you. Reach out for bookings, questions, or just to say hello.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-sand-50 zellige-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <GlassCard className="p-6">
                <h3 className="font-heading text-xl font-semibold text-sand-900 mb-6">
                  Get in Touch
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-terracotta-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-terracotta-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sand-800">Address</p>
                      <p className="text-sand-500 text-sm">
                        12 Derb El Hamam<br />Medina, Marrakech 40000<br />Morocco
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-terracotta-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-terracotta-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sand-800">Phone</p>
                      <a href="tel:+212524123456" className="text-sand-500 text-sm hover:text-terracotta-500">
                        +212 524 123 456
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-terracotta-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-terracotta-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sand-800">Email</p>
                      <a href="mailto:hello@riadflow.com" className="text-sand-500 text-sm hover:text-terracotta-500">
                        hello@riadflow.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-terracotta-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-terracotta-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sand-800">Reception Hours</p>
                      <p className="text-sand-500 text-sm">24/7 — Always open</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/212524123456"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <GlassCard className="p-6 bg-olive-50/50 border-olive-200 hover:bg-olive-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-olive-100 flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-olive-500" />
                    </div>
                    <div>
                      <p className="font-medium text-olive-700">Chat on WhatsApp</p>
                      <p className="text-olive-500 text-sm">Quick responses, any time</p>
                    </div>
                  </div>
                </GlassCard>
              </a>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <GlassCard className="p-8">
                <h3 className="font-heading text-2xl font-semibold text-sand-900 mb-6">
                  Send a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        required
                        className="bg-sand-50 border-sand-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        className="bg-sand-50 border-sand-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What's this about?"
                      required
                      className="bg-sand-50 border-sand-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more..."
                      rows={6}
                      required
                      className="bg-sand-50 border-sand-200 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full px-8"
                  >
                    {loading ? "Sending..." : "Send Message"}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
