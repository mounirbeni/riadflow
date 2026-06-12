"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Shield,
} from "lucide-react";

const navLinks = [
  { href: "/rooms", label: "Rooms" },
  { href: "/experiences", label: "Experiences" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all",
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_24px_rgba(31,24,15,0.08)] border-b border-sand-200/80"
          : "bg-transparent"
      )}
      style={{ transitionDuration: "400ms", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.span
              className={cn(
                "font-heading text-2xl md:text-3xl font-semibold",
                isScrolled ? "text-sand-900" : "text-white"
              )}
              style={{ letterSpacing: "-0.02em" }}
            >
              Riad
              <span
                className="text-terracotta-500 transition-colors duration-300 group-hover:text-terracotta-400"
              >
                Flow
              </span>
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "nav-link relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg",
                    isScrolled
                      ? active
                        ? "text-terracotta-500"
                        : "text-sand-700 hover:text-sand-900"
                      : active
                      ? "text-terracotta-300"
                      : "text-white/90 hover:text-white"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className={cn(
                        "absolute bottom-0 left-4 right-4 h-0.5 rounded-full",
                        isScrolled ? "bg-terracotta-500" : "bg-white"
                      )}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <>
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "gap-1.5 text-xs font-medium",
                        isScrolled ? "text-sand-600 hover:text-sand-900" : "text-white/80 hover:text-white"
                      )}
                    >
                      <Shield className="h-3.5 w-3.5" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-1.5 text-xs font-medium",
                      isScrolled ? "text-sand-600 hover:text-sand-900" : "text-white/80 hover:text-white"
                    )}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className={cn(
                    "gap-1.5 text-xs font-medium",
                    isScrolled ? "text-sand-500 hover:text-sand-800" : "text-white/70 hover:text-white"
                  )}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-sm font-medium",
                      isScrolled ? "text-sand-700 hover:text-sand-900" : "text-white/90 hover:text-white"
                    )}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/booking">
                  <Button
                    size="sm"
                    className={cn(
                      "rounded-full px-5 text-sm font-semibold transition-all",
                      isScrolled
                        ? "bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm hover:shadow-md hover:shadow-terracotta-500/25"
                        : "bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm border border-white/25 hover:border-white/40"
                    )}
                  >
                    Book Now
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-xl transition-colors",
              isScrolled
                ? "text-sand-700 hover:bg-sand-100"
                : "text-white hover:bg-white/10"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-white/98 backdrop-blur-xl border-t border-sand-200/80 shadow-xl"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-colors",
                      isActive(link.href)
                        ? "bg-terracotta-50 text-terracotta-600"
                        : "text-sand-700 hover:bg-sand-50 hover:text-sand-900"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-sand-100 pt-3 mt-2 flex flex-col gap-2">
                {session ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full gap-2 justify-start rounded-xl">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full gap-2 justify-start rounded-xl text-sand-500" onClick={() => signOut()}>
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full rounded-xl">Sign In</Button>
                    </Link>
                    <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl">
                        Book Now
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
