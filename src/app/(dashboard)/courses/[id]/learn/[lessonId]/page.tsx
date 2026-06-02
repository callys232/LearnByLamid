import { notFound } from "next/navigation";
import { LessonPlayer, LessonSidebar } from "@/components/lesson";
import { mockCourses } from "@/mock/courses";
import { mockModules, mockLessons, mockQuizzes } from "@/mock/modules";
import { mockLearnerProgress } from "@/mock/analytics";
import { mockEvents } from "@/mock/events";
import { currentUser } from "@/mock/users";

interface PageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

export default async function LearnPage({ params }: PageProps) {
  const { id: courseId, lessonId } = await params;

  const course  = mockCourses.find((c) => c.id === courseId);
  const lesson  = mockLessons.find((l) => l.id === lessonId);
  if (!course || !lesson) notFound();

  const modules  = mockModules.filter((m) => m.courseId === courseId);
  const lessons  = mockLessons.filter((l) => modules.some((m) => m.id === l.moduleId));
  const quizzes  = mockQuizzes.filter((q) => lesson.quizIds.includes(q.id));
  const progress = mockLearnerProgress.find(
    (p) => p.userId === currentUser.id && p.courseId === courseId
  );

  // For live lessons, find the linked event
  const linkedEvent = lesson.type === "live"
    ? mockEvents.find((e) => e.linkedLessonId === lesson.id)
    : undefined;

  // Ordered flat lesson list for prev/next
  const ordered = modules
    .sort((a, b) => a.order - b.order)
    .flatMap((m) =>
      lessons.filter((l) => l.moduleId === m.id).sort((a, b) => a.order - b.order)
    );

  const idx          = ordered.findIndex((l) => l.id === lessonId);
  const prevLessonId = idx > 0 ? ordered[idx - 1].id : null;
  const nextLessonId = idx < ordered.length - 1 ? ordered[idx + 1].id : null;

  return (
    <LessonPlayer
      lesson={lesson}
      prevLessonId={prevLessonId}
      nextLessonId={nextLessonId}
      course={course}
      courseTitle={course.title}
      quizzes={quizzes}
      progress={progress}
      totalLessons={ordered.length}
      linkedEvent={linkedEvent}
      sidebarSlot={
        <LessonSidebar
          courseId={courseId}
          modules={modules}
          lessons={lessons}
          currentLessonId={lessonId}
          progress={progress}
        />
      }
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { lessonId } = await params;
  const lesson = mockLessons.find((l) => l.id === lessonId);
  return { title: lesson?.title ?? "Lesson" };
}
