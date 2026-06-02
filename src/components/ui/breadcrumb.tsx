import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
  icon?: React.ElementType;
}

interface BreadcrumbNavProps {
  crumbs: BreadcrumbCrumb[];
  showHome?: boolean;
  className?: string;
}

export function BreadcrumbNav({
  crumbs,
  showHome = false,
  className,
}: BreadcrumbNavProps) {
  const all: BreadcrumbCrumb[] = showHome
    ? [{ label: "Home", href: "/dashboard", icon: Home }, ...crumbs]
    : crumbs;

  return (
    <nav aria-label="Breadcrumb" className={cn("mb-4", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-xs text-text-muted">
        {all.map((crumb, i) => {
          const isLast = i === all.length - 1;
          const Icon = crumb.icon;
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />
              )}
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="flex items-center gap-1 hover:text-text-primary transition-colors"
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className="flex items-center gap-1 text-text-secondary"
                  aria-current={isLast ? "page" : undefined}
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
