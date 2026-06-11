import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RiadFlow — Luxury Moroccan Riad",
    short_name: "RiadFlow",
    description:
      "Experience authentic Moroccan luxury. Book exquisite riads, hammam treatments, and curated experiences in Morocco.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#D4684A",
    orientation: "portrait-primary",
    scope: "/",
    categories: ["travel", "lifestyle"],
    icons: [
      {
        src: "/api/pwa-icon?size=192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/api/pwa-icon?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Browse Rooms",
        short_name: "Rooms",
        url: "/rooms",
        description: "View our luxury rooms",
      },
      {
        name: "Experiences",
        short_name: "Explore",
        url: "/experiences",
        description: "Curated Moroccan experiences",
      },
    ],
    prefer_related_applications: false,
  };
}
