"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  Calendar,
  BarChart3,
  Award,
  Settings,
  Users,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { currentUser } from "@/mock/users";
import type { LucideIcon } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Courses", href: "/courses", icon: BookOpen },
  { label: "Programs", href: "/programs", icon: Layers },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Certificates", href: "/certificates", icon: Award },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
];

function MobileNavLink({
  label,
  href,
  icon: Icon,
  onClose,
}: {
  label: string;
  href: string;
  icon: LucideIcon;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150",
        active
          ? "bg-primary-muted text-primary"
          : "text-text-secondary hover:bg-surface hover:text-text-primary",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? "text-primary" : "text-text-muted",
        )}
      />
      {label}
    </Link>
  );
}

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary transition-all"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-background-secondary border-r border-border lg:hidden",
          "transition-transform duration-300 ease-out-expo",
          open ? "translate-x-0 shadow-soft-lg" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-primary-sm">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-text-primary">
              LAMID <span className="text-primary">Learn</span>
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface hover:text-text-primary transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar space-y-0.5">
          {navItems.map((item) => (
            <MobileNavLink
              key={item.href}
              {...item}
              onClose={() => setOpen(false)}
            />
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <Avatar
              src={currentUser.avatar}
              name={currentUser.name}
              size="sm"
            />
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm font-medium text-text-primary">
                {currentUser.name}
              </span>
              <span className="truncate text-xs text-text-muted capitalize">
                {currentUser.role} · {currentUser.xp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
