import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { relativeTime } from "@/lib/utils";
import { ActivityItem } from "@/types/types";

interface ActivityFeedProps {
  items: ActivityItem[];
  title?: string;
}

export function ActivityFeed({
  items,
  title = "Recent Activity",
}: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <ul className="divide-y divide-border">
          {items.map((item, i) => (
            <li
              key={item.id}
              className="group flex items-start gap-3 px-5 py-3 transition-colors duration-150 hover:bg-surface-hover"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="mt-0.5 text-base leading-none transition-transform duration-150 group-hover:scale-125">
                {item.icon}
              </span>
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  {item.label}
                </p>
                <p className="truncate text-xs text-text-secondary">
                  {item.sub}
                </p>
              </div>
              <time className="shrink-0 text-xs text-text-muted tabular-nums">
                {relativeTime(item.time)}
              </time>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
