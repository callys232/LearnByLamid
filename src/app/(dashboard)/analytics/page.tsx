import {
  Clock,
  BookOpen,
  Target,
  Flame,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SectionHeader,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Progress,
  Badge,
  BreadcrumbNav,
} from "@/components/ui";
import { StatsCard } from "@/components/dashboard";
import { SkillGapPanel } from "@/components/ai";
import { mockLearnerProgress, mockWeeklyActivity } from "@/mock/analytics";
import { mockCourses } from "@/mock/courses";
import { mockCertificates } from "@/mock/certifications";
import { mockLearnerProfiles, currentUser } from "@/mock/users";
import { formatMinutes } from "@/lib/utils";

export default function AnalyticsPage() {
  const myProgress = mockLearnerProgress.filter(
    (p) => p.userId === currentUser.id,
  );
  const myCerts = mockCertificates.filter((c) => c.userId === currentUser.id);

  const totalMinutes = myProgress.reduce((s, p) => s + p.timeSpentMinutes, 0);
  const completedCourses = myProgress.filter((p) => p.completedAt).length;
  const totalQuizAttempts = myProgress.flatMap((p) => p.quizAttempts);
  const correctAttempts = totalQuizAttempts.filter((a) => a.isCorrect).length;
  const avgScore =
    totalQuizAttempts.length > 0
      ? Math.round((correctAttempts / totalQuizAttempts.length) * 100)
      : 0;

  const maxWeeklyMinutes = Math.max(
    ...mockWeeklyActivity.map((d) => d.minutes),
    1,
  );

  return (
    <div>
      <Header
        title="Analytics"
        subtitle="Your learning performance and progress"
        user={currentUser}
      />

      <div className="px-6 py-6 space-y-8">
        <BreadcrumbNav crumbs={[{ label: "Analytics" }]} />
        {/* Top stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard
            label="Total Time Learned"
            value={formatMinutes(totalMinutes)}
            sub="all time"
            icon={Clock}
            accent
          />
          <StatsCard
            label="Courses Completed"
            value={completedCourses}
            icon={BookOpen}
          />
          <StatsCard
            label="Avg Quiz Score"
            value={`${avgScore}%`}
            sub={`${totalQuizAttempts.length} attempts`}
            icon={Target}
          />
          <StatsCard
            label="Current Streak"
            value={`${currentUser.streak}d`}
            sub={`${currentUser.xp.toLocaleString()} XP total`}
            icon={Flame}
          />
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">By Course</TabsTrigger>
            <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Weekly activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 h-32">
                    {mockWeeklyActivity.map(({ day, minutes }) => {
                      const heightPct =
                        minutes === 0
                          ? 4
                          : Math.max(
                              8,
                              Math.round((minutes / maxWeeklyMinutes) * 100),
                            );
                      return (
                        <div
                          key={day}
                          className="flex flex-1 flex-col items-center gap-1.5"
                        >
                          <span className="text-[10px] text-text-muted">
                            {minutes > 0 ? formatMinutes(minutes) : ""}
                          </span>
                          <div
                            className="w-full rounded-sm overflow-hidden bg-surface-active"
                            style={{ height: "80px" }}
                          >
                            <div
                              className="w-full rounded-sm bg-primary transition-all duration-500"
                              style={{
                                height: `${heightPct}%`,
                                marginTop: `${100 - heightPct}%`,
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-text-secondary">
                            {day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-text-muted text-center">
                    {formatMinutes(
                      mockWeeklyActivity.reduce((s, d) => s + d.minutes, 0),
                    )}{" "}
                    this week
                  </p>
                </CardContent>
              </Card>

              {/* Certificates summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Credentials Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  {myCerts.length === 0 ? (
                    <p className="text-sm text-text-muted">
                      Complete a course to earn your first certificate.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {myCerts.map((cert) => (
                        <li key={cert.id} className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-muted">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex flex-1 flex-col gap-0.5">
                            <p className="text-sm font-medium text-text-primary">
                              {cert.title}
                            </p>
                            <p className="text-xs text-text-muted">
                              {new Date(cert.issuedAt).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" },
                              )}
                            </p>
                          </div>
                          <Badge
                            variant={
                              cert.level === "professional"
                                ? "success"
                                : cert.level === "skill"
                                  ? "primary"
                                  : "default"
                            }
                          >
                            {cert.level}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* By Course */}
          <TabsContent value="courses">
            <div className="flex flex-col gap-4">
              {myProgress.map((p) => {
                const course = mockCourses.find((c) => c.id === p.courseId);
                if (!course) return null;
                const quizzes = p.quizAttempts;
                const score =
                  quizzes.length > 0
                    ? Math.round(
                        (quizzes.filter((a) => a.isCorrect).length /
                          quizzes.length) *
                          100,
                      )
                    : null;

                return (
                  <Card key={p.courseId}>
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-text-primary">
                            {course.title}
                          </p>
                          <p className="text-xs text-text-muted">
                            {formatMinutes(p.timeSpentMinutes)} spent · last
                            active{" "}
                            {new Date(p.lastAccessedAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </p>
                        </div>
                        <span className="shrink-0 text-lg font-bold text-primary">
                          {p.percentComplete}%
                        </span>
                      </div>

                      <Progress
                        value={p.percentComplete}
                        showLabel
                        className="mb-3"
                      />

                      <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {p.completedLessonIds.length} lessons done
                        </span>
                        {score !== null && (
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {score}% quiz avg
                          </span>
                        )}
                        {p.completedAt && (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <TrendingUp className="h-3 w-3" /> Completed
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Skill Analysis */}
          <TabsContent value="skills">
            <div className="max-w-lg">
              <SkillGapPanel
                progress={myProgress}
                quizAttempts={totalQuizAttempts}
                completedCourses={myProgress
                  .filter((p) => p.completedAt)
                  .map((p) => ({
                    id: p.courseId,
                    title:
                      mockCourses.find((c) => c.id === p.courseId)?.title ??
                      p.courseId,
                  }))}
                enrolledCourses={(
                  mockLearnerProfiles.find((pr) => pr.id === currentUser.id)
                    ?.enrolledCourseIds ?? []
                ).map((id) => ({
                  id,
                  title: mockCourses.find((c) => c.id === id)?.title ?? id,
                }))}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
