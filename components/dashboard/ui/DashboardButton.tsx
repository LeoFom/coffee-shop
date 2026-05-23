import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

interface DashboardButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function DashboardButton({
  className,
  variant = "primary",
  ...props
}: DashboardButtonProps) {
  return (
    <button
      className={cn(
        "h-11 px-5 rounded-xl transition-all font-medium text-sm",
        "disabled:opacity-50 disabled:pointer-events-none",

        variant === "primary" &&
        "bg-brand-brown text-white hover:opacity-90",

        variant === "secondary" &&
        "bg-brand-brown/5 text-brand-brown hover:bg-brand-brown/10",

        variant === "ghost" &&
        "hover:bg-brand-brown/5 text-brand-brown",

        variant === "danger" &&
        "bg-red-500 text-white hover:bg-red-600",

        className
      )}
      {...props}
    />
  );
}