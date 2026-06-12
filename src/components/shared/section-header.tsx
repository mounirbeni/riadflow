"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  accent?: string;
  centered?: boolean;
  className?: string;
  light?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  accent,
  centered = true,
  className,
  light = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn("mb-12 md:mb-16", centered && "text-center", className)}
    >
      {accent && (
        <p
          className={cn(
            "font-accent italic text-lg md:text-xl mb-3 tracking-wide",
            light ? "text-terracotta-300" : "text-terracotta-500"
          )}
        >
          {accent}
        </p>
      )}

      <h2
        className={cn(
          "font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight",
          light ? "text-white" : "text-sand-900"
        )}
      >
        {title}
      </h2>

      {/* Decorative divider */}
      <div className={cn("flex items-center gap-3 mt-4 mb-2", centered && "justify-center")}>
        <div className={cn("h-px w-12", light ? "bg-white/20" : "bg-sand-200")} />
        <div className={cn("h-1.5 w-1.5 rounded-full", light ? "bg-terracotta-400" : "bg-terracotta-400")} />
        <div className={cn("h-px w-12", light ? "bg-white/20" : "bg-sand-200")} />
      </div>

      {subtitle && (
        <p
          className={cn(
            "mt-3 text-lg md:text-xl max-w-2xl leading-relaxed",
            centered && "mx-auto",
            light ? "text-sand-300" : "text-sand-500"
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
