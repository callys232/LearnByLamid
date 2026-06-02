"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PatternVariant = "dots" | "lines" | "grid" | "none";

interface BgPatternProps {
  children: ReactNode;
  variant?: PatternVariant;
  glow?: boolean;
  className?: string;
}

const patternClass: Record<PatternVariant, string> = {
  dots: "bg-dots",
  lines: "bg-lines",
  grid: "bg-grid",
  none: "",
};

export function BgPattern({
  children,
  variant = "dots",
  glow = true,
  className,
}: BgPatternProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Pattern layer */}
      {variant !== "none" && (
        <div
          className={cn(
            "pointer-events-none fixed inset-0 z-0",
            patternClass[variant],
          )}
          aria-hidden="true"
        />
      )}
      {/* Primary top glow */}
      {glow && (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[480px] bg-primary-fade"
          aria-hidden="true"
        />
      )}
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function PageContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-6 py-6 space-y-8", className)}>{children}</div>;
}
