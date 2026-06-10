"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Image, Trash2, Plus, Link as LinkIcon } from "lucide-react";
import { GalleryCategory } from "@prisma/client";

interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  category: GalleryCategory;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newCategory, setNewCategory] = useState<GalleryCategory>("RIAD");

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      if (data.success) setImages(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addImage() {
    if (!newUrl.trim()) return;
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl, caption: newCaption, category: newCategory }),
      });

      if (res.ok) {
        toast.success("Image added");
        setNewUrl("");
        setNewCaption("");
        fetchImages();
      } else {
        toast.error("Failed to add image");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function deleteImage(id: string) {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success("Image deleted");
        fetchImages();
      } else {
        toast.error("Failed to delete image");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading gallery..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-sand-900 mb-2">Gallery</h1>
          <p className="text-sand-500">Manage gallery images</p>
        </div>
      </div>

      <GlassCard className="p-5">
        <h3 className="font-medium text-sand-900 mb-3">Add New Image</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-400" />
            <input
              type="text"
              placeholder="Image URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400 text-sm"
            />
          </div>
          <input
            type="text"
            placeholder="Caption (optional)"
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400 text-sm"
          />
          <div className="flex gap-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as GalleryCategory)}
              className="flex-1 px-3 py-2.5 rounded-xl border border-sand-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-400"
            >
              {Object.values(GalleryCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <Button
              onClick={addImage}
              className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full gap-1"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
          >
            <GlassCard className="p-3 overflow-hidden group">
              <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-sand-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.caption || "Gallery image"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <button
                  onClick={() => deleteImage(img.id)}
                  className="absolute top-2 right-2 p-1.5 bg-terracotta-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-sand-500 truncate">{img.caption || "No caption"}</p>
              <span className="text-xs text-sand-400">{img.category.replace(/_/g, " ")}</span>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
