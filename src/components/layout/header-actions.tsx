"use client";

import { useRouter } from "next/navigation";
import { Search, Flame, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications";
import { useAuth } from "@/context/auth-context";
import { User } from "@/types/types";

interface HeaderActionsProps {
  user: Pick<User, "name" | "streak"> & { avatar?: User["avatar"] };
}

export function HeaderActions({ user }: HeaderActionsProps) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  function handleSignOut() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search"
        className="hover:scale-105 active:scale-95"
      >
        <Search className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 shadow-soft transition-all duration-150 hover:border-orange-500/30 hover:shadow-[0_2px_8px_rgba(251,146,60,0.15)]">
        <Flame className="h-3.5 w-3.5 text-orange-400" />
        <span className="text-xs font-semibold text-text-primary tabular-nums">
          {user.streak}
        </span>
      </div>

      <NotificationBell />

      {isAuthenticated ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="gap-1.5 text-text-secondary hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Sign out</span>
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/login")}
          className="gap-1.5 text-text-secondary hover:text-primary hover:bg-primary-muted"
        >
          <LogIn className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Sign in</span>
        </Button>
      )}
    </div>
  );
}
