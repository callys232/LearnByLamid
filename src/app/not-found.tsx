import Link from "next/link";
import { GraduationCap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-6">
        <GraduationCap className="h-7 w-7 text-white" />
      </div>

      <p className="text-sm font-medium text-primary mb-2">404</p>
      <h1 className="text-3xl font-bold text-text-primary mb-3">
        Page not found
      </h1>
      <p className="text-text-secondary text-sm max-w-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        Back to Dashboard
      </Link>
    </main>
  );
}
