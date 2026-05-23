import { cn } from "@/lib/utils";

interface DashboardBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "inactive";
}

export default function DashboardBadge({
 children,
 variant = "success",
}: DashboardBadgeProps) {
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium",

        variant === "success" &&
        "bg-green-100 text-green-700",

        variant === "inactive" &&
        "bg-gray-100 text-gray-500"
      )}
    >
      {children}
    </span>
  );
}