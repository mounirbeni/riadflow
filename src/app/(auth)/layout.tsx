import Link from "next/link";
import { MobileNav } from "@/components/shared/mobile-nav";
import { Home } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col bg-sand-100 zellige-pattern">
      {/* Back to home bar */}
      <div className="px-4 sm:px-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sand-600 hover:text-terracotta-500 transition-colors text-sm font-medium"
        >
          <Home className="h-4 w-4" />
          Back to RiadFlow
        </Link>
      </div>

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </div>

      {/* Spacer so content isn't hidden behind mobile nav */}
      <div className="h-14 md:hidden" aria-hidden="true" />
      <MobileNav />
    </div>
  );
}
