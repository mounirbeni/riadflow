import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dark" | "elevated" | "frosted";
  shimmer?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = "default",
  shimmer = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border transition-all duration-300 overflow-hidden",
        variant === "default" && [
          "bg-white/70 border-white/30",
          "backdrop-blur-md shadow-lg",
          "hover:shadow-xl hover:bg-white/80 hover:border-white/50",
        ],
        variant === "dark" && [
          "bg-sand-900/60 border-white/10",
          "backdrop-blur-md shadow-lg",
          "hover:bg-sand-900/70 hover:border-white/15",
        ],
        variant === "elevated" && [
          "border-white/50 shadow-[0_8px_40px_rgba(31,24,15,0.12),0_1px_0_rgba(255,255,255,0.8)_inset]",
          "hover:shadow-[0_16px_56px_rgba(31,24,15,0.16),0_1px_0_rgba(255,255,255,0.9)_inset]",
        ],
        variant === "frosted" && [
          "bg-white/50 border-white/40",
          "backdrop-blur-xl shadow-xl",
          "hover:bg-white/65 hover:border-white/60",
        ],
        shimmer && "before:absolute before:inset-0 before:shimmer before:pointer-events-none",
        variant === "elevated" &&
          "bg-gradient-to-br from-white/90 via-white/75 to-white/60 backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}
