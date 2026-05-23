import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type DashboardInputProps = InputHTMLAttributes<HTMLInputElement>

export default function DashboardInput({
 className,
 ...props
}: DashboardInputProps) {
  return (
    <input
      className={cn(
        "w-full h-11 px-4 rounded-xl",
        "border border-brand-brown/10",
        "bg-white",
        "outline-none",
        "text-brand-text",
        "placeholder:text-brand-muted",
        "focus:ring-2 focus:ring-brand-brown/10",
        className
      )}
      {...props}
    />
  );
}