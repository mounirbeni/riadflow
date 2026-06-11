"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Globe, MessageCircle, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-sand-900 text-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-heading text-2xl font-semibold text-white">
                Riad<span className="text-terracotta-400">Flow</span>
              </span>
            </Link>
            <p className="text-sand-400 text-sm leading-relaxed mb-6">
              Experience the magic of authentic Moroccan hospitality in our
              carefully curated collection of luxury riads.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand-400 hover:text-terracotta-400 transition-colors"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand-400 hover:text-terracotta-400 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-heading text-lg text-white mb-4">Explore</h3>
            <ul className="space-y-3">
              {[
                { href: "/rooms", label: "Our Rooms" },
                { href: "/experiences", label: "Experiences" },
                { href: "/gallery", label: "Gallery" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sand-400 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-heading text-lg text-white mb-4">Information</h3>
            <ul className="space-y-3">
              {[
                { href: "/booking", label: "Book Your Stay" },
                { href: "/dashboard", label: "Guest Dashboard" },
                { href: "/login", label: "Sign In" },
                { href: "/register", label: "Create Account" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sand-400 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg text-white mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-terracotta-400 flex-shrink-0 mt-0.5" />
                <span className="text-sand-400 text-sm">
                  12 Derb El Hamam
                  <br />
                  Medina, Marrakech 40000
                  <br />
                  Morocco
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-terracotta-400 flex-shrink-0" />
                <a
                  href="tel:+212524123456"
                  className="text-sand-400 hover:text-terracotta-400 transition-colors text-sm"
                >
                  +212 524 123 456
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-terracotta-400 flex-shrink-0" />
                <a
                  href="mailto:hello@riadflow.com"
                  className="text-sand-400 hover:text-terracotta-400 transition-colors text-sm"
                >
                  hello@riadflow.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* mbndev.ma credit bar */}
        <div className="border-t border-sand-800 mt-12 pt-6 pb-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <span className="text-sand-500 text-sm">Demo project designed &amp; built by</span>
            <a
              href="https://mbndev.ma"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-terracotta-400 hover:text-terracotta-300 font-semibold text-sm transition-colors"
            >
              <Code2 className="h-4 w-4" />
              mbndev.ma
            </a>
          </div>
        </div>

        <div className="border-t border-sand-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sand-500 text-sm">
            &copy; {new Date().getFullYear()} RiadFlow. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sand-500 hover:text-sand-300 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sand-500 hover:text-sand-300 text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
