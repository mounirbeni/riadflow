"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Code2, ExternalLink, Sparkles } from "lucide-react";

export function DemoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("riadflow-demo-dismissed");
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    localStorage.setItem("riadflow-demo-dismissed", "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-sand-950/60 backdrop-blur-sm z-[60] md:pointer-events-none md:bg-transparent md:backdrop-blur-none"
            onClick={dismiss}
          />

          {/* Banner */}
          <motion.div
            key="banner"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            className="fixed z-[61] bottom-0 left-0 right-0 md:bottom-5 md:left-1/2 md:-translate-x-1/2 md:w-[520px] md:right-auto"
          >
            <div className="relative overflow-hidden bg-sand-900 border-t md:border border-sand-700/60 md:rounded-2xl shadow-[0_-4px_40px_rgba(0,0,0,0.4)] md:shadow-2xl">
              {/* Zellige decoration */}
              <div className="absolute inset-0 zellige-pattern-dark opacity-20 pointer-events-none" />
              {/* Terracotta top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta-600 via-terracotta-400 to-gold-500" />

              <div className="relative z-10 p-6 md:p-7">
                {/* Close */}
                <button
                  onClick={dismiss}
                  aria-label="Dismiss"
                  className="absolute top-4 right-4 h-8 w-8 rounded-full bg-sand-800 hover:bg-sand-700 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-sand-300" />
                </button>

                {/* Tag */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 rounded-lg bg-terracotta-500/20 border border-terracotta-500/40 flex items-center justify-center">
                    <Code2 className="h-3.5 w-3.5 text-terracotta-400" />
                  </div>
                  <span className="text-terracotta-400 text-xs font-bold uppercase tracking-widest">
                    Demo Project
                  </span>
                </div>

                <h3 className="font-heading text-xl md:text-2xl text-white font-semibold mb-2 leading-snug">
                  Welcome to RiadFlow
                </h3>
                <p className="text-sand-400 text-sm leading-relaxed mb-5">
                  A fully functional SaaS demo — hotel-style booking engine, real-time
                  availability, admin dashboard, guest portal, PWA support, and more.
                  Built to showcase what a modern riad management platform looks like.
                </p>

                {/* Features row */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {["Next.js 16", "Prisma ORM", "PWA", "Framer Motion", "TypeScript"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="bg-sand-800 border border-sand-700 text-sand-300 text-xs px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>

                {/* CTA row */}
                <div className="flex items-center justify-between gap-4">
                  <a
                    href="https://mbndev.ma"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 bg-terracotta-500 hover:bg-terracotta-600 active:scale-95 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>
                      Built by{" "}
                      <span className="font-heading text-base tracking-tight">
                        mbndev.ma
                      </span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </a>
                  <button
                    onClick={dismiss}
                    className="text-sand-500 hover:text-sand-300 text-sm transition-colors"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
