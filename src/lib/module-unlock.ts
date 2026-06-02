import type { Module, LearnerProgress, QuizAttempt } from "@/types/types";
import { mockQuizzes, mockLessons } from "@/mock/modules";

/**
 * A module is unlocked when ALL of these are true:
 * 1. It is not drip-locked (isLocked = false OR releasedAt has passed)
 * 2. If it has a previous module: the previous module is fully completed
 *    AND all checkpoint quizzes in the previous module are PASSED
 */
export function isModuleUnlocked(
  module: Module,
  allModules: Module[],
  progress: LearnerProgress | undefined,
): boolean {
  // Sort by display order
  const sorted = [...allModules].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((m) => m.id === module.id);

  // First module is always available
  if (idx <= 0) return true;

  // Drip lock: `releasedAt` in the future
  if (module.isLocked) {
    if (!module.releasedAt) return false;
    return new Date(module.releasedAt) <= new Date();
  }

  // Sequential lock: previous module must be completed
  const prev = sorted[idx - 1];
  if (!progress?.completedModuleIds.includes(prev.id)) return false;

  // Checkpoint quiz gate: all checkpoint quizzes in the PREVIOUS module must be passed
  const prevLessons = mockLessons.filter((l) => l.moduleId === prev.id);
  const checkpoints = prevLessons.flatMap((l) =>
    mockQuizzes.filter(
      (q) => l.quizIds.includes(q.id) && q.type === "checkpoint",
    ),
  );

  if (checkpoints.length === 0) return true; // no checkpoints — just needs completion

  return checkpoints.every((quiz) => {
    const attempt = progress?.quizAttempts.find(
      (a: QuizAttempt) => a.quizId === quiz.id,
    );
    return attempt?.isCorrect === true;
  });
}

export function getModuleStatus(
  module: Module,
  allModules: Module[],
  progress: LearnerProgress | undefined,
): "completed" | "in_progress" | "locked" | "not_started" {
  if (!isModuleUnlocked(module, allModules, progress)) return "locked";
  if (progress?.completedModuleIds.includes(module.id)) return "completed";
  const done = module.lessonIds.filter((id) =>
    progress?.completedLessonIds.includes(id),
  ).length;
  return done > 0 ? "in_progress" : "not_started";
}
