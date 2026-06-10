"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Plus, X } from "lucide-react";

export default function AdminNewRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    shortDesc: "",
    pricePerNight: "",
    capacity: "",
    beds: "",
    bathrooms: "1",
    size: "",
    amenities: [] as string[],
    images: [] as string[],
    isActive: true,
    featured: false,
    sortOrder: "0",
  });
  const [newAmenity, setNewAmenity] = useState("");
  const [newImage, setNewImage] = useState("");

  function updateField<K extends keyof typeof form>(field: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addAmenity() {
    if (newAmenity.trim() && !form.amenities.includes(newAmenity.trim())) {
      updateField("amenities", [...form.amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  }

  function removeAmenity(index: number) {
    updateField(
      "amenities",
      form.amenities.filter((_, i) => i !== index)
    );
  }

  function addImage() {
    if (newImage.trim() && !form.images.includes(newImage.trim())) {
      updateField("images", [...form.images, newImage.trim()]);
      setNewImage("");
    }
  }

  function removeImage(index: number) {
    updateField(
      "images",
      form.images.filter((_, i) => i !== index)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pricePerNight: Number(form.pricePerNight),
          capacity: Number(form.capacity),
          bathrooms: Number(form.bathrooms),
          size: form.size ? Number(form.size) : null,
          sortOrder: Number(form.sortOrder),
        }),
      });

      if (res.ok) {
        toast.success("Room created");
        router.push("/admin/rooms");
      } else {
        toast.error("Failed to create room");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
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

      <h1 className="font-heading text-3xl font-bold text-sand-900">Add New Room</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassCard className="p-6 space-y-4">
          <h2 className="font-heading text-lg font-semibold text-sand-900">Basic Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Name *</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Short Description</label>
              <input
                type="text"
                value={form.shortDesc}
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
              value={form.description}
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
                value={form.pricePerNight}
                onChange={(e) => updateField("pricePerNight", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Capacity *</label>
              <input
                required
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => updateField("capacity", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Beds *</label>
              <input
                required
                type="text"
                value={form.beds}
                onChange={(e) => updateField("beds", e.target.value)}
                placeholder="e.g. 1 King"
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Bathrooms</label>
              <input
                type="number"
                min="1"
                value={form.bathrooms}
                onChange={(e) => updateField("bathrooms", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Size (m²)</label>
              <input
                type="number"
                min="0"
                value={form.size}
                onChange={(e) => updateField("size", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-900 mb-1">Sort Order</label>
              <input
                type="number"
                min="0"
                value={form.sortOrder}
                onChange={(e) => updateField("sortOrder", e.target.value)}
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
            {form.amenities.map((a, i) => (
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
            {form.images.map((img, i) => (
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
                checked={form.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-sand-300 text-terracotta-500 focus:ring-terracotta-400"
              />
              <span className="text-sm text-sand-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
                className="h-4 w-4 rounded border-sand-300 text-terracotta-500 focus:ring-terracotta-400"
              />
              <span className="text-sm text-sand-700">Featured</span>
            </label>
          </div>
        </GlassCard>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full px-8">
            {loading ? "Creating..." : "Create Room"}
          </Button>
          <Link href="/admin/rooms">
            <Button variant="outline" className="rounded-full">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
