"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Plus, X } from "lucide-react";

interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  pricePerNight: number;
  capacity: number;
  beds: string;
  bathrooms: number;
  size: number | null;
  amenities: string[];
  images: string[];
  isActive: boolean;
  featured: boolean;
  sortOrder: number;
}

export default function AdminEditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    if (id) fetchRoom();
  }, [id]);

  async function fetchRoom() {
    try {
      const res = await fetch(`/api/rooms/${id}`);
      const data = await res.json();
      if (data.success) {
        setRoom(data.data);
      } else {
        // Fallback: fetch from admin rooms list
        const adminRes = await fetch("/api/admin/rooms");
        const adminData = await adminRes.json();
        if (adminData.success) {
          const found = adminData.data.find((r: Room) => r.id === id);
          if (found) setRoom(found);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  function updateField<K extends keyof Room>(field: K, value: Room[K]) {
    setRoom((prev) => (prev ? { ...prev, [field]: value } : null));
  }

  function addAmenity() {
    if (!room || !newAmenity.trim() || room.amenities.includes(newAmenity.trim())) return;
    updateField("amenities", [...room.amenities, newAmenity.trim()]);
    setNewAmenity("");
  }

  function removeAmenity(index: number) {
    if (!room) return;
    updateField("amenities", room.amenities.filter((_, i) => i !== index));
  }

  function addImage() {
    if (!room || !newImage.trim() || room.images.includes(newImage.trim())) return;
    updateField("images", [...room.images, newImage.trim()]);
    setNewImage("");
  }

  function removeImage(index: number) {
    if (!room) return;
    updateField("images", room.images.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!room) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/rooms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: room.id,
          name: room.name,
          description: room.description,
          shortDesc: room.shortDesc,
          pricePerNight: Number(room.pricePerNight),
          capacity: Number(room.capacity),
          beds: room.beds,
          bathrooms: Number(room.bathrooms),
          size: room.size ? Number(room.size) : null,
          amenities: room.amenities,
          images: room.images,
          isActive: room.isActive,
          featured: room.featured,
          sortOrder: Number(room.sortOrder),
        }),
      });

      if (res.ok) {
        toast.success("Room updated");
        router.push("/admin/rooms");
      } else {
        toast.error("Failed to update room");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading room..." />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sand-500">Room not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/rooms">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <h1 className="font-heading text-3xl font-bold text-sand-900">Edit Room</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassCard className="p-6 space-y-4">
          <h2 className="font-heading text-lg font-semibold text-sand-900">Basic Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Name *</label>
              <input
                required
                type="text"
                value={room.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Short Description</label>
              <input
                type="text"
                value={room.shortDesc || ""}
                onChange={(e) => updateField("shortDesc", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-sand-900 mb-1">Description *</label>
            <textarea
              required
              rows={4}
              value={room.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <h2 className="font-heading text-lg font-semibold text-sand-900">Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Price/Night (€) *</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={room.pricePerNight}
                onChange={(e) => updateField("pricePerNight", Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Capacity *</label>
              <input
                required
                type="number"
                min="1"
                value={room.capacity}
                onChange={(e) => updateField("capacity", Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Beds *</label>
              <input
                required
                type="text"
                value={room.beds}
                onChange={(e) => updateField("beds", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Bathrooms</label>
              <input
                type="number"
                min="1"
                value={room.bathrooms}
                onChange={(e) => updateField("bathrooms", Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Size (m²)</label>
              <input
                type="number"
                min="0"
                value={room.size || ""}
                onChange={(e) => updateField("size", e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Sort Order</label>
              <input
                type="number"
                min="0"
                value={room.sortOrder}
                onChange={(e) => updateField("sortOrder", Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <h2 className="font-heading text-lg font-semibold text-sand-900">Amenities</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add amenity..."
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
              className="flex-1 px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
            />
            <Button type="button" onClick={addAmenity} variant="outline" className="rounded-full gap-1">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((a, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-sand-100 text-sand-700 rounded-full text-sm">
                {a}
                <button type="button" onClick={() => removeAmenity(i)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <h2 className="font-heading text-lg font-semibold text-sand-900">Images</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Image URL..."
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
              className="flex-1 px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
            />
            <Button type="button" onClick={addImage} variant="outline" className="rounded-full gap-1">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {room.images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-sand-100 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 bg-terracotta-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <h2 className="font-heading text-lg font-semibold text-sand-900">Options</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={room.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-sand-300 text-terracotta-500 focus:ring-terracotta-400"
              />
              <span className="text-sm text-sand-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={room.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
                className="h-4 w-4 rounded border-sand-300 text-terracotta-500 focus:ring-terracotta-400"
              />
              <span className="text-sm text-sand-700">Featured</span>
            </label>
          </div>
        </GlassCard>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full px-8">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Link href="/admin/rooms">
            <Button variant="outline" className="rounded-full">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
