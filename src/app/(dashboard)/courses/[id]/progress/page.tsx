import Link from "next/link";
import type { ElementType } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Trophy,
  ArrowLeft,
} from "lucide-react";
import { Header } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  BreadcrumbNav,
  ProgressRing,
} from "@/components/ui";
import { mockCourses } from "@/mock/courses";
import { mockModules, mockLessons } from "@/mock/modules";
import { mockLearnerProgress } from "@/mock/analytics";
import { currentUser } from "@/mock/users";
import { formatMinutes } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CourseProgressPage({ params }: Props) {
  const { id } = await params;
  const course = mockCourses.find((c) => c.id === id);
  const progress = mockLearnerProgress.find(
    (p) => p.courseId === id && p.userId === currentUser.id,
  );

  if (!course) {
    return (
      <div className="px-6 py-10 text-center text-sm text-text-muted">
        Course not found.{" "}
        <Link href="/courses" className="text-primary hover:underline">
          Browse courses
        </Link>
      </div>
    );
  }

  const modules = course.moduleIds
    .map((id) => mockModules.find((m) => m.id === id))
    .filter(Boolean) as typeof mockModules;

  const completedIds = new Set(progress?.completedLessonIds ?? []);
  const totalLessons = modules.reduce((s, m) => s + m.lessonIds.length, 0);
  const doneCount = modules.reduce(
    (s, m) => s + m.lessonIds.filter((id) => completedIds.has(id)).length,
    0,
  );

  const quizAttempts = progress?.quizAttempts ?? [];
  const quizCorrect = quizAttempts.filter((a) => a.isCorrect).length;
  const quizAvg = quizAttempts.length
    ? Math.round((quizCorrect / quizAttempts.length) * 100)
    : null;

  const summaryCards: Array<{
    label: string;
    value: string;
    icon: ElementType;
    ring?: boolean;
    ringValue?: number;
  }> = [
    {
      label: "Overall Progress",
      value: `${progress?.percentComplete ?? 0}%`,
      icon: ProgressRing,
      ring: true,
      ringValue: progress?.percentComplete ?? 0,
    },
    {
      label: "Watch Time",
      value: formatMinutes(progress?.timeSpentMinutes ?? 0),
      icon: Clock,
    },
    {
      label: "Quiz Average",
      value: quizAvg !== null ? `${quizAvg}%` : "—",
      icon: Trophy,
    },
    {
      label: "Lessons Done",
      value: `${doneCount} / ${totalLessons}`,
      icon: BookOpen,
    },
  ];

  return (
    <div>
      <Header title="My Progress" subtitle={course.title} user={currentUser} />

      <div className="px-6 py-6 space-y-6 max-w-3xl">
        <BreadcrumbNav
          crumbs={[
            { label: "Courses", href: "/courses" },
            { label: course.title, href: `/courses/${course.id}` },
            { label: "Progress" },
          ]}
        />

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {summaryCards.map(({ label, value, icon: Icon, ring, ringValue }) => (
            <Card key={label}>
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                {ring && ringValue !== undefined ? (
                  <ProgressRing value={ringValue} size={52} strokeWidth={5} />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-muted">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                )}
                <p className="text-lg font-bold text-text-primary tabular-nums">
                  {value}
                </p>
                <p className="text-xs text-text-muted">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Module breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Module Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {modules.map((mod, mi) => {
              const lessons = mod.lessonIds
                .map((id) => mockLessons.find((l) => l.id === id))
                .filter(Boolean) as typeof mockLessons;
              const modDone = lessons.filter((l) =>
                completedIds.has(l.id),
              ).length;
              const modComplete =
                modDone === lessons.length && lessons.length > 0;

              return (
                <div
                  key={mod.id}
                  className="border-b border-border last:border-0"
                >
                  {/* Module header */}
                  <div className="flex items-center justify-between px-5 py-3 bg-surface">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-muted text-xs font-bold text-primary">
                        {mi + 1}
                      </span>
                      <p className="text-sm font-semibold text-text-primary">
                        {mod.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted">
                        {modDone}/{lessons.length} lessons
                      </span>
                      <Badge
                        variant={
                          modComplete
                            ? "success"
                            : modDone > 0
                              ? "warning"
                              : "default"
                        }
                      >
                        {modComplete
                          ? "Complete"
                          : modDone > 0
                            ? "In progress"
                            : "Not started"}
                      </Badge>
                    </div>
                  </div>

                  {/* Lessons */}
                  <ul className="divide-y divide-border">
                    {lessons.map((lesson) => {
                      const done = completedIds.has(lesson.id);
                      const quiz = quizAttempts.find((a) =>
                        lesson.quizIds?.includes(a.quizId),
                      );
                      return (
                        <li
                          key={lesson.id}
                          className="flex items-center gap-3 px-5 py-2.5 hover:bg-surface transition-colors"
                        >
                          {done ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-text-muted" />
                          )}
                          <span
                            className={`flex-1 text-sm ${done ? "line-through text-text-muted" : "text-text-primary"}`}
                          >
                            {lesson.title}
                          </span>
                          <Badge
                            variant="default"
                            className="capitalize text-[10px]"
                          >
                            {lesson.type}
                          </Badge>
                          <span className="text-xs text-text-muted tabular-nums w-10 text-right">
                            {lesson.durationMinutes}m
                          </span>
                          {quiz && (
                            <Badge
                              variant={quiz.isCorrect ? "success" : "danger"}
                              className="text-[10px]"
                            >
                              {quiz.isCorrect ? "✓" : "✗"} Quiz
                            </Badge>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Link
            href={`/courses/${course.id}`}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back to course
          </Link>
        </div>
      </div>
    </div>
  );
}
