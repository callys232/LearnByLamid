"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, Users, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, relativeTime } from "@/lib/utils";

interface RealtimePayload {
  activeUsers: number;
  recentEvent: {
    id: string;
    user: string;
    action: string;
    timestamp: string;
  } | null;
  dropOffAlert: { module: string; rate: number } | null;
  serverTime: string;
}

interface EventItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

export function ActiveUsersWidget() {
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [alert, setAlert] = useState<{ module: string; rate: number } | null>(
    null,
  );
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    function connect() {
      const es = new EventSource("/api/sse/active-users");
      esRef.current = es;

      es.onopen = () => setConnected(true);

      es.onmessage = (e) => {
        try {
          const data: RealtimePayload = JSON.parse(e.data);
          setActiveUsers(data.activeUsers);
          if (data.recentEvent) {
            setEvents((prev) => [data.recentEvent!, ...prev].slice(0, 8));
          }
          if (data.dropOffAlert) {
            setAlert(data.dropOffAlert);
            setTimeout(() => setAlert(null), 8000);
          }
        } catch {
          /* malformed payload */
        }
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        // Reconnect after 5s
        setTimeout(connect, 5000);
      };
    }

    connect();
    return () => esRef.current?.close();
  }, []);

  return (
    <Card className="border-primary/15 overflow-hidden">
      {/* Animated top bar while connected */}
      <div
        className={cn(
          "h-0.5 w-full transition-colors duration-500",
          connected
            ? "bg-gradient-to-r from-emerald-500/50 via-emerald-400 to-emerald-500/50 animate-pulse"
            : "bg-border",
        )}
      />

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4 text-primary" />
          Live Platform Activity
          <div className="ml-auto flex items-center gap-1.5">
            {connected ? (
              <>
                <Wifi className="h-3 w-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-text-muted" />
                <span className="text-[10px] text-text-muted">
                  Reconnecting…
                </span>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Active users counter */}
        <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-muted">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-text-muted">Active right now</p>
            <p className="text-3xl font-bold text-text-primary tabular-nums">
              {activeUsers !== null ? (
                <span className="animate-fade-in">{activeUsers}</span>
              ) : (
                <span className="text-text-muted">—</span>
              )}
            </p>
          </div>
        </div>

        {/* Drop-off alert */}
        {alert && (
          <div className="flex items-start gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/8 p-3 animate-scale-in">
            <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-yellow-400">
                Drop-off alert
              </p>
              <p className="text-xs text-text-secondary">
                <span className="font-medium">{alert.module}</span> —{" "}
                {alert.rate}% of learners leaving at this module
              </p>
            </div>
          </div>
        )}

        {/* Recent events feed */}
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Recent Activity
          </p>
          {events.length === 0 ? (
            <p className="text-xs text-text-muted">Waiting for activity…</p>
          ) : (
            <ul className="space-y-2">
              {events.map((evt) => (
                <li
                  key={evt.id}
                  className="flex items-center justify-between gap-3 animate-fade-up"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-xs text-text-primary font-medium shrink-0">
                      {evt.user}
                    </span>
                    <span className="truncate text-xs text-text-secondary">
                      {evt.action}
                    </span>
                  </div>
                  <time className="shrink-0 text-[10px] text-text-muted tabular-nums">
                    {relativeTime(evt.timestamp)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
