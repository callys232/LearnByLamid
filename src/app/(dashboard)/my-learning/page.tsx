import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { Header } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Progress,
  BreadcrumbNav,
  ProgressRing,
  SectionHeader,
  EmptyState,
} from "@/components/ui";
import { mockCourses } from "@/mock/courses";
import { mockLearnerProfiles, currentUser } from "@/mock/users";
import { mockLearnerProgress } from "@/mock/analytics";
import { formatMinutes } from "@/lib/utils";

export default function MyLearningPage() {
  const profile = mockLearnerProfiles.find((p) => p.id === currentUser.id);

  const enrolledCourses = (profile?.enrolledCourseIds ?? [])
    .map((id) => mockCourses.find((c) => c.id === id))
    .filter(Boolean) as typeof mockCourses;

  const completedCourses = (profile?.completedCourseIds ?? [])
    .map((id) => mockCourses.find((c) => c.id === id))
    .filter(Boolean) as typeof mockCourses;

  const inProgress = enrolledCourses.filter(
    (c) => !profile?.completedCourseIds.includes(c.id),
  );

  const totalWatchTime = mockLearnerProgress
    .filter((p) => p.userId === currentUser.id)
    .reduce((s, p) => s + p.timeSpentMinutes, 0);

  const statsCards = [
    { label: "Enrolled", value: enrolledCourses.length, icon: BookOpen },
    { label: "Completed", value: completedCourses.length, icon: CheckCircle2 },
    { label: "Watch Time", value: formatMinutes(totalWatchTime), icon: Clock },
  ];

  return (
    <div>
      <Header
        title="My Learning"
        subtitle={`${currentUser.name} · learning dashboard`}
        user={currentUser}
      />

      <div className="px-6 py-6 space-y-8">
        <BreadcrumbNav crumbs={[{ label: "My Learning" }]} />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {statsCards.map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-muted">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-text-primary tabular-nums">
                    {value}
                  </p>
                  <p className="text-xs text-text-muted">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* In Progress */}
        <section>
          <SectionHeader title="In Progress" />
          {inProgress.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Nothing in progress"
              description="Browse the course catalog to find something to learn."
              action={
                <Link
                  href="/courses"
                  className="text-sm text-primary hover:underline"
                >
                  Browse courses →
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inProgress.map((course) => {
                const progress = mockLearnerProgress.find(
                  (p) =>
                    p.courseId === course.id && p.userId === currentUser.id,
                );
                const pct = progress?.percentComplete ?? 0;
                return (
                  <Card
                    key={course.id}
                    className="group hover:-translate-y-0.5 transition-all duration-150"
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                            {course.title}
                          </p>
                          <p className="text-xs text-text-muted capitalize mt-0.5">
                            {course.difficulty} · {course.estimatedHours}h
                          </p>
                        </div>
                        <ProgressRing
                          value={pct}
                          size={40}
                          strokeWidth={4}
                          showLabel={false}
                          className="shrink-0"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-text-muted">
                          <span>{pct}% complete</span>
                          <span>
                            {formatMinutes(progress?.timeSpentMinutes ?? 0)}{" "}
                            watched
                          </span>
                        </div>
                        <Progress value={pct} size="xs" />
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/courses/${course.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary-hover transition-all"
                        >
                          <PlayCircle className="h-3.5 w-3.5" /> Continue
                        </Link>
                        <Link
                          href={`/courses/${course.id}/progress`}
                          className="rounded-lg border border-border px-3 py-2 text-xs text-text-secondary hover:bg-surface hover:text-text-primary transition-all"
                        >
                          Progress
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Completed */}
        {completedCourses.length > 0 && (
          <section>
            <SectionHeader title="Completed" href="/certificates" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedCourses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary line-clamp-1">
                        {course.title}
                      </p>
                      <p className="text-xs text-text-muted capitalize">
                        {course.difficulty}
                      </p>
                    </div>
                    <Badge variant="success">Done</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
