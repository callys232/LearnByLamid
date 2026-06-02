import { GraduationCap } from "lucide-react";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { currentUser } from "@/mock/users";

const navItems = [
  { label: "Dashboard",    href: "/dashboard",    icon: "LayoutDashboard" },
  { label: "My Learning",  href: "/my-learning",  icon: "GraduationCap"   },
  { label: "Courses",      href: "/courses",       icon: "BookOpen"        },
  { label: "Programs",     href: "/programs",      icon: "Layers"          },
  { label: "Events",       href: "/events",        icon: "Calendar"        },
  { label: "Leaderboard",  href: "/leaderboard",   icon: "Trophy"          },
  { label: "Certificates", href: "/certificates",  icon: "Award"           },
  { label: "Analytics",    href: "/analytics",     icon: "BarChart3"       },
];

const instructorItems = [
  { label: "My Courses",  href: "/instructor/courses", icon: "PenSquare" },
  { label: "Dashboard",   href: "/instructor",          icon: "BarChart3" },
];

const adminItems = [
  { label: "Users",  href: "/admin/users", icon: "Users"      },
  { label: "Admin",  href: "/admin",       icon: "LayoutGrid" },
];

const superAdminItems = [
  { label: "Platform", href: "/super-admin",          icon: "Globe"     },
  { label: "Tenants",  href: "/super-admin/tenants",  icon: "Building2" },
];

export function Sidebar() {
  const user         = currentUser;
  const isInstructor = ["instructor", "admin", "super_admin"].includes(user.role);
  const isAdmin      = ["admin", "super_admin"].includes(user.role);
  const isSuperAdmin = user.role === "super_admin";

  return (
    <aside className="hidden lg:flex h-screen w-60 shrink-0 flex-col border-r border-border bg-background-secondary">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-primary-sm">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold tracking-tight text-text-primary">
          LAMID <span className="text-primary">Learn</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4 no-scrollbar">
        {/* ── Learn ── */}
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          Learn
        </p>
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}

        {/* ── Teach (instructor+) ── */}
        {isInstructor && (
          <>
            <div className="my-3 border-t border-border" />
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              Teach
            </p>
            {instructorItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </>
        )}

        {/* ── Admin (admin+) ── */}
        {isAdmin && (
          <>
            <div className="my-3 border-t border-border" />
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              Manage
            </p>
            {adminItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </>
        )}

        {/* ── Platform (super_admin) ── */}
        {isSuperAdmin && (
          <>
            <div className="my-3 border-t border-border" />
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              Platform
            </p>
            {superAdminItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </>
        )}

        {/* ── Settings (all users) ── */}
        <div className="my-3 border-t border-border" />
        <NavLink label="Settings" href="/settings" icon="Settings" />
      </nav>

      {/* User footer */}
      <div className="border-t border-border p-3 space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0 rounded-lg px-2 py-2 transition-colors hover:bg-surface cursor-pointer">
            <Avatar src={user.avatar} name={user.name} size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm font-medium text-text-primary">
                {user.name}
              </span>
              <span className="truncate text-xs text-text-muted capitalize">
                {user.role.replace("_", " ")} · {user.xp.toLocaleString()} XP
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
