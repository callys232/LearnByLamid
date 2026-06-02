import Link from "next/link";
import { Clock, Users, Star, BookOpen, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui";
import { cn, formatNumber } from "@/lib/utils";
import { mockUsers } from "@/mock/users";
import type { Course } from "@/types/types";

interface CourseCardProps {
  course: Course;
  progress?: number;
  isEnrolled?: boolean;
  className?: string;
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  "cat-hcd": { label: "HCD", color: "text-orange-400" },
  "cat-biz": { label: "Business", color: "text-blue-400" },
  "cat-sd": { label: "Development", color: "text-emerald-400" },
};

const LEVEL_BADGE: Record<string, { label: string; bg: string }> = {
  beginner: { label: "Beginner", bg: "bg-emerald-500" },
  intermediate: { label: "Intermediate", bg: "bg-blue-500" },
  advanced: { label: "Advanced", bg: "bg-orange-500" },
};

export function CourseCard({
  course,
  progress,
  isEnrolled,
  className,
}: CourseCardProps) {
  const instructor = mockUsers.find((u) => u.id === course.instructorId);
  const catCfg = CATEGORY_CONFIG[course.categoryId];
  const lvlCfg = LEVEL_BADGE[course.difficulty];

  const discountPct =
    course.originalPrice && course.price
      ? Math.round((1 - course.price / course.originalPrice) * 100)
      : null;

  return (
    <Link href={`/courses/${course.id}`} className="block group">
      <div
        className={cn(
          "rounded-2xl border border-border bg-surface overflow-hidden",
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg hover:border-border-strong",
          className,
        )}
      >
        {/* Thumbnail */}
        <div className="relative h-44 w-full overflow-hidden bg-surface-active">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-active via-background to-surface transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-muted border border-primary/20 shadow-primary-sm group-hover:scale-110 group-hover:shadow-primary transition-all duration-300">
              <span className="text-2xl font-bold text-primary">
                {course.title[0]}
              </span>
            </div>
          </div>

          {/* Top-left: level + discount */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            {lvlCfg && (
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white",
                  lvlCfg.bg,
                )}
              >
                {lvlCfg.label}
              </span>
            )}
            {discountPct && (
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-white">
                -{discountPct}%
              </span>
            )}
          </div>

          {/* Top-right: Free badge */}
          {course.accessType === "free" && !discountPct && (
            <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
              Free
            </span>
          )}

          {/* Bottom-right: Enrolled */}
          {isEnrolled && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white">
              <CheckCircle2 className="h-3 w-3" /> Enrolled
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-4 space-y-2.5">
          {/* Category label */}
          {catCfg && (
            <p
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                catCfg.color,
              )}
            >
              {catCfg.label}
            </p>
          )}

          {/* Title — no clamp, full display */}
          <h3 className="text-sm font-bold text-text-primary leading-snug transition-colors group-hover:text-primary">
            {course.title}
          </h3>

          {/* Instructor */}
          {instructor && (
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-muted text-[9px] font-bold text-primary">
                {instructor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <span className="text-xs text-text-secondary">
                {instructor.name}
              </span>
              <CheckCircle2 className="h-3 w-3 text-blue-400 shrink-0" />
            </div>
          )}

          {/* Rating + stats */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1 shrink-0">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-text-primary">
                {course.rating}
              </span>
              {course.ratingCount && (
                <span className="text-text-muted">
                  ({formatNumber(course.ratingCount)})
                </span>
              )}
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Users className="h-3 w-3" />
              {formatNumber(course.enrollmentCount)} students
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="h-3 w-3" />
              {course.estimatedHours}h
            </span>
          </div>

          {/* Progress bar */}
          {progress !== undefined && (
            <Progress value={progress} showLabel animated size="sm" />
          )}

          {/* Price + lesson count */}
          <div className="flex items-end justify-between pt-1 border-t border-border">
            <div className="flex items-baseline gap-1.5">
              {course.accessType === "free" ? (
                <span className="text-base font-bold text-emerald-400">
                  Free
                </span>
              ) : course.price ? (
                <>
                  <span className="text-base font-bold text-text-primary">
                    ${course.price}
                  </span>
                  {course.originalPrice && (
                    <span className="text-xs text-text-muted line-through">
                      ${course.originalPrice}
                    </span>
                  )}
                </>
              ) : null}
            </div>
            {course.totalLessons && (
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <BookOpen className="h-3 w-3" />
                {course.totalLessons} lessons
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
