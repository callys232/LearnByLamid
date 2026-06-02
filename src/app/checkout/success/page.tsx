import Link from "next/link";
import { CheckCircle2, BookOpen, ArrowRight } from "lucide-react";
import { mockCourses } from "@/mock/courses";
import { mockModules, mockLessons } from "@/mock/modules";
import { GraduationCap } from "lucide-react";

interface PageProps { searchParams: Promise<{ courseId?: string }> }

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { courseId } = await searchParams;
  const course   = courseId ? mockCourses.find((c) => c.id === courseId) : null;
  const modules  = course   ? mockModules.filter((m) => m.courseId === course.id) : [];
  const firstLesson = modules[0]?.lessonIds[0]
    ? mockLessons.find((l) => l.id === modules[0].lessonIds[0])
    : null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-primary-sm">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-text-primary">LAMID <span className="text-primary">Learn</span></span>
      </div>

      <div className="w-full max-w-md text-center animate-scale-in">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 animate-pop">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-text-primary">Payment successful!</h1>
        <p className="mb-2 text-sm text-text-secondary">
          {course
            ? <>You&apos;re now enrolled in <span className="font-semibold text-text-primary">{course.title}</span>.</>
            : "Your enrollment is confirmed."}
        </p>
        <p className="mb-8 text-xs text-text-muted">A receipt has been sent to your email address.</p>

        <div className="flex flex-col gap-3">
          {firstLesson && course ? (
            <Link
              href={`/courses/${course.id}/learn/${firstLesson.id}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-primary-sm hover:bg-primary-hover hover:shadow-primary hover:-translate-y-px transition-all active:scale-[0.97]"
            >
              Start Learning <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
          {course && (
            <Link
              href={`/courses/${course.id}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3 text-sm font-medium text-text-primary hover:bg-surface-hover transition-all"
            >
              <BookOpen className="h-4 w-4" /> View course overview
            </Link>
          )}
          <Link href="/dashboard" className="text-xs text-text-muted hover:text-primary transition-colors">
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
