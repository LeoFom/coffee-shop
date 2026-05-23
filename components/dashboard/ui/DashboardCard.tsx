import { cn } from "@/lib/utils";

type DashboardCardProps = React.HTMLAttributes<HTMLDivElement>

export default function DashboardCard({
  className,
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-brand-brown/10 rounded-2xl shadow-sm",
        className
      )}
      {...props}
    />
  );
}