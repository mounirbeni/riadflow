"use client";

import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full pb-20 md:pb-0">
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
