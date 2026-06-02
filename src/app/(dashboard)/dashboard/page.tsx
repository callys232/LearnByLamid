import { BookOpen, Award, Clock, TrendingUp } from "lucide-react";
import { Header } from "@/components/layout";
import { StatsCard, CourseCard, ActivityFeed } from "@/components/dashboard";
import { SectionHeader, Card, CardContent, Badge } from "@/components/ui";
import { CourseProgressPanel } from "@/components/courses";
import { EventCard } from "@/components/events";
import { CourseRecommendations } from "@/components/ai";
import { mockCourses } from "@/mock/courses";
import { mockModules, mockLessons } from "@/mock/modules";
import { mockLearnerProgress } from "@/mock/analytics";
import { mockLearnerProfiles, currentUser } from "@/mock/users";
import { mockActivity } from "@/mock/activity";
import { mockEvents } from "@/mock/events";

export default function DashboardPage() {
  const status = currentUser.verificationStatus ?? "approved";

  if (status !== "approved") {
    return (
      <div>
        <Header
          title={
            status === "pending"
              ? "Approval Pending"
              : "Account Review Required"
          }
          subtitle={
            status === "pending"
              ? "Your learner account is awaiting admin verification."
              : "Your account needs review before learning access is granted."
          }
          user={currentUser}
        />

        <div className="px-6 py-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-sm text-text-secondary">
                    Thanks for signing up, {currentUser.name.split(" ")[0]}.
                    Your account is currently under review by our team.
                  </p>
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          Verification status
                        </p>
                        <p className="text-xs text-text-muted">
                          {status === "pending"
                            ? "We will notify you as soon as your account is approved."
                            : "Please contact support for more details."}
                        </p>
                      </div>
                      <Badge
                        variant={status === "pending" ? "warning" : "danger"}
                      >
                        {status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Card className="border border-border bg-background">
                      <CardContent>
                        <p className="text-sm font-medium text-text-primary">
                          What happens next?
                        </p>
                        <ul className="mt-3 space-y-2 text-sm text-text-secondary list-disc list-inside">
                          <li>
                            Admin will review your profile within 24 hours.
                          </li>
                          <li>
                            You can sign in again once your account is approved.
                          </li>
                          <li>Need help? Contact support@lamid.co.</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="border border-border bg-background">
                      <CardContent>
                        <p className="text-sm font-medium text-text-primary">
                          Profile details
                        </p>
                        <div className="mt-3 space-y-2 text-sm text-text-secondary">
                          <p>Name: {currentUser.name}</p>
                          <p>Email: {currentUser.email}</p>
                          <p>Role: {currentUser.role}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const profile = mockLearnerProfiles.find((p) => p.id === currentUser.id);
  const enrolledCourses = mockCourses.filter((c) =>
    profile?.enrolledCourseIds.includes(c.id),
  );

  const liveOrUpcomingEvents = mockEvents
    .filter(
      (e) =>
        (e.status === "live" || e.status === "upcoming") &&
        e.registeredUserIds.includes(currentUser.id),
    )
    .slice(0, 2);

  function getProgress(courseId: string) {
    return mockLearnerProgress.find(
      (p) => p.userId === currentUser.id && p.courseId === courseId,
    );
  }

  function getProgressPct(courseId: string) {
    return getProgress(courseId)?.percentComplete;
  }

  const inProgressCourses = enrolledCourses
    .filter((c) => {
      const p = getProgress(c.id);
      return p && p.percentComplete > 0 && !p.completedAt;
    })
    .slice(0, 1); // show most recent in-progress course

  return (
    <div>
      <Header
        title={`Welcome back, ${currentUser.name.split(" ")[0]} 👋`}
        subtitle="Pick up where you left off"
        user={currentUser}
      />

      <div className="px-6 py-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard
            label="Courses Enrolled"
            value={profile?.enrolledCourseIds.length ?? 0}
            sub={`${profile?.completedCourseIds.length ?? 0} completed`}
            icon={BookOpen}
            accent
          />
          <StatsCard
            label="Certificates Earned"
            value={profile?.earnedCertificateIds.length ?? 0}
            icon={Award}
            trend={{ value: "+1", positive: true }}
          />
          <StatsCard
            label="Hours Learned"
            value="3h 9m"
            sub="this month"
            icon={Clock}
          />
          <StatsCard
            label="XP Points"
            value={currentUser.xp.toLocaleString()}
            sub={`Streak · ${currentUser.streak} days`}
            icon={TrendingUp}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-8">
            {/* Continue learning */}
            <section>
              <SectionHeader title="Continue Learning" href="/courses" />
              <div className="grid gap-4 sm:grid-cols-2">
                {enrolledCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={getProgressPct(course.id)}
                  />
                ))}
              </div>
            </section>

            {/* Upcoming lectures */}
            {liveOrUpcomingEvents.length > 0 && (
              <section>
                <SectionHeader
                  title="Your Upcoming Lectures"
                  href="/events"
                  description="Attending counts toward your course progress"
                />
                <div className="flex flex-col gap-3">
                  {liveOrUpcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      course={mockCourses.find((c) => c.id === event.courseId)}
                      userId={currentUser.id}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">
            {/* Detailed progress for most active course */}
            {inProgressCourses.map((course) => {
              const progress = getProgress(course.id);
              if (!progress) return null;
              const courseModules = mockModules.filter(
                (m) => m.courseId === course.id,
              );
              const courseLessons = mockLessons.filter((l) =>
                courseModules.some((m) => m.id === l.moduleId),
              );
              return (
                <CourseProgressPanel
                  key={course.id}
                  course={course}
                  modules={courseModules}
                  lessons={courseLessons}
                  progress={progress}
                />
              );
            })}

            {/* Activity feed */}
            <ActivityFeed items={mockActivity} />

            {/* AI course recommendations */}
            <CourseRecommendations
              enrolledCourseIds={profile?.enrolledCourseIds ?? []}
              completedCourseIds={profile?.completedCourseIds ?? []}
              quizAvgScore={
                mockLearnerProgress
                  .filter((p) => p.userId === currentUser.id)
                  .flatMap((p) => p.quizAttempts).length > 0
                  ? Math.round(
                      (mockLearnerProgress
                        .filter((p) => p.userId === currentUser.id)
                        .flatMap((p) => p.quizAttempts)
                        .filter((a) => a.isCorrect).length /
                        mockLearnerProgress
                          .filter((p) => p.userId === currentUser.id)
                          .flatMap((p) => p.quizAttempts).length) *
                        100,
                    )
                  : undefined
              }
              categoryFocus="HCD"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
