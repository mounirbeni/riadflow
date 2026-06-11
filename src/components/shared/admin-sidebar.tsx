"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  BedDouble,
  Users,
  CreditCard,
  MessageSquare,
  Star,
  Image,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/admin", label: "Analytics", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/guests", label: "Guests", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/calendar", label: "Calendar", icon: Calendar },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-sand-200">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-heading text-xl text-terracotta-600">
            {collapsed ? "RF" : "RiadFlow"}
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="flex-1 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors",
                isActive
                  ? "bg-terracotta-50 text-terracotta-600"
                  : "text-sand-600 hover:bg-sand-100 hover:text-sand-800"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Back to website */}
      <div className="p-3 border-t border-sand-200">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sand-500 hover:bg-terracotta-50 hover:text-terracotta-600",
            collapsed && "justify-center"
          )}
          title="Back to Website"
        >
          <Home className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">← Back to Website</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sand-50">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 h-full bg-sand-50 border-r border-sand-200 transition-all duration-300 z-40",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <NavContent />
      </aside>
    </>
  );
}
