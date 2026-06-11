"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";
import { ArrowLeft } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Derive a readable page title from the pathname
  const segments = pathname.replace("/dashboard", "").split("/").filter(Boolean);
  const pageTitle =
    segments.length === 0
      ? "Guest Dashboard"
      : segments[0].charAt(0).toUpperCase() + segments[0].slice(1);

  return (
    <div className="min-h-full bg-sand-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sand-200 px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sand-500 hover:text-terracotta-500 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Website</span>
          <span className="sm:hidden">Home</span>
        </Link>

        <span className="font-heading text-base md:text-lg font-semibold text-sand-900 absolute left-1/2 -translate-x-1/2">
          {pageTitle}
        </span>

        {/* Logo on right for desktop */}
        <Link
          href="/"
          className="font-heading text-lg font-semibold text-sand-900 hidden md:block"
        >
          Riad<span className="text-terracotta-500">Flow</span>
        </Link>
        {/* Spacer on mobile to balance the centered title */}
        <div className="w-16 sm:hidden" />
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-10">
        {children}
      </main>

      <MobileBottomNav />
    </div>
  );
}
