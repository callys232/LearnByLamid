import Link from "next/link";
import { AnimatedBg } from "@/components/ui/animated-bg";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <AnimatedBg />
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* Glow backdrop */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-muted rounded-full blur-3xl pointer-events-none" />

        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-muted px-3 py-1 text-xs font-medium text-primary">
          AI-Powered Learning
        </span>

        <h1 className="text-5xl font-bold tracking-tight text-text-primary mb-4">
          Learn. Grow.{" "}
          <span className="text-gradient-red">Certify.</span>
        </h1>

        <p className="text-text-secondary text-lg leading-relaxed mb-8">
          The multi-tenant learning experience platform built for organizations
          that demand more — structured programs, live events, AI tutoring,
          and certified outcomes.
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-hover"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </main>
  );
}
