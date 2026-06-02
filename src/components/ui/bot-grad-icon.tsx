import { cn } from "@/lib/utils";

/**
 * Custom composite icon: robot head wearing a graduation cap.
 * Matches Lucide's 24×24 viewBox and stroke conventions.
 */
export function BotGradIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* ── Bot head ── */}
      <rect x="3" y="10" width="18" height="12" rx="2" />

      {/* Eyes — filled dots */}
      <circle cx="9"  cy="16" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="16" r="1.4" fill="currentColor" stroke="none" />

      {/* Mouth / smile */}
      <path d="M9.5 20 Q12 21.5 14.5 20" />

      {/* ── Graduation cap ── */}
      {/* Crown sitting above the head */}
      <rect x="7.5" y="4.5" width="9" height="5.5" rx="0.75" />

      {/* Brim — wider than the crown, sits at the crown/head junction */}
      <line x1="1.5" y1="10" x2="22.5" y2="10" />

      {/* Tassel hanging from right side of brim */}
      <line x1="21" y1="10" x2="21" y2="14.5" />
      <circle cx="21" cy="15" r="0.85" fill="currentColor" stroke="none" />
    </svg>
  );
}
