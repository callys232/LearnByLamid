import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  href,
  linkLabel = "View all",
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn("mb-4 flex items-start justify-between gap-4", className)}
    >
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
        {description && (
          <p className="text-xs text-text-secondary">{description}</p>
        )}
      </div>
      {action ??
        (href && (
          <Link
            href={href}
            className="shrink-0 text-xs text-primary hover:underline"
          >
            {linkLabel}
          </Link>
        ))}
    </div>
  );
}
