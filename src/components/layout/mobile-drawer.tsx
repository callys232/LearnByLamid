"use client";

import { useState, useEffect } from "react";
import {
  Menu, X, GraduationCap, BookOpen, LayoutDashboard, Calendar,
  BarChart3, Award, Settings, Users, Layers, Trophy, GraduationCap as MyLearning,
  Globe, Building2, PenSquare, LayoutGrid, LogOut, LogIn,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { currentUser } from "@/mock/users";
import { useAuth } from "@/context/auth-context";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const learnItems: NavItem[] = [
  { label: "Dashboard",    href: "/dashboard",    icon: LayoutDashboard },
  { label: "My Learning",  href: "/my-learning",  icon: MyLearning      },
  { label: "Courses",      href: "/courses",      icon: BookOpen        },
  { label: "Programs",     href: "/programs",     icon: Layers          },
  { label: "Events",       href: "/events",       icon: Calendar        },
  { label: "Leaderboard",  href: "/leaderboard",  icon: Trophy          },
  { label: "Certificates", href: "/certificates", icon: Award           },
  { label: "Analytics",    href: "/analytics",    icon: BarChart3       },
];

const instructorItems: NavItem[] = [
  { label: "My Courses", href: "/instructor/courses", icon: PenSquare  },
  { label: "Dashboard",  href: "/instructor",         icon: BarChart3  },
];

const adminItems: NavItem[] = [
  { label: "Users", href: "/admin/users", icon: Users       },
  { label: "Admin", href: "/admin",       icon: LayoutGrid  },
];

const superAdminItems: NavItem[] = [
  { label: "Platform", href: "/super-admin",         icon: Globe      },
  { label: "Tenants",  href: "/super-admin/tenants", icon: Building2  },
];

function MobileNavLink({ label, href, icon: Icon, onClose }: NavItem & { onClose: () => void }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClose}
      className={cn(
        "flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-150",
        active
          ? "bg-primary-muted text-primary"
          : "text-text-secondary hover:bg-surface hover:text-text-primary",
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", active ? "text-primary" : "text-text-muted")} />
      {label}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 mb-1 px-4 text-[11px] font-semibold uppercase tracking-widest text-text-muted">
      {children}
    </p>
  );
}

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const user = currentUser;
  const isInstructor = ["instructor", "admin", "super_admin"].includes(user.role);
  const isAdmin      = ["admin", "super_admin"].includes(user.role);
  const isSuperAdmin = user.role === "super_admin";

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleSignOut() {
    logout();
    setOpen(false);
    router.push("/login");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary transition-all"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer — 85 vw so it fills most of the screen on any phone */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[85vw] max-w-sm flex-col bg-background-secondary border-r border-border lg:hidden",
          "transition-transform duration-300 ease-out-expo",
          open ? "translate-x-0 shadow-soft-lg" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-primary-sm">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-text-primary">
              LAMID <span className="text-primary">Learn</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 text-text-muted hover:bg-surface hover:text-text-primary transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav — scrolls independently */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <SectionLabel>Learn</SectionLabel>
          {learnItems.map((item) => (
            <MobileNavLink key={item.href} {...item} onClose={() => setOpen(false)} />
          ))}

          {isInstructor && (
            <>
              <SectionLabel>Teach</SectionLabel>
              {instructorItems.map((item) => (
                <MobileNavLink key={item.href} {...item} onClose={() => setOpen(false)} />
              ))}
            </>
          )}

          {isAdmin && (
            <>
              <SectionLabel>Manage</SectionLabel>
              {adminItems.map((item) => (
                <MobileNavLink key={item.href} {...item} onClose={() => setOpen(false)} />
              ))}
            </>
          )}

          {isSuperAdmin && (
            <>
              <SectionLabel>Platform</SectionLabel>
              {superAdminItems.map((item) => (
                <MobileNavLink key={item.href} {...item} onClose={() => setOpen(false)} />
              ))}
            </>
          )}

          <div className="my-3 border-t border-border" />
          <MobileNavLink label="Settings" href="/settings" icon={Settings} onClose={() => setOpen(false)} />
        </nav>

        {/* User footer */}
        <div className="shrink-0 border-t border-border p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar src={user.avatar} name={user.name} size="md" />
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm font-semibold text-text-primary">{user.name}</span>
              <span className="truncate text-xs text-text-muted capitalize">
                {user.role.replace("_", " ")} · {user.xp.toLocaleString()} XP
              </span>
            </div>
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-primary hover:bg-primary-muted transition-colors"
            >
              <LogIn className="h-5 w-5 shrink-0" />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
