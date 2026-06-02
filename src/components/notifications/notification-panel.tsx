"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, X, Check } from "lucide-react";
import { cn, relativeTime } from "@/lib/utils";
import { Notification } from "@/types/types";
import { mockNotifications } from "@/mock/notifications";

const typeIcon: Record<Notification["type"], string> = {
  course_reminder: "📚",
  quiz_ready: "🎯",
  event_starting: "🗓️",
  badge_earned: "🏅",
  cert_issued: "🎓",
  new_lecture: "📹",
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    mockNotifications.filter((n) => n.userId === "user-001"),
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function markAll() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markOne(id: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary transition-all duration-150 hover:scale-105 active:scale-95"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white animate-scale-in">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-border bg-background-secondary shadow-soft-lg animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-text-primary">
                Notifications
              </p>
              {unread > 0 && (
                <span className="rounded-full bg-primary-muted px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {unread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={markAll}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-text-muted hover:text-primary transition-colors"
                >
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="rounded-md p-1 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <ul className="max-h-80 divide-y divide-border overflow-y-auto no-scrollbar">
            {items.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-text-muted">
                All caught up ✓
              </li>
            ) : (
              items.map((notif) => (
                <li key={notif.id}>
                  <div
                    className={cn(
                      "group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface cursor-pointer",
                      !notif.read && "bg-primary-muted/30",
                    )}
                    onClick={() => markOne(notif.id)}
                  >
                    <span className="mt-0.5 text-lg leading-none">
                      {typeIcon[notif.type]}
                    </span>
                    <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                      <p
                        className={cn(
                          "text-xs font-semibold",
                          notif.read
                            ? "text-text-secondary"
                            : "text-text-primary",
                        )}
                      >
                        {notif.title}
                      </p>
                      <p className="line-clamp-2 text-xs text-text-muted">
                        {notif.body}
                      </p>
                      <time className="text-[10px] text-text-muted tabular-nums">
                        {relativeTime(notif.createdAt)}
                      </time>
                    </div>
                    {!notif.read && (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  {notif.href && (
                    <Link
                      href={notif.href}
                      className="block px-4 pb-2 text-[10px] text-primary hover:underline"
                      onClick={() => markOne(notif.id)}
                    >
                      View →
                    </Link>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
