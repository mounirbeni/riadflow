import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="mb-4 text-sand-300">
        {icon || <Inbox className="h-12 w-12" />}
      </div>
      <h3 className="font-heading text-xl text-sand-700 mb-2">{title}</h3>
      {description && (
        <p className="text-sand-500 max-w-md mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
