"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Users,
  Video,
  Radio,
  PlayCircle,
  Calendar,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { cn, formatMinutes } from "@/lib/utils";
import { EventFormat, LearningEvent, Course } from "@/types/types";

// ─── Config ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  live: {
    label: "LIVE",
    dot: "bg-red-400",
    pill: "bg-red-500/15 text-red-400 border-red-500/30",
    card: "border-red-500/40 shadow-[0_4px_24px_rgba(239,68,68,0.18)]",
    titleClass: "text-primary",
  },
  upcoming: {
    label: "Upcoming",
    dot: "bg-blue-400",
    pill: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    card: "",
    titleClass: "text-text-primary",
  },
  completed: {
    label: "Recording",
    dot: "bg-violet-400",
    pill: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    card: "",
    titleClass: "text-text-primary",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-text-muted",
    pill: "bg-surface text-text-muted border-border",
    card: "opacity-60",
    titleClass: "text-text-muted",
  },
} as const;

// Completed without recording = "Ended"
function getStatusLabel(event: LearningEvent) {
  if (event.status === "completed" && !event.recordingUrl) return "Ended";
  return STATUS_CONFIG[event.status].label;
}

const FORMAT_CONFIG: Record<
  EventFormat,
  { icon: React.ElementType; label: string }
> = {
  zoom: { icon: Video, label: "Zoom" },
  webrtc: { icon: Radio, label: "Live Stream" },
  in_person: { icon: Users, label: "In Person" },
};

// ─── Countdown ───────────────────────────────────────────────────────────────

function formatCountdown(scheduledAt: string): string {
  const diff = new Date(scheduledAt).getTime() - Date.now();
  if (diff <= 0) return "Starting soon";
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (days > 0) return `Starts in ${days}d ${hours}h`;
  if (hours > 0) return `Starts in ${hours}h ${mins}m`;
  return `Starts in ${mins}m`;
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface EventCardProps {
  event: LearningEvent;
  course?: Course;
  userId?: string;
  className?: string;
}

// ─── Card ────────────────────────────────────────────────────────────────────

export function EventCard({
  event,
  course,
  userId,
  className,
}: EventCardProps) {
  const [bookmarked, setBookmarked] = useState(false);

  const cfg = STATUS_CONFIG[event.status];
  const fmt = FORMAT_CONFIG[event.format];
  const FormatIcon = fmt.icon;
  const statusLabel = getStatusLabel(event);

  const isRegistered = userId
    ? event.registeredUserIds.includes(userId)
    : false;
  const attended = userId ? event.attendedUserIds.includes(userId) : false;
  const watchedReplay = userId
    ? event.replayWatchedByUserIds.includes(userId)
    : false;
  const isTracked = attended || watchedReplay;

  const date = new Date(event.scheduledAt);
  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeLabel = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });

  const hasRecording = event.status === "completed" && !!event.recordingUrl;
  const hasEnded = event.status === "completed" && !event.recordingUrl;
  const isLive = event.status === "live";
  const isUpcoming = event.status === "upcoming";

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-surface overflow-hidden",
        "transition-all duration-200 hover:-translate-y-0.5",
        cfg.card,
        !cfg.card &&
          "border-border hover:border-border-strong hover:shadow-soft-md",
        isLive && "animate-[pulse-red_3s_ease-in-out_infinite]",
        className,
      )}
    >
      {/* Live pulse bar */}
      {isLive && (
        <div className="h-0.5 w-full bg-gradient-to-r from-red-500/30 via-red-500 to-red-500/30" />
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Top row: status + bookmark */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
              cfg.pill,
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                cfg.dot,
                isLive && "animate-pulse",
              )}
            />
            {statusLabel}
          </span>

          <button
            type="button"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark session"}
            onClick={() => setBookmarked((b) => !b)}
            className="shrink-0 text-text-muted hover:text-primary transition-colors"
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "mb-1.5 text-sm font-bold leading-snug transition-colors duration-150",
            isLive
              ? "text-primary"
              : "text-text-primary group-hover:text-primary",
          )}
        >
          {event.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-xs text-text-secondary leading-relaxed flex-1">
          {event.description}
        </p>

        {/* Meta */}
        <div className="mb-4 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>
              {dateLabel} · {timeLabel}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {formatMinutes(event.durationMinutes)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0" />
              {event.registeredUserIds.length} registered
              {event.maxCapacity && ` / ${event.maxCapacity} max`}
            </span>
          </div>
          {course && (
            <p className="text-[10px] text-text-muted truncate">
              {course.title}
            </p>
          )}
        </div>

        {/* CTA */}
        <EventCTA
          event={event}
          isRegistered={isRegistered}
          isTracked={isTracked}
          hasRecording={hasRecording}
          hasEnded={hasEnded}
          isLive={isLive}
          isUpcoming={isUpcoming}
        />
      </div>
    </div>
  );
}

// ─── CTA section ─────────────────────────────────────────────────────────────

function EventCTA({
  event,
  isRegistered,
  isTracked,
  hasRecording,
  hasEnded,
  isLive,
  isUpcoming,
}: {
  event: LearningEvent;
  isRegistered: boolean;
  isTracked: boolean;
  hasRecording: boolean;
  hasEnded: boolean;
  isLive: boolean;
  isUpcoming: boolean;
}) {
  // ── Live ──
  if (isLive) {
    return (
      <a
        href={event.meetingUrl ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-primary-sm hover:bg-primary-hover hover:-translate-y-px transition-all duration-150 active:scale-[0.97]"
      >
        <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
        Join Live Now
      </a>
    );
  }

  // ── Recording available ──
  if (hasRecording) {
    return (
      <Link
        href={event.recordingUrl!}
        className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-hover px-4 py-2.5 text-sm font-semibold text-text-primary hover:border-primary/30 hover:text-primary hover:-translate-y-px transition-all duration-150"
      >
        <PlayCircle className="h-4 w-4 text-primary" />
        {isTracked ? "Watch Again" : "Watch Recording"}
      </Link>
    );
  }

  // ── Ended (no recording) ──
  if (hasEnded) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-muted">
        Session ended · no recording
      </div>
    );
  }

  // ── Upcoming ──
  if (isUpcoming) {
    const countdown = formatCountdown(event.scheduledAt);
    return (
      <div className="space-y-2">
        {/* Countdown badge */}
        <div className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/8 px-4 py-2 text-xs font-medium text-blue-400">
          <Clock className="h-3.5 w-3.5" />
          {countdown}
        </div>
        {/* Register / Registered */}
        {isRegistered ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/8 px-4 py-2 text-sm font-medium text-emerald-400">
            ✓ Registered
          </div>
        ) : (
          <button
            type="button"
            className="w-full rounded-xl border border-border-strong bg-text-primary px-4 py-2 text-sm font-semibold text-text-inverse hover:bg-text-secondary transition-all duration-150 active:scale-[0.97]"
          >
            + Register Free
          </button>
        )}
      </div>
    );
  }

  return null;
}
