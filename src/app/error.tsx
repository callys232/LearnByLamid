"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-sm font-medium text-primary mb-2">Something went wrong</p>
      <h1 className="text-3xl font-bold text-text-primary mb-3">
        Unexpected error
      </h1>
      <p className="text-text-secondary text-sm max-w-sm mb-8">
        An error occurred while loading this page. Try again or return to the
        dashboard.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-hover"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
