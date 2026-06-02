"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Calendar,
  Award,
  BarChart3,
  Settings,
  Users,
  PenSquare,
  Globe,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Icon registry ─────────────────────────────────────────────────────────
// All icons used in nav must be listed here.
// sidebar.tsx passes plain strings — resolved here inside the client component.
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  BookOpen,
  Layers,
  Calendar,
  Award,
  BarChart3,
  Settings,
  Users,
  PenSquare,
  Globe,
  Building2,
};

export interface NavLinkProps {
  label: string;
  href: string;
  icon: string; // plain string key — safe to pass across RSC boundary
}

export function NavLink({ label, href, icon }: NavLinkProps) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  const Icon = ICON_MAP[icon] ?? BookOpen;

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        active
          ? "bg-primary-muted text-primary shadow-primary-sm"
          : "text-text-secondary hover:bg-surface hover:text-text-primary",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-150",
          active
            ? "text-primary"
            : "text-text-muted group-hover:text-text-secondary group-hover:translate-x-0.5",
        )}
      />
      <span className="flex-1">{label}</span>
      {active && (
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-scale-in" />
      )}
    </Link>
  );
}
