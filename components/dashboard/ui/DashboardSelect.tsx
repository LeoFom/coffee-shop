import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type DashboardSelectProps = SelectHTMLAttributes<HTMLSelectElement>

export default function DashboardSelect({
  className,
  children,
  ...props
}: DashboardSelectProps) {
  return (
    <select
      className={cn(
        "w-full h-11 px-4 rounded-xl",
        "border border-brand-brown/10",
        "bg-white",
        "outline-none",
        "text-brand-text",
        "focus:ring-2 focus:ring-brand-brown/10",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}