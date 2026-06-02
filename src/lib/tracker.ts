/**
 * Client-side event tracker.
 * In production, swap the POST body with your analytics provider:
 * Segment, Mixpanel, PostHog, or your own /api/track endpoint.
 */

export type TrackEvent =
  | "lesson_started"
  | "lesson_completed"
  | "module_completed"
  | "course_enrolled"
  | "quiz_attempted"
  | "quiz_passed"
  | "certificate_earned"
  | "video_played"
  | "video_paused"
  | "video_progress"
  | "page_viewed"
  | "search_performed"
  | "button_clicked";

interface TrackPayload {
  event:      TrackEvent;
  userId?:    string;
  courseId?:  string;
  lessonId?:  string;
  moduleId?:  string;
  metadata?:  Record<string, unknown>;
  timestamp?: string;
}

export function track(event: TrackEvent, payload?: Omit<TrackPayload, "event">) {
  const body: TrackPayload = {
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  // Swap with real analytics call — fire-and-forget
  fetch("/api/track", {
    method:    "POST",
    headers:   { "Content-Type": "application/json" },
    body:      JSON.stringify(body),
    keepalive: true, // survives page navigation
  }).catch(() => { /* never block the UI */ });
}

/** Utility: track video progress milestones (25%, 50%, 75%, 100%) */
const seenMilestones = new Set<string>();
export function trackVideoMilestone(
  lessonId: string,
  progressPct: number,
  courseId?: string
) {
  const milestones = [25, 50, 75, 100];
  for (const m of milestones) {
    const key = `${lessonId}:${m}`;
    if (progressPct >= m && !seenMilestones.has(key)) {
      seenMilestones.add(key);
      track("video_progress", { lessonId, courseId, metadata: { milestone: m } });
    }
  }
}
