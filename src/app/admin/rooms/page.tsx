"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BedDouble, Users, DollarSign, Pencil, Trash2, Plus, Eye } from "lucide-react";

interface Room {
  id: string;
  name: string;
  slug: string;
  pricePerNight: number;
  capacity: number;
  isActive: boolean;
  featured: boolean;
  _count: { bookings: number; reviews: number };
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    try {
      const res = await fetch("/api/admin/rooms");
      const data = await res.json();
      if (data.success) setRooms(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteRoom(id: string) {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      const res = await fetch("/api/admin/rooms", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success("Room deleted");
        fetchRooms();
      } else {
        toast.error("Failed to delete room");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading rooms..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-sand-900 mb-2">Rooms</h1>
          <p className="text-sand-500">Manage your room inventory</p>
        </div>
        <Link href="/admin/rooms/new">
          <Button className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full gap-2">
            <Plus className="h-4 w-4" />
            Add Room
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-sand-900">
                    {room.name}
                  </h3>
                  <p className="text-sm text-sand-500">{room.slug}</p>
                </div>
                <div className="flex gap-1">
                  {!room.isActive && (
                    <span className="px-2 py-0.5 bg-sand-200 text-sand-600 text-xs rounded-full">
                      Inactive
                    </span>
                  )}
                  {room.featured && (
                    <span className="px-2 py-0.5 bg-gold-100 text-gold-600 text-xs rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-sand-50 rounded-lg">
                  <DollarSign className="h-4 w-4 text-terracotta-500 mx-auto mb-1" />
                  <p className="text-sm font-medium text-sand-900">€{room.pricePerNight}</p>
                  <p className="text-xs text-sand-500">/night</p>
                </div>
                <div className="text-center p-2 bg-sand-50 rounded-lg">
                  <Users className="h-4 w-4 text-olive-500 mx-auto mb-1" />
                  <p className="text-sm font-medium text-sand-900">{room.capacity}</p>
                  <p className="text-xs text-sand-500">guests</p>
                </div>
                <div className="text-center p-2 bg-sand-50 rounded-lg">
                  <BedDouble className="h-4 w-4 text-gold-500 mx-auto mb-1" />
                  <p className="text-sm font-medium text-sand-900">{room._count.bookings}</p>
                  <p className="text-xs text-sand-500">bookings</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/rooms/${room.slug}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1 rounded-full">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </Link>
                <Link href={`/admin/rooms/${room.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1 rounded-full">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteRoom(room.id)}
                  className="border-terracotta-200 text-terracotta-500 hover:bg-terracotta-50 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
