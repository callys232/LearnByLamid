import { Card, CardContent } from "@/components/ui/card";
import { relativeTime } from "@/lib/utils";
import { ActivityItem } from "@/types/types";

interface ActivityCardProps {
  item: ActivityItem;
  delay?: number;
}

export function ActivityCard({ item, delay = 0 }: ActivityCardProps) {
  return (
    <Card
      hoverable
      className="group overflow-hidden animate-fade-up transition-all duration-200"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="flex items-start gap-3 p-4">
        <span className="mt-0.5 text-base leading-none transition-transform duration-150 group-hover:scale-110">
          {item.icon}
        </span>
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          <p className="text-sm font-medium text-text-primary">{item.label}</p>
          <p className="truncate text-xs text-text-secondary">{item.sub}</p>
        </div>
        <time className="shrink-0 text-xs text-text-muted tabular-nums">
          {relativeTime(item.time)}
        </time>
      </CardContent>
    </Card>
  );
}
