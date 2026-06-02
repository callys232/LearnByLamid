import Link from "next/link";
import { Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Course } from "@/types/types";

interface ContentGateProps {
  course: Course;
  isEnrolled: boolean;
  children: React.ReactNode;
}

export function ContentGate({
  course,
  isEnrolled,
  children,
}: ContentGateProps) {
  // Free course or enrolled — render content
  if (course.accessType === "free" || isEnrolled) return <>{children}</>;
  // Paid + not enrolled — show paywall
  return <PaywallCard course={course} />;
}

function PaywallCard({ course }: { course: Course }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-muted border border-primary/20 shadow-primary-sm">
        <Lock className="h-7 w-7 text-primary" />
      </div>

      <h2 className="mb-2 text-xl font-bold text-text-primary">
        Premium Content
      </h2>
      <p className="mb-2 text-sm text-text-secondary max-w-sm">
        This lesson is part of{" "}
        <span className="font-semibold text-text-primary">{course.title}</span>,
        a paid course. Enroll to unlock all {course.moduleIds.length} modules,
        quizzes, and your certificate.
      </p>
      <p className="mb-6 text-2xl font-bold text-primary">${course.price}</p>

      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <Link
          href={`/checkout/${course.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-primary-sm hover:bg-primary-hover hover:shadow-primary hover:-translate-y-px transition-all active:scale-[0.97]"
        >
          <Zap className="h-4 w-4" /> Enroll for ${course.price}
        </Link>
        <Link
          href="/courses"
          className="text-xs text-text-muted hover:text-primary transition-colors"
        >
          Browse free courses instead
        </Link>
      </div>

      {/* Preview badge */}
      <div className="mt-8 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <p className="text-xs text-text-secondary">
          First module preview available —{" "}
          <Link
            href={`/courses/${course.id}`}
            className="text-primary hover:underline"
          >
            view course
          </Link>
        </p>
      </div>
    </div>
  );
}

interface LockedModuleGateProps {
  moduleTitle: string;
  releaseDate?: string;
}

export function LockedModuleGate({
  moduleTitle,
  releaseDate,
}: LockedModuleGateProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-active border border-border">
        <Lock className="h-6 w-6 text-text-muted" />
      </div>
      <h2 className="mb-2 text-lg font-bold text-text-primary">
        Module Locked
      </h2>
      <p className="text-sm text-text-secondary max-w-sm">
        <span className="font-medium text-text-primary">{moduleTitle}</span>{" "}
        will unlock{" "}
        {releaseDate
          ? `on ${new Date(releaseDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}`
          : "when the previous module is completed"}
        .
      </p>
    </div>
  );
}
