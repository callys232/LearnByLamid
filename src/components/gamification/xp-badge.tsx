import { cn } from "@/lib/utils";
import { Zap, Flame, Trophy, Star } from "lucide-react";

interface XpBadgeProps {
  xp: number;
  size?: "sm" | "md";
  className?: string;
}

function getLevel(xp: number): {
  label: string;
  color: string;
  Icon: React.ElementType;
} {
  if (xp >= 10000)
    return {
      label: "Expert",
      color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
      Icon: Trophy,
    };
  if (xp >= 5000)
    return {
      label: "Advanced",
      color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
      Icon: Star,
    };
  if (xp >= 2000)
    return {
      label: "Intermediate",
      color: "text-primary border-primary/30 bg-primary-muted",
      Icon: Zap,
    };
  return {
    label: "Beginner",
    color: "text-text-secondary border-border bg-surface-active",
    Icon: Flame,
  };
}

export function XpBadge({ xp, size = "md", className }: XpBadgeProps) {
  const { label, color, Icon } = getLevel(xp);
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium animate-scale-in",
        color,
        size === "sm" && "px-2 py-0.5 text-[10px]",
        className,
      )}
    >
      <Icon
        className={cn("shrink-0", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")}
      />
      <span>{label}</span>
      <span className="opacity-70 tabular-nums">
        · {xp.toLocaleString()} XP
      </span>
    </div>
  );
}

interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md";
  className?: string;
}

export function StreakBadge({
  streak,
  size = "md",
  className,
}: StreakBadgeProps) {
  const hot = streak >= 7;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        hot
          ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
          : "border-border bg-surface-active text-text-secondary",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        className,
      )}
    >
      <Flame
        className={cn(
          "shrink-0",
          size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5",
          hot && "animate-pulse",
        )}
      />
      <span>{streak}d streak</span>
    </div>
  );
}

export function BadgeShowcase({
  badges,
}: {
  badges: { id: string; label: string; icon: string; earned: boolean }[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-xl border p-3 w-20 text-center transition-all duration-150",
            badge.earned
              ? "border-primary/25 bg-primary-muted hover:shadow-primary-sm hover:-translate-y-0.5"
              : "border-border bg-surface opacity-40",
          )}
        >
          <span className="text-2xl leading-none">{badge.icon}</span>
          <span className="text-[10px] font-medium text-text-secondary leading-tight">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}
