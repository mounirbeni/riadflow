"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { SectionHeader } from "@/components/shared/section-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { GlassCard } from "@/components/shared/glass-card";

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  category: string;
}

const categoryLabels: Record<string, string> = {
  ROOMS: "Rooms",
  RIAD: "The Riad",
  FOOD: "Food & Dining",
  EXPERIENCES: "Experiences",
  DETAILS: "Details",
};

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success) setImages(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const categories = [...new Set(images.map((img) => img.category))];
  const filtered = activeCategory
    ? images.filter((img) => img.category === activeCategory)
    : images;

  return (
    <div className="min-h-full">
      <Navbar />

      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1920&q=80"
            alt="Gallery"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-sand-900/50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Gallery
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            A visual journey through our riad and the Moroccan experience.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-sand-50 zellige-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-terracotta-500 text-white"
                      : "bg-white text-sand-600 hover:bg-sand-100"
                  }`}
                >
                  {categoryLabels[cat] || cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <LoadingSpinner text="Loading gallery..." />
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filtered.map((img, index) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img.url}
                    alt={img.caption || "Gallery image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-sand-900/0 group-hover:bg-sand-900/40 transition-colors" />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-white text-sm font-medium">{img.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-sand-900/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[80vh] w-full">
            <Image
              src={selectedImage.url}
              alt={selectedImage.caption || "Gallery image"}
              width={1200}
              height={800}
              className="object-contain rounded-xl"
            />
            {selectedImage.caption && (
              <p className="text-white text-center mt-4">{selectedImage.caption}</p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
