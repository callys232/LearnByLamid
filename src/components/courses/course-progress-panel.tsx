import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Lock,
  PlayCircle,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Progress,
} from "@/components/ui";
import { cn, formatMinutes } from "@/lib/utils";
import { Course, Module, Lesson, LearnerProgress } from "@/types/types";

interface CourseProgressPanelProps {
  course: Course;
  modules: Module[];
  lessons: Lesson[];
  progress: LearnerProgress;
  compact?: boolean;
}

function getModuleStatus(
  module: Module,
  completedModuleIds: string[],
  completedLessonIds: string[],
): "completed" | "in_progress" | "locked" | "not_started" {
  if (module.isLocked) return "locked";
  if (completedModuleIds.includes(module.id)) return "completed";
  const done = module.lessonIds.filter((id) =>
    completedLessonIds.includes(id),
  ).length;
  if (done > 0) return "in_progress";
  return "not_started";
}

function getNextLesson(
  modules: Module[],
  lessons: Lesson[],
  completedLessonIds: string[],
): Lesson | undefined {
  for (const mod of modules) {
    if (mod.isLocked) continue;
    for (const lessonId of mod.lessonIds) {
      if (!completedLessonIds.includes(lessonId)) {
        return lessons.find((l) => l.id === lessonId);
      }
    }
  }
}

export function CourseProgressPanel({
  course,
  modules,
  lessons,
  progress,
  compact = false,
}: CourseProgressPanelProps) {
  const totalLessons = modules.reduce((sum, m) => sum + m.lessonIds.length, 0);
  const doneLessons = progress.completedLessonIds.length;
  const remaining = totalLessons - doneLessons;
  const remainingMinutes = lessons
    .filter((l) => !progress.completedLessonIds.includes(l.id))
    .reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0);
  const nextLesson = getNextLesson(
    modules,
    lessons,
    progress.completedLessonIds,
  );

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">
            {doneLessons} of {totalLessons} lessons
          </span>
          <span className="font-semibold text-text-primary">
            {progress.percentComplete}%
          </span>
        </div>
        <Progress value={progress.percentComplete} />
        <p className="text-xs text-text-muted">
          {remaining > 0
            ? `${remaining} remaining · ~${formatMinutes(remainingMinutes)} left`
            : "Course complete 🎉"}
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-sm leading-snug">{course.title}</CardTitle>
          <span className="shrink-0 text-xl font-bold text-primary">
            {progress.percentComplete}%
          </span>
        </div>
        <div className="mt-2 flex flex-col gap-1.5">
          <Progress
            value={progress.percentComplete}
            barClassName="bg-primary"
          />
          <p className="text-xs text-text-muted">
            {doneLessons} of {totalLessons} lessons done
            {remaining > 0 &&
              ` · ${remaining} remaining · ~${formatMinutes(remainingMinutes)} left`}
            {remaining === 0 && " · 🎉 Complete!"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        {/* Module breakdown */}
        <ul className="divide-y divide-border">
          {modules.map((mod) => {
            const status = getModuleStatus(
              mod,
              progress.completedModuleIds,
              progress.completedLessonIds,
            );
            const modDone = mod.lessonIds.filter((id) =>
              progress.completedLessonIds.includes(id),
            ).length;

            return (
              <li key={mod.id} className="flex items-center gap-3 px-5 py-3">
                <ModuleStatusIcon status={status} />
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      status === "locked"
                        ? "text-text-muted"
                        : "text-text-primary",
                    )}
                  >
                    {mod.title}
                  </p>
                  <p className="text-xs text-text-muted">
                    {status === "locked"
                      ? "Locked"
                      : `${modDone}/${mod.lessonIds.length} lessons`}
                  </p>
                </div>
                {status === "in_progress" && (
                  <div className="w-16 shrink-0">
                    <Progress
                      value={Math.round((modDone / mod.lessonIds.length) * 100)}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Continue button */}
        {nextLesson && (
          <div className="border-t border-border p-4">
            <Link
              href={`/courses/${course.id}/learn/${nextLesson.id}`}
              className="flex items-center justify-between rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              <span className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4" />
                Continue: {nextLesson.title}
              </span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ModuleStatusIcon({
  status,
}: {
  status: ReturnType<typeof getModuleStatus>;
}) {
  if (status === "completed")
    return <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />;
  if (status === "in_progress")
    return <PlayCircle className="h-4 w-4 shrink-0 text-primary" />;
  if (status === "locked")
    return <Lock className="h-4 w-4 shrink-0 text-text-muted" />;
  return <Circle className="h-4 w-4 shrink-0 text-text-muted" />;
}
