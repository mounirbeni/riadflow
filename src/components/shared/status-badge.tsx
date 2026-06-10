import { cn } from "@/lib/utils";
import { BookingStatus, PaymentStatus } from "@prisma/client";

interface StatusBadgeProps {
  status: BookingStatus | PaymentStatus | string;
  type: "booking" | "payment";
  className?: string;
}

const bookingStyles: Record<string, string> = {
  PENDING: "bg-gold-100 text-gold-700 border-gold-200",
  CONFIRMED: "bg-olive-100 text-olive-700 border-olive-200",
  CANCELLED: "bg-terracotta-100 text-terracotta-700 border-terracotta-200",
  COMPLETED: "bg-sand-200 text-sand-700 border-sand-300",
};

const paymentStyles: Record<string, string> = {
  UNPAID: "bg-terracotta-100 text-terracotta-700 border-terracotta-200",
  PENDING_VERIFICATION: "bg-gold-100 text-gold-700 border-gold-200",
  PAID: "bg-olive-100 text-olive-700 border-olive-200",
  REFUNDED: "bg-sand-200 text-sand-700 border-sand-300",
};

const bookingLabels: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

const paymentLabels: Record<string, string> = {
  UNPAID: "Unpaid",
  PENDING_VERIFICATION: "Pending Verification",
  PAID: "Paid",
  REFUNDED: "Refunded",
};

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const styles = type === "booking" ? bookingStyles : paymentStyles;
  const labels = type === "booking" ? bookingLabels : paymentLabels;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles[status] || "bg-sand-100 text-sand-700 border-sand-200",
        className
      )}
    >
      {labels[status] || status}
    </span>
  );
}
