import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/layout";
import { Badge, Card, CardContent, SectionHeader } from "@/components/ui";
import { CourseCard } from "@/components/dashboard";
import { mockPrograms, mockCourses } from "@/mock/courses";
import { mockLearnerProgress } from "@/mock/analytics";
import { mockLearnerProfiles, currentUser } from "@/mock/users";
import { mockServiceCategories } from "@/mock/tenants";
import { formatMinutes } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { id } = await params;
  const program = mockPrograms.find((p) => p.id === id);
  if (!program) notFound();

  const courses = mockCourses.filter((c) => program.courseIds.includes(c.id));
  const category = mockServiceCategories.find(
    (c) => c.id === program.categoryId,
  );
  const profile = mockLearnerProfiles.find((p) => p.id === currentUser.id);

  const totalHours = courses.reduce((s, c) => s + c.estimatedHours, 0);
  const totalLessons = courses.reduce((s, c) => {
    const enrollProgress = mockLearnerProgress.find(
      (p) => p.userId === currentUser.id && p.courseId === c.id,
    );
    return s + (enrollProgress?.completedLessonIds.length ?? 0);
  }, 0);

  const catVariant: Record<string, "hcd" | "biz" | "sd"> = {
    "cat-hcd": "hcd",
    "cat-biz": "biz",
    "cat-sd": "sd",
  };

  function getProgress(courseId: string) {
    return mockLearnerProgress.find(
      (p) => p.userId === currentUser.id && p.courseId === courseId,
    )?.percentComplete;
  }

  const isEnrolled = courses.some((c) =>
    profile?.enrolledCourseIds.includes(c.id),
  );

  return (
    <div>
      <Header title={program.title} user={currentUser} />

      <div className="px-6 py-6">
        <Link
          href="/programs"
          className="mb-6 flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Programs
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Left */}
          <div className="space-y-8">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {category && (
                  <Badge variant={catVariant[program.categoryId] ?? "default"}>
                    {category.code}
                  </Badge>
                )}
                <Badge
                  variant={
                    program.accessType === "free" ? "success" : "primary"
                  }
                >
                  {program.accessType === "free" ? "Free" : `$${program.price}`}
                </Badge>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-text-primary">
                {program.title}
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed">
                {program.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {courses.length} courses
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatMinutes(totalHours * 60)} total
                </span>
              </div>
            </div>

            {/* Course sequence */}
            <section>
              <SectionHeader
                title="Program Courses"
                description="Complete in order to earn the Professional certificate"
              />
              <div className="flex flex-col gap-3">
                {courses.map((course, i) => {
                  const prog = getProgress(course.id);
                  const done = prog === 100;
                  return (
                    <div key={course.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0 ${done ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-surface-active text-text-muted border border-border"}`}
                        >
                          {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                        </div>
                        {i < courses.length - 1 && (
                          <div className="w-px h-full min-h-[24px] bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <CourseCard course={course} progress={prog} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right — enroll CTA */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-2xl font-bold text-text-primary">
                    {program.accessType === "free"
                      ? "Free"
                      : `$${program.price}`}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Full program access
                  </p>
                </div>
                {isEnrolled ? (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-center text-sm font-medium text-emerald-400">
                    ✓ Enrolled — {totalLessons} lessons completed
                  </div>
                ) : (
                  <button className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-primary-sm hover:bg-primary-hover hover:shadow-primary hover:-translate-y-px transition-all active:scale-[0.97]">
                    Enroll in Program
                  </button>
                )}
                <ul className="space-y-2 text-xs text-text-secondary">
                  {[
                    "Full access to all {n} courses".replace(
                      "{n}",
                      String(courses.length),
                    ),
                    `${formatMinutes(totalHours * 60)} of content`,
                    "Professional certificate on completion",
                    "Lifetime access",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
