import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type DashboardTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export default function DashboardTextarea({
  className,
  ...props
}: DashboardTextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full min-h-[140px] px-4 py-3 rounded-xl",
        "border border-brand-brown/10",
        "bg-white",
        "outline-none",
        "resize-none",
        "text-brand-text",
        "placeholder:text-brand-muted",
        "focus:ring-2 focus:ring-brand-brown/10",
        className
      )}
      {...props}
    />
  );
}