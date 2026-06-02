"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

type ConsentState = "pending" | "accepted" | "declined";

const STORAGE_KEY = "lamid-cookie-consent";

export function CookieBanner() {
  const [state, setState] = useState<ConsentState | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ConsentState | null;
    setState(saved ?? "pending");
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setState("accepted");
    // Enable analytics tracking
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setState("declined");
  }

  if (state !== "pending") return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-lg",
        "rounded-2xl border border-border bg-surface shadow-soft-lg",
        "animate-slide-up",
      )}
    >
      {/* Shimmer top line */}
      <div className="h-px w-full rounded-t-2xl bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="p-5">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-muted">
            <Cookie className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">
              We use cookies
            </p>
            <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">
              We use cookies to personalise your learning experience, remember
              your preferences, and analyse platform usage.{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Learn more
              </Link>
            </p>
          </div>
          <button
            onClick={decline}
            className="rounded-md p-1 text-text-muted hover:text-text-primary transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={accept}
            className="flex-1 rounded-xl bg-primary py-2 text-xs font-semibold text-white shadow-primary-sm hover:bg-primary-hover hover:-translate-y-px transition-all active:scale-[0.97]"
          >
            Accept all
          </button>
          <button
            onClick={decline}
            className="flex-1 rounded-xl border border-border bg-background py-2 text-xs font-medium text-text-secondary hover:bg-surface hover:text-text-primary transition-all"
          >
            Essential only
          </button>
          <Link
            href="/settings/privacy"
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-text-muted hover:bg-surface hover:text-primary transition-all"
          >
            Manage
          </Link>
        </div>
      </div>
    </div>
  );
}
