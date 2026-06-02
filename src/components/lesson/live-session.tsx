import Link from "next/link";
import { Radio, PlayCircle, Calendar, Clock, ExternalLink } from "lucide-react";
import { cn, formatMinutes } from "@/lib/utils";
import type { LearningEvent } from "@/types/types";

interface LiveSessionProps {
  event: LearningEvent | null;
  lessonTitle: string;
}

export function LiveSession({ event, lessonTitle }: LiveSessionProps) {
  if (!event) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-active border border-border">
          <Radio className="h-6 w-6 text-text-muted" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-text-primary">
          Live Session
        </h2>
        <p className="text-sm text-text-secondary max-w-sm">
          <span className="font-medium text-text-primary">{lessonTitle}</span>{" "}
          is a live session. No recording is available yet.
        </p>
      </div>
    );
  }

  // Has recording — render video player
  if (event.recordingUrl && event.status === "completed") {
    return (
      <div className="flex flex-col">
        {/* Recording player */}
        <div className="relative bg-black aspect-video w-full max-h-[calc(100vh-14rem)] flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-br from-background-secondary to-black" />
          <div className="relative z-10 flex flex-col items-center gap-4 text-center px-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-white shadow-primary transition-all duration-150 hover:scale-110 hover:bg-primary active:scale-95 cursor-pointer">
              <PlayCircle className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90 mb-1">
                {event.title}
              </p>
              <p className="text-xs text-white/60">
                Recorded lecture · {formatMinutes(event.durationMinutes)}
              </p>
            </div>
          </div>
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{" "}
              Recording
            </span>
          </div>
          <div className="absolute top-4 right-4 text-xs text-white/50">
            {formatMinutes(event.durationMinutes)}
          </div>
        </div>

        {/* Event meta */}
        <div className="border-t border-border bg-background-secondary px-6 py-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(event.scheduledAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatMinutes(event.durationMinutes)}
            </span>
            <span>{event.attendedUserIds.length} attended live</span>
          </div>
        </div>
      </div>
    );
  }

  // Upcoming/live
  const isLive = event.status === "live";
  const scheduledDate = new Date(event.scheduledAt);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
      {isLive ? (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 border-2 border-red-500/30 animate-pulse-red">
          <Radio className="h-7 w-7 text-red-400" />
        </div>
      ) : (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-active border border-border">
          <Calendar className="h-7 w-7 text-text-muted" />
        </div>
      )}

      <div className="mb-6">
        {isLive ? (
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />{" "}
            LIVE NOW
          </span>
        ) : (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Upcoming Live Session
          </p>
        )}
        <h2 className="mt-2 text-lg font-bold text-text-primary">
          {event.title}
        </h2>
        <p className="mt-2 text-sm text-text-secondary max-w-sm mx-auto">
          {event.description}
        </p>
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-text-muted">
          {!isLive && (
            <span>
              {scheduledDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}{" "}
              ·{" "}
              {scheduledDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          )}
          <span>{formatMinutes(event.durationMinutes)}</span>
        </div>
      </div>

      {isLive && event.meetingUrl ? (
        <a
          href={event.meetingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-primary hover:bg-primary-hover hover:-translate-y-px transition-all active:scale-[0.97]"
        >
          <Radio className="h-4 w-4" /> Join Now{" "}
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </a>
      ) : (
        <Link
          href="/events"
          className="flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-primary hover:border-primary/30 hover:bg-surface-hover hover:-translate-y-px transition-all"
        >
          View in Events <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
