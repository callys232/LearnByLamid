"use client";

import { Search, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/notifications";
import type { User } from "@/types/types";

interface HeaderActionsProps {
  user: Pick<User, "name" | "streak"> & { avatar?: User["avatar"] };
}

export function HeaderActions({ user }: HeaderActionsProps) {
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

      <div className="hover:scale-110 transition-transform duration-150 cursor-pointer">
        <Avatar src={user.avatar} name={user.name} size="sm" />
      </div>
    </div>
  );
}
