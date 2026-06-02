"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, UserPlus, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function GuestBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (user || dismissed) return null;

  return (
    <div className="w-full border-b border-primary/20 bg-primary/8 px-6 py-2.5 shrink-0">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-text-secondary">
          You&apos;re browsing as a guest.{" "}
          <span className="text-text-primary">
            Sign in to track progress, earn certificates, and unlock full content.
          </span>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface hover:text-text-primary transition-all"
          >
            <LogIn className="h-3.5 w-3.5" /> Log in
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover transition-all"
          >
            <UserPlus className="h-3.5 w-3.5" /> Sign up free
          </Link>
          <button
            type="button"
            aria-label="Dismiss banner"
            onClick={() => setDismissed(true)}
            className="ml-1 text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
