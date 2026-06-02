import { redirect, notFound } from "next/navigation";
import { mockCourses } from "@/mock/courses";
import { mockModules, mockLessons } from "@/mock/modules";
import { mockLearnerProgress } from "@/mock/analytics";
import { currentUser } from "@/mock/users";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LearnRedirectPage({ params }: Props) {
  const { id } = await params;
  const course = mockCourses.find((c) => c.id === id);
  if (!course) notFound();

  const modules = mockModules
    .filter((m) => m.courseId === id)
    .sort((a, b) => a.order - b.order);

  const ordered = modules.flatMap((m) =>
    mockLessons
      .filter((l) => l.moduleId === m.id)
      .sort((a, b) => a.order - b.order),
  );

  if (ordered.length === 0) notFound();

  const progress = mockLearnerProgress.find(
    (p) => p.userId === currentUser.id && p.courseId === id,
  );
  const completed = new Set(progress?.completedLessonIds ?? []);

  // Resume at first incomplete lesson, or restart from the beginning
  const target = ordered.find((l) => !completed.has(l.id)) ?? ordered[0];

  redirect(`/courses/${id}/learn/${target.id}`);
}
