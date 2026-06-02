import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accent?: boolean;
  className?: string;
}

export function StatsCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  accent,
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden animate-fade-up",
        "transition-all duration-200",
        "hover:-translate-y-0.5",
        accent
          ? "border-primary/25 hover:border-primary/50 hover:shadow-primary"
          : "hover:border-border-strong hover:shadow-soft-md",
        className,
      )}
    >
      {/* accent glow */}
      {accent && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-transparent" />
      )}
      {/* top shimmer line */}
      {accent && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      )}

      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-text-secondary">{label}</p>
            <p
              className={cn(
                "text-2xl font-bold tracking-tight transition-colors duration-150",
                accent
                  ? "text-primary"
                  : "text-text-primary group-hover:text-white",
              )}
            >
              {value}
            </p>
            {sub && <p className="text-xs text-text-muted">{sub}</p>}
          </div>

          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              "transition-all duration-200 group-hover:scale-110",
              accent
                ? "bg-primary-muted group-hover:bg-primary-muted group-hover:shadow-primary-sm"
                : "bg-surface-active group-hover:bg-surface-hover",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 transition-colors duration-150",
                accent
                  ? "text-primary"
                  : "text-text-secondary group-hover:text-text-primary",
              )}
            />
          </div>
        </div>

        {trend && (
          <div className="mt-3 flex items-center gap-1">
            <span
              className={cn(
                "text-xs font-semibold",
                trend.positive ? "text-emerald-400" : "text-red-400",
              )}
            >
              {trend.positive ? "▲" : "▼"} {trend.value}
            </span>
            <span className="text-xs text-text-muted">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
