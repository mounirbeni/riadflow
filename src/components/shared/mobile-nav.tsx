"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BedDouble, Sparkles, CalendarCheck, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/rooms", icon: BedDouble, label: "Rooms" },
  { href: "/experiences", icon: Sparkles, label: "Explore" },
  { href: "/booking", icon: CalendarCheck, label: "Book" },
  { href: "/dashboard", icon: UserCircle, label: "Profile" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-t border-sand-200/60 shadow-[0_-2px_24px_rgba(0,0,0,0.07)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch h-14">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-150 active:scale-90",
                isActive ? "text-terracotta-500" : "text-sand-400"
              )}
            >
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <span className="absolute inset-0 scale-[2] rounded-full bg-terracotta-500/10" />
                )}
                <Icon
                  className="h-[22px] w-[22px] relative"
                  strokeWidth={isActive ? 2.5 : 1.75}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] leading-none",
                  isActive ? "font-semibold" : "font-normal"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
