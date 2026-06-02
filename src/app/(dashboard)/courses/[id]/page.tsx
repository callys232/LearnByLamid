import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Clock,
  Users,
  Star,
  BookOpen,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/layout";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SectionHeader,
  BreadcrumbNav,
  Progress,
} from "@/components/ui";
import { CourseProgressPanel, EnrollButton } from "@/components/courses";
import { EventCard } from "@/components/events";
import { mockCourses, mockPrograms } from "@/mock/courses";
import { mockModules, mockLessons } from "@/mock/modules";
import { mockLearnerProgress } from "@/mock/analytics";
import { mockEvents } from "@/mock/events";
import { mockUsers, currentUser } from "@/mock/users";
import {
  cn,
  formatMinutes,
  getDifficultyColor,
  formatNumber,
} from "@/lib/utils";

// ─── Mock reviews (per-course) ────────────────────────────────────────────────

interface Review {
  id: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  body: string;
}

const MOCK_REVIEWS: Record<string, Review[]> = {
  "course-001": [
    {
      id: "r1",
      author: "Amara Osei",
      initials: "AO",
      rating: 5,
      date: "2026-04-12",
      body: "Incredibly well-structured. The empathy mapping module changed how I approach every problem. Highly recommended for any designer.",
    },
    {
      id: "r2",
      author: "Aisha Bello",
      initials: "AB",
      rating: 5,
      date: "2026-03-28",
      body: "Best intro to HCD I've found. Kwame explains complex concepts with real clarity. Completed it in a weekend and started applying it Monday.",
    },
    {
      id: "r3",
      author: "Emeka Nwosu",
      initials: "EN",
      rating: 4,
      date: "2026-02-15",
      body: "Solid foundation course. I wish the prototyping section went a bit deeper, but overall it's excellent for beginners.",
    },
  ],
  "course-002": [
    {
      id: "r4",
      author: "Fatima Diallo",
      initials: "FD",
      rating: 5,
      date: "2026-04-20",
      body: "The interview techniques module alone is worth the price. I ran three user research sessions the week after finishing this.",
    },
    {
      id: "r5",
      author: "Amara Osei",
      initials: "AO",
      rating: 4,
      date: "2026-03-05",
      body: "Great practical content. The synthesis frameworks section was particularly eye-opening. Minor note: a few exercises could use updated examples.",
    },
  ],
  "course-003": [
    {
      id: "r6",
      author: "Kwame Mensah",
      initials: "KM",
      rating: 5,
      date: "2026-04-01",
      body: "The Figma deep-dive in module 2 is incredibly thorough. Went from lo-fi sketches to polished prototypes by the end.",
    },
    {
      id: "r7",
      author: "Aisha Bello",
      initials: "AB",
      rating: 5,
      date: "2026-03-18",
      body: "Loved the validation experiment framework. Applied it to a side project immediately and got real user feedback within days.",
    },
  ],
  "course-004": [
    {
      id: "r8",
      author: "Emeka Nwosu",
      initials: "EN",
      rating: 5,
      date: "2026-04-25",
      body: "The App Router + TypeScript section is the best resource I've found on the topic. Crystal-clear explanations and practical examples throughout.",
    },
    {
      id: "r9",
      author: "Amara Osei",
      initials: "AO",
      rating: 5,
      date: "2026-04-10",
      body: "I've taken four React courses and this is head and shoulders above the rest. The custom hooks section in particular is superb.",
    },
    {
      id: "r10",
      author: "Aisha Bello",
      initials: "AB",
      rating: 4,
      date: "2026-03-22",
      body: "Really comprehensive. The pace picks up steeply in module 3 — beginners should be aware, but experienced devs will love it.",
    },
  ],
  "course-005": [
    {
      id: "r11",
      author: "Fatima Diallo",
      initials: "FD",
      rating: 5,
      date: "2026-05-01",
      body: "Incredibly practical. I used the BMC framework to restructure my startup's entire go-to-market approach within a week of finishing.",
    },
    {
      id: "r12",
      author: "Emeka Nwosu",
      initials: "EN",
      rating: 4,
      date: "2026-04-14",
      body: "Very well explained for a free course. Would love a deeper dive into unit economics, but the foundations are rock solid.",
    },
  ],
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "h-3.5 w-3.5",
            s <= rating ? "fill-yellow-400 text-yellow-400" : "text-border",
          )}
        />
      ))}
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const course = mockCourses.find((c) => c.id === id);
  if (!course) notFound();

  const modules = mockModules.filter((m) => m.courseId === id);
  const lessons = mockLessons.filter((l) =>
    modules.some((m) => m.id === l.moduleId),
  );
  const progress = mockLearnerProgress.find(
    (p) => p.userId === currentUser.id && p.courseId === id,
  );
  const instructor = mockUsers.find((u) => u.id === course.instructorId);
  const courseEvents = mockEvents.filter((e) => e.courseId === id);
  const reviews = MOCK_REVIEWS[id] ?? [];

  const totalLessons = modules.reduce((s, m) => s + m.lessonIds.length, 0);
  const totalMinutes = lessons.reduce(
    (s, l) => s + (l.durationMinutes ?? 0),
    0,
  );

  // ── Next course in program ──────────────────────────────────────────────────
  const program = mockPrograms.find((p) => p.courseIds.includes(id));
  const currentIdx = program?.courseIds.indexOf(id) ?? -1;
  const nextCourseId =
    program && currentIdx >= 0 && currentIdx < program.courseIds.length - 1
      ? program.courseIds[currentIdx + 1]
      : null;
  const nextCourse = nextCourseId
    ? mockCourses.find((c) => c.id === nextCourseId)
    : null;

  // ── Rating breakdown ────────────────────────────────────────────────────────
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const categoryLabel: Record<string, string> = {
    "cat-hcd": "HCD",
    "cat-biz": "BIZ",
    "cat-sd": "SD",
  };
  const categoryVariant: Record<string, "hcd" | "biz" | "sd"> = {
    "cat-hcd": "hcd",
    "cat-biz": "biz",
    "cat-sd": "sd",
  };

  return (
    <div>
      <Header title={course.title} user={currentUser} />

      <div className="px-6 py-6">
        <BreadcrumbNav
          crumbs={[
            { label: "Courses", href: "/courses" },
            { label: course.title },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_340px] mt-4">
          {/* ── Left column ── */}
          <div className="flex flex-col gap-8">
            {/* Course header */}
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge
                  variant={categoryVariant[course.categoryId] ?? "default"}
                >
                  {categoryLabel[course.categoryId] ?? course.categoryId}
                </Badge>
                <Badge
                  variant={course.accessType === "free" ? "success" : "default"}
                >
                  {course.accessType === "free" ? "Free" : `$${course.price}`}
                </Badge>
                <span
                  className={cn(
                    "text-xs font-medium capitalize",
                    getDifficultyColor(course.difficulty),
                  )}
                >
                  {course.difficulty}
                </span>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-text-primary">
                {course.title}
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed">
                {course.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatMinutes(totalMinutes)}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {totalLessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {course.enrollmentCount.toLocaleString()} enrolled
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  {course.rating}
                  {course.ratingCount && (
                    <span className="text-text-muted">
                      ({formatNumber(course.ratingCount)})
                    </span>
                  )}
                </span>
              </div>

              {instructor && (
                <p className="mt-3 text-xs text-text-muted">
                  Taught by{" "}
                  <span className="font-medium text-text-primary">
                    {instructor.name}
                  </span>
                  {instructor.headline && (
                    <span className="text-text-muted">
                      {" "}
                      · {instructor.headline}
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Modules */}
            <section>
              <SectionHeader
                title="Course Modules"
                description={`${modules.length} modules · ${totalLessons} lessons total`}
              />
              <div className="flex flex-col gap-2">
                {modules.map((mod) => {
                  const modLessons = mockLessons.filter(
                    (l) => l.moduleId === mod.id,
                  );
                  const isDone = progress?.completedModuleIds.includes(mod.id);
                  return (
                    <Card
                      key={mod.id}
                      className={cn(mod.isLocked && "opacity-60")}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-text-primary">
                              {mod.title}
                            </p>
                            {mod.description && (
                              <p className="mt-0.5 text-xs text-text-secondary">
                                {mod.description}
                              </p>
                            )}
                            <p className="mt-2 text-xs text-text-muted">
                              {modLessons.length} lessons ·{" "}
                              {formatMinutes(
                                modLessons.reduce(
                                  (s, l) => s + (l.durationMinutes ?? 0),
                                  0,
                                ),
                              )}
                            </p>
                          </div>
                          {isDone && <Badge variant="success">Complete</Badge>}
                          {mod.isLocked && (
                            <Badge variant="default">🔒 Locked</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Linked lectures */}
            {courseEvents.length > 0 && (
              <section>
                <SectionHeader
                  title="Lectures for this Course"
                  description="Attending or watching a replay counts toward your progress"
                />
                <div className="flex flex-col gap-3">
                  {courseEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      userId={currentUser.id}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <section>
                <SectionHeader
                  title="Learner Reviews"
                  description={`${reviews.length} review${reviews.length !== 1 ? "s" : ""}`}
                />
                <div className="mb-5 flex items-start gap-6">
                  {/* Big rating number */}
                  <div className="text-center shrink-0">
                    <p className="text-5xl font-bold text-text-primary">
                      {course.rating}
                    </p>
                    <StarRow rating={Math.round(course.rating)} />
                    <p className="mt-1 text-xs text-text-muted">
                      {course.ratingCount
                        ? formatNumber(course.ratingCount)
                        : reviews.length}{" "}
                      ratings
                    </p>
                  </div>
                  {/* Breakdown bars */}
                  <div className="flex-1 space-y-1.5">
                    {ratingBreakdown.map(({ star, count }) => (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span className="w-4 text-right text-text-muted">
                          {star}
                        </span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
                        <div className="flex-1 h-1.5 rounded-full bg-surface-active overflow-hidden">
                          <div
                            className="h-full rounded-full bg-yellow-400 transition-all duration-700"
                            style={{
                              width: reviews.length
                                ? `${(count / reviews.length) * 100}%`
                                : "0%",
                            }}
                          />
                        </div>
                        <span className="w-4 tabular-nums text-text-muted">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-muted text-xs font-bold text-primary">
                            {review.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-text-primary">
                                {review.author}
                              </p>
                              <StarRow rating={review.rating} />
                              <span className="ml-auto text-[10px] text-text-muted shrink-0">
                                {new Date(review.date).toLocaleDateString(
                                  "en-US",
                                  { month: "short", year: "numeric" },
                                )}
                              </span>
                            </div>
                            <p className="text-xs text-text-secondary leading-relaxed">
                              {review.body}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-4">
            {progress ? (
              <CourseProgressPanel
                course={course}
                modules={modules}
                lessons={lessons}
                progress={progress}
              />
            ) : (
              <Card>
                <CardContent className="p-5">
                  <p className="mb-2 text-sm font-semibold text-text-primary">
                    Ready to start?
                  </p>
                  <p className="mb-4 text-xs text-text-secondary">
                    Enroll to track your progress, earn a certificate, and
                    access all modules.
                  </p>
                  <EnrollButton
                    course={course}
                    isEnrolled={false}
                    firstLessonId={lessons[0]?.id}
                  />
                </CardContent>
              </Card>
            )}

            {/* Upcoming lecture */}
            {courseEvents.filter(
              (e) => e.status === "upcoming" || e.status === "live",
            ).length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <Calendar className="h-4 w-4 text-primary" /> Next Lecture
                  </p>
                  {courseEvents
                    .filter(
                      (e) => e.status === "upcoming" || e.status === "live",
                    )
                    .slice(0, 1)
                    .map((event) => (
                      <div key={event.id}>
                        <p className="text-xs font-medium text-text-primary">
                          {event.title}
                        </p>
                        <p className="mt-0.5 text-xs text-text-muted">
                          {new Date(event.scheduledAt).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                          {" · "}
                          {formatMinutes(event.durationMinutes)}
                        </p>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}

            {/* Next in program */}
            {nextCourse && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    Next in {program?.title}
                  </p>
                  <p className="text-sm font-semibold text-text-primary mb-3 leading-snug">
                    {nextCourse.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                    <span
                      className={cn(
                        "capitalize font-medium",
                        getDifficultyColor(nextCourse.difficulty),
                      )}
                    >
                      {nextCourse.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {nextCourse.estimatedHours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {nextCourse.rating}
                    </span>
                  </div>
                  <Link
                    href={`/courses/${nextCourse.id}`}
                    className="flex items-center justify-between rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-all"
                  >
                    Go to next course <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
