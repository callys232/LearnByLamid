"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { mockCourses } from "@/mock/courses";
import type { SkillGapResult } from "@/app/api/ai/skill-gaps/route";
import { LearnerProgress, QuizAttempt } from "@/types/types";

interface SkillGapPanelProps {
  progress: LearnerProgress[];
  quizAttempts: QuizAttempt[];
  completedCourses: { id: string; title: string }[];
  enrolledCourses: { id: string; title: string }[];
}

const severityConfig = {
  high: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    label: "Critical",
  },
  medium: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    label: "Moderate",
  },
  low: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "Minor",
  },
};

export function SkillGapPanel({
  progress,
  quizAttempts,
  completedCourses,
  enrolledCourses,
}: SkillGapPanelProps) {
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const [loading, setLoading] = useState(true);

  const completedKey = completedCourses.map((c) => c.id).join(",");
  const enrolledKey = enrolledCourses.map((c) => c.id).join(",");

  useEffect(() => {
    setLoading(true);

    fetch("/api/ai/skill-gaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        progress,
        quizAttempts,
        completedCourses,
        enrolledCourses,
        availableCourses: mockCourses.map((c) => ({
          id: c.id,
          title: c.title,
          categoryId: c.categoryId,
        })),
      }),
    })
      .then((r) => r.json())
      .then(setResult)
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
    // stable string keys prevent re-fetching on every render while still reacting to course changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedKey, enrolledKey]);

  return (
    <Card className="border-primary/15">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="h-4 w-4 text-primary" />
          Skill Gap Analysis
          <Badge variant="primary" className="ml-auto text-[10px]">
            AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-20 w-full" rounded="lg" />
            <Skeleton className="h-20 w-full" rounded="lg" />
          </div>
        ) : !result ? (
          <p className="text-xs text-text-muted">
            Skill analysis unavailable. Complete more lessons to unlock
            insights.
          </p>
        ) : (
          <>
            {/* Overall score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-text-secondary">
                  Overall Skill Score
                </p>
                <span
                  className={cn(
                    "text-lg font-bold",
                    result.overallScore >= 70
                      ? "text-emerald-400"
                      : result.overallScore >= 40
                        ? "text-yellow-400"
                        : "text-red-400",
                  )}
                >
                  {result.overallScore}%
                </span>
              </div>
              <Progress
                value={result.overallScore}
                barClassName={
                  result.overallScore >= 70
                    ? "bg-emerald-500"
                    : result.overallScore >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }
              />
            </div>

            {/* Skill gaps */}
            {result.gaps.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" /> Gaps
                  Identified
                </p>
                <div className="space-y-2">
                  {result.gaps.map((gap, i) => {
                    const cfg = severityConfig[gap.severity];
                    const course = gap.courseId
                      ? mockCourses.find((c) => c.id === gap.courseId)
                      : null;
                    return (
                      <div
                        key={i}
                        className={cn(
                          "rounded-xl border p-3",
                          cfg.bg,
                          cfg.border,
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={cn("text-xs font-semibold", cfg.color)}>
                            {gap.area}
                          </p>
                          <Badge
                            className={cn(
                              "text-[10px]",
                              cfg.color,
                              cfg.bg,
                              cfg.border,
                            )}
                            style={{}}
                          >
                            {cfg.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {gap.description}
                        </p>
                        {course && (
                          <Link
                            href={`/courses/${course.id}`}
                            className="mt-2 flex items-center gap-1 text-[10px] text-primary hover:underline"
                          >
                            <ChevronRight className="h-3 w-3" /> Bridge with:{" "}
                            {course.title}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Your
                  Strengths
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.strengths.map((s, i) => (
                    <Badge key={i} variant="success" className="text-[10px]">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" /> Suggested
                  Actions
                </p>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-text-secondary"
                    >
                      <span className="mt-0.5 text-primary shrink-0">→</span>
                      <span>{s.action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
