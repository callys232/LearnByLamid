"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LogIn, Settings, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  name: string;
  avatar?: string;
  role: string;
  xp: number;
}

export function UserMenu({ name, avatar, role, xp }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!open) return;
    function dismiss(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", dismiss);
    return () => document.removeEventListener("mousedown", dismiss);
  }, [open]);

  function handleSignOut() {
    logout();
    setOpen(false);
    router.push("/login");
  }

  return (
    <div ref={ref} className="relative">
      {/* Popup */}
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-50 rounded-xl border border-border bg-surface shadow-soft-md overflow-hidden animate-fade-up">
          <div className="px-3 py-2.5 border-b border-border">
            <p className="text-xs font-semibold text-text-primary truncate">{name}</p>
            <p className="text-[11px] text-text-muted capitalize">{role.replace("_", " ")}</p>
          </div>

          <div className="p-1">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-primary hover:bg-primary-muted transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface",
          open && "bg-surface",
        )}
      >
        <Avatar src={avatar} name={name} size="sm" />
        <div className="flex flex-col min-w-0 flex-1 text-left">
          <span className="truncate text-sm font-medium text-text-primary">{name}</span>
          <span className="truncate text-xs text-text-muted capitalize">
            {role.replace("_", " ")} · {xp.toLocaleString()} XP
          </span>
        </div>
        <ChevronUp
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-text-muted transition-transform duration-200",
            open ? "rotate-0" : "rotate-180",
          )}
        />
      </button>
    </div>
  );
}
