import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dark";
}

export function GlassCard({ children, className, variant = "default" }: GlassCardProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-md border shadow-lg rounded-2xl transition-all duration-300",
        variant === "default"
          ? "bg-white/70 border-white/20 hover:shadow-xl hover:bg-white/80"
          : "bg-sand-900/60 border-white/10 hover:bg-sand-900/70",
        className
      )}
    >
      {children}
    </div>
  );
}
