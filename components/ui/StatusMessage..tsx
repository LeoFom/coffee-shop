import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error";

interface StatusMessageProps {
  type?: StatusType;
  title?: string;
  message: string;
  className?: string;
}

const variants = {
  success: {
    wrapper:
      "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100",
    icon: "text-emerald-600 dark:text-emerald-400",
    Icon: CheckCircle2,
  },

  warning: {
    wrapper:
      "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100",
    icon: "text-amber-600 dark:text-amber-400",
    Icon: AlertTriangle,
  },

  error: {
    wrapper:
      "border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100",
    icon: "text-red-600 dark:text-red-400",
    Icon: XCircle,
  },
};

export default function StatusMessage({
  type = "success",
  title,
  message,
  className,
}: StatusMessageProps) {
  const { wrapper, icon, Icon } = variants[type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 w-full max-w-[300px]",
        wrapper,
        className
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", icon)} />

      <div className="flex-1">
        {title && (
          <h4 className="font-medium leading-none mb-1">
            {title}
          </h4>
        )}

        <p className="text-sm leading-relaxed opacity-90">
          {message}
        </p>
      </div>
    </div>
  );
}