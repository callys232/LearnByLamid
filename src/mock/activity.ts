import type { ActivityItem } from "@/types/types";

export const mockActivity: ActivityItem[] = [
  {
    id: "1",
    label: "Completed lesson",
    sub: "The Empathy Map — HCD Foundations",
    time: "2026-05-06T14:30:00Z",
    icon: "✅",
  },
  {
    id: "2",
    label: "Quiz passed",
    sub: "Quiz 2 · 100% correct",
    time: "2026-05-06T14:15:00Z",
    icon: "🎯",
  },
  {
    id: "3",
    label: "Enrolled in course",
    sub: "Prototyping & Validation",
    time: "2026-05-05T10:00:00Z",
    icon: "📚",
  },
  {
    id: "4",
    label: "Event registered",
    sub: "Live Workshop: Empathy Mapping",
    time: "2026-05-04T09:30:00Z",
    icon: "🗓️",
  },
  {
    id: "5",
    label: "Badge earned",
    sub: "7-day streak — On Fire!",
    time: "2026-05-03T20:00:00Z",
    icon: "🔥",
  },
];
