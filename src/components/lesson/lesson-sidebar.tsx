import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Lock,
  PlayCircle,
  Video,
  FileText,
  Presentation,
  Radio,
  Download,
  Clock,
} from "lucide-react";
import { cn, formatMinutes } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { isModuleUnlocked } from "@/lib/module-unlock";
import { Module, Lesson, LearnerProgress } from "@/types/types";

interface LessonSidebarProps {
  courseId: string;
  modules: Module[];
  lessons: Lesson[];
  currentLessonId: string;
  progress: LearnerProgress | undefined;
}

const lessonTypeIcon: Record<string, React.ElementType> = {
  video: Video,
  text: FileText,
  slides: Presentation,
  live: Radio,
  download: Download,
};

export function LessonSidebar({
  courseId,
  modules,
  lessons,
  currentLessonId,
  progress,
}: LessonSidebarProps) {
  const completedIds = progress?.completedLessonIds ?? [];
  const totalLessons = modules.reduce((s, m) => s + m.lessonIds.length, 0);
  const pct = progress?.percentComplete ?? 0;
  const sorted = [...modules].sort((a, b) => a.order - b.order);

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-l border-border bg-background-secondary overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Course Content
        </p>
        <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
          <span>
            {completedIds.length} / {totalLessons} lessons
          </span>
          <span className="font-semibold text-text-primary">{pct}%</span>
        </div>
        <Progress value={pct} size="xs" />
      </div>

      {/* Module list */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {sorted.map((mod) => {
          const unlocked = isModuleUnlocked(mod, sorted, progress);
          const modLessons = lessons.filter((l) => l.moduleId === mod.id);
          const modDone = modLessons.filter((l) =>
            completedIds.includes(l.id),
          ).length;
          const isModDone =
            modDone === modLessons.length && modLessons.length > 0;

          return (
            <div key={mod.id}>
              {/* Module header */}
              <div
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 bg-background-tertiary border-b border-border",
                  !unlocked && "opacity-60",
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {!unlocked ? (
                    <Lock className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                  ) : isModDone ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                  )}
                  <p className="truncate text-xs font-semibold text-text-primary">
                    {mod.title}
                  </p>
                </div>
                <span className="ml-2 shrink-0 text-[10px] text-text-muted">
                  {modDone}/{modLessons.length}
                </span>
              </div>

              {/* Lessons */}
              {unlocked &&
                modLessons.map((lesson) => {
                  const isCurrent = lesson.id === currentLessonId;
                  const isDone = completedIds.includes(lesson.id);
                  const Icon = lessonTypeIcon[lesson.type] ?? Video;

                  return (
                    <Link
                      key={lesson.id}
                      href={`/courses/${courseId}/learn/${lesson.id}`}
                      className={cn(
                        "group flex items-center gap-3 px-4 py-2.5 border-b border-border/50 transition-all duration-150",
                        isCurrent
                          ? "bg-primary-muted border-l-2 border-l-primary"
                          : "hover:bg-surface",
                      )}
                    >
                      <div className="shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <PlayCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <Icon className="h-4 w-4 text-text-muted group-hover:text-text-secondary transition-colors" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                        <p
                          className={cn(
                            "truncate text-xs font-medium",
                            isCurrent
                              ? "text-primary"
                              : isDone
                                ? "text-text-secondary"
                                : "text-text-primary",
                          )}
                        >
                          {lesson.title}
                        </p>
                        {lesson.durationMinutes && (
                          <span className="flex items-center gap-1 text-[10px] text-text-muted">
                            <Clock className="h-2.5 w-2.5" />
                            {formatMinutes(lesson.durationMinutes)}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}

              {/* Locked state */}
              {!unlocked && (
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 opacity-60">
                  <Lock className="h-3.5 w-3.5 text-text-muted shrink-0" />
                  <p className="text-xs text-text-muted">
                    {mod.releasedAt && new Date(mod.releasedAt) > new Date()
                      ? `Releases ${new Date(mod.releasedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                      : "Complete previous module to unlock"}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
