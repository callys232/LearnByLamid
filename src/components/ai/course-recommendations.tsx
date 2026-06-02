"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Clock, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { mockCourses } from "@/mock/courses";
import type { Course } from "@/types/types";
import type { RecommendedCourse } from "@/app/api/ai/recommendations/route";

interface CourseRecommendationsProps {
  enrolledCourseIds: string[];
  completedCourseIds: string[];
  quizAvgScore?: number;
  categoryFocus?: string;
}

const catVariant: Record<string, "hcd" | "biz" | "sd"> = {
  "cat-hcd": "hcd",
  "cat-biz": "biz",
  "cat-sd": "sd",
};
const catLabel: Record<string, string> = {
  "cat-hcd": "HCD",
  "cat-biz": "BIZ",
  "cat-sd": "SD",
};

export function CourseRecommendations({
  enrolledCourseIds,
  completedCourseIds,
  quizAvgScore,
  categoryFocus,
}: CourseRecommendationsProps) {
  const [recs, setRecs] = useState<RecommendedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  const availableCourses = mockCourses.filter(
    (c) =>
      !enrolledCourseIds.includes(c.id) && !completedCourseIds.includes(c.id),
  );

  const enrolledKey = enrolledCourseIds.join(",");
  const completedKey = completedCourseIds.join(",");

  useEffect(() => {
    if (!availableCourses.length) {
      setLoading(false);
      return;
    }
    setLoading(true);

    fetch("/api/ai/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enrolledCourseIds,
        completedCourseIds,
        quizAvgScore,
        categoryFocus,
        availableCourses: availableCourses.map((c) => ({
          id: c.id,
          title: c.title,
          categoryId: c.categoryId,
          difficulty: c.difficulty,
        })),
      }),
    })
      .then((r) => r.json())
      .then((data) => setRecs(data.recommendations ?? []))
      .catch(() => setRecs([]))
      .finally(() => setLoading(false));
    // stable string keys prevent re-fetching on every render while still reacting to enrollment changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrolledKey, completedKey, quizAvgScore, categoryFocus]);

  return (
    <Card className="border-primary/15">
      {/* Shimmer top line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          Recommended for you
          <Badge variant="primary" className="ml-auto text-[10px]">
            AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {loading ? (
          <div className="px-5 pb-5 space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" rounded="lg" />
            ))}
          </div>
        ) : recs.length === 0 ? (
          <p className="px-5 pb-5 text-xs text-text-muted">
            No recommendations available — keep learning to unlock personalised
            suggestions.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {recs.map((rec) => {
              const course = mockCourses.find((c) => c.id === rec.courseId);
              if (!course) return null;
              return (
                <RecommendationRow
                  key={rec.courseId}
                  course={course}
                  rec={rec}
                />
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function RecommendationRow({
  course,
  rec,
}: {
  course: Course;
  rec: RecommendedCourse;
}) {
  return (
    <li className="group px-5 py-3 hover:bg-surface transition-colors">
      <Link href={`/courses/${course.id}`} className="flex items-start gap-3">
        {/* Letter avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-muted border border-primary/20 text-sm font-bold text-primary mt-0.5">
          {course.title[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
              {course.title}
            </p>
            <Badge
              variant={catVariant[course.categoryId] ?? "default"}
              className="shrink-0 text-[10px]"
            >
              {catLabel[course.categoryId] ?? course.categoryId}
            </Badge>
          </div>
          <p className="mt-0.5 text-[11px] text-text-muted line-clamp-2 leading-relaxed">
            {rec.reason}
          </p>
          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-text-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {course.estimatedHours}h
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
              {course.rating}
            </span>
            <span
              className={cn(
                "ml-auto font-medium",
                rec.priority === "high"
                  ? "text-primary"
                  : rec.priority === "medium"
                    ? "text-yellow-400"
                    : "text-text-muted",
              )}
            >
              {rec.priority} priority
            </span>
          </div>
        </div>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-text-muted group-hover:text-primary transition-colors mt-1" />
      </Link>
    </li>
  );
}
