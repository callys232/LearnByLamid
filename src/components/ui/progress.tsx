"use client";

import { cn } from "@/lib/utils";
import { useId, useRef, useEffect } from "react";

interface ProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  size?: "xs" | "sm" | "md";
  animated?: boolean;
}

const trackSizes = { xs: "h-1", sm: "h-1.5", md: "h-2" };

export function Progress({
  value,
  className,
  barClassName,
  showLabel,
  size = "sm",
  animated = true,
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const id = useId();
  const labelId = `${id}-progress-label`;

  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    // Set concrete DOM attributes so scanners see evaluated values
    el.setAttribute("role", "progressbar");
    el.setAttribute("aria-valuenow", String(clamped));
    el.setAttribute("aria-valuemin", "0");
    el.setAttribute("aria-valuemax", "100");
    el.setAttribute("aria-valuetext", `${clamped}%`);
    if (showLabel) {
      el.setAttribute("aria-labelledby", labelId);
      el.removeAttribute("aria-label");
    } else {
      el.setAttribute("aria-label", `Progress: ${clamped}%`);
      el.removeAttribute("aria-labelledby");
    }
  }, [clamped, showLabel, labelId]);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        ref={barRef}
        className={cn(
          "relative flex-1 rounded-full bg-surface-active overflow-hidden",
          trackSizes[size],
        )}
      >
        <div
          className={cn(
            "absolute left-0 top-0 h-full rounded-full",
            animated ? "transition-all duration-700 ease-out-expo" : "",
            clamped === 100 ? "bg-emerald-500" : "bg-primary",
            barClassName,
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span
          id={labelId}
          className="shrink-0 text-xs text-text-muted tabular-nums w-8 text-right"
        >
          {clamped}%
        </span>
      )}
    </div>
  );
}
