"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Users, Search, Mail, Calendar } from "lucide-react";

interface Guest {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  createdAt: string;
  _count: { bookings: number };
}

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchGuests();
  }, []);

  async function fetchGuests() {
    try {
      const res = await fetch("/api/admin/guests");
      const data = await res.json();
      if (data.success) setGuests(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = guests.filter(
    (g) =>
      (g.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase()) ||
      (g.country?.toLowerCase() || "").includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading guests..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-sand-900 mb-2">Guests</h1>
          <p className="text-sand-500">Manage your guest directory</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-400" />
        <input
          type="text"
          placeholder="Search guests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((guest, index) => (
          <motion.div
            key={guest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <GlassCard className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-terracotta-100 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-terracotta-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sand-900">
                      {guest.name || "Unnamed Guest"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-sand-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {guest.email}
                      </span>
                      {guest.phone && <span>{guest.phone}</span>}
                      {guest.country && <span>{guest.country}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center px-4 py-2 bg-sand-50 rounded-lg">
                    <p className="font-semibold text-sand-900">{guest._count.bookings}</p>
                    <p className="text-xs text-sand-500">Bookings</p>
                  </div>
                  <div className="flex items-center gap-1 text-sand-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">
                      {new Date(guest.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
