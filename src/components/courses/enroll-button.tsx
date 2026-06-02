"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Course } from "@/types/types";

interface EnrollButtonProps {
  course: Course;
  isEnrolled: boolean;
  firstLessonId?: string;
}

export function EnrollButton({
  course,
  isEnrolled: initialEnrolled,
  firstLessonId,
}: EnrollButtonProps) {
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(initialEnrolled);
  const [loading, setLoading] = useState(false);
  const [justDone, setJustDone] = useState(false);

  async function handleEnroll() {
    // Already enrolled → go to first lesson
    if (enrolled && firstLessonId) {
      router.push(`/courses/${course.id}/learn/${firstLessonId}`);
      return;
    }

    // Paid course → go to checkout
    if (course.accessType === "paid") {
      router.push(`/checkout/${course.id}`);
      return;
    }

    // Free course → enroll immediately
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setEnrolled(true);
    setJustDone(true);
    setLoading(false);
    setTimeout(() => {
      if (firstLessonId)
        router.push(`/courses/${course.id}/learn/${firstLessonId}`);
    }, 900);
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className={cn(
        "w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.97]",
        justDone
          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
          : enrolled
            ? "bg-surface border border-border text-text-primary hover:border-primary/40 hover:bg-primary-muted hover:text-primary hover:-translate-y-px"
            : "bg-primary text-white shadow-primary-sm hover:bg-primary-hover hover:shadow-primary hover:-translate-y-px",
        loading && "opacity-60 pointer-events-none",
      )}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Enrolling…
        </span>
      ) : justDone ? (
        <span className="flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> Enrolled! Starting…
        </span>
      ) : enrolled ? (
        "Continue Learning →"
      ) : course.accessType === "paid" ? (
        `Enroll — $${course.price}`
      ) : (
        "Enroll Free"
      )}
    </button>
  );
}
