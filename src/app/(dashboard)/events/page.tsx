"use client";

import { useState } from "react";
import { Radio, Calendar, PlayCircle, Users } from "lucide-react";
import { Header } from "@/components/layout";
import { BreadcrumbNav } from "@/components/ui";
import { EventCard } from "@/components/events";
import { mockEvents } from "@/mock/events";
import { mockCourses } from "@/mock/courses";
import { mockUsers, currentUser } from "@/mock/users";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Filter = "all" | "live" | "upcoming" | "past";

const FILTERS: { key: Filter; label: string; dot?: boolean }[] = [
  { key: "all", label: "All Sessions" },
  { key: "live", label: "Live", dot: true },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

function getCourse(courseId?: string) {
  return courseId ? mockCourses.find((c) => c.id === courseId) : undefined;
}

export default function EventsPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const liveEvents = mockEvents.filter((e) => e.status === "live");
  const upcomingEvents = mockEvents.filter((e) => e.status === "upcoming");
  const recordedEvents = mockEvents.filter(
    (e) => e.status === "completed" && e.recordingUrl,
  );
  const totalRegistered = new Set(
    mockEvents.flatMap((e) => e.registeredUserIds),
  ).size;

  const filtered = mockEvents.filter((e) => {
    if (filter === "all") return true;
    if (filter === "live") return e.status === "live";
    if (filter === "upcoming") return e.status === "upcoming";
    if (filter === "past")
      return e.status === "completed" || e.status === "cancelled";
    return true;
  });

  // Sort: live first, then upcoming by date, then completed by date desc
  const sorted = [...filtered].sort((a, b) => {
    const order = { live: 0, upcoming: 1, completed: 2, cancelled: 3 };
    if (order[a.status] !== order[b.status])
      return order[a.status] - order[b.status];
    return (
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  });

  const stats = [
    {
      icon: Calendar,
      label: "Upcoming Sessions",
      value: upcomingEvents.length,
      color: "text-blue-400",
    },
    {
      icon: Radio,
      label: "Live Right Now",
      value: liveEvents.length,
      color: "text-red-400",
    },
    {
      icon: PlayCircle,
      label: "Recordings Available",
      value: recordedEvents.length,
      color: "text-violet-400",
    },
    {
      icon: Users,
      label: "Total Learners",
      value: formatNumber(mockUsers.length),
      color: "text-emerald-400",
    },
  ];

  return (
    <div>
      <Header
        title="Live Sessions"
        subtitle="Join live learning sessions with expert instructors in real-time."
        user={currentUser}
      />

      <div className="px-6 py-6 space-y-6">
        {/* Header row: breadcrumb + live indicator */}
        <div className="flex items-center justify-between">
          <BreadcrumbNav crumbs={[{ label: "Live Sessions" }]} />
          {liveEvents.length > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/8 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-xs font-semibold text-red-400">
                {liveEvents.length} Session{liveEvents.length > 1 ? "s" : ""}{" "}
                Live Now
              </span>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-hover">
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              <div>
                <p className={cn("text-2xl font-bold tabular-nums", color)}>
                  {value}
                </p>
                <p className="text-xs text-text-muted leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 rounded-xl border border-border bg-surface p-1 w-fit">
          {FILTERS.map(({ key, label, dot }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150",
                filter === key
                  ? "bg-text-primary text-text-inverse shadow-sm"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
              )}
            >
              {dot && (
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    filter === key ? "bg-red-400" : "bg-red-400/60",
                  )}
                />
              )}
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Calendar className="h-10 w-10 text-text-muted mb-3" />
            <p className="text-sm font-medium text-text-primary">
              No sessions here
            </p>
            <p className="text-xs text-text-muted mt-1">
              Try switching to a different filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                course={getCourse(event.courseId)}
                userId={currentUser.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
