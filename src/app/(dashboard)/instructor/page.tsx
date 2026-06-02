import Link from "next/link";
import {
  BookOpen,
  Users,
  TrendingUp,
  Star,
  PenSquare,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SectionHeader,
  Badge,
  Progress,
} from "@/components/ui";
import { StatsCard } from "@/components/dashboard";
import { mockCourses } from "@/mock/courses";
import { mockCourseAnalytics } from "@/mock/analytics";
import { mockUsers, currentUser } from "@/mock/users";
import { formatNumber } from "@/lib/utils";

export default function InstructorPage() {
  const user = currentUser;
  const hasInstructorAccess = ["instructor", "admin", "super_admin"].includes(
    user.role,
  );
  const myCourses = hasInstructorAccess
    ? mockCourses.filter((c) => c.instructorId === user.id)
    : [];

  const totalEnrollments = myCourses.reduce((s, c) => s + c.enrollmentCount, 0);
  const avgRating = myCourses.length
    ? (myCourses.reduce((s, c) => s + c.rating, 0) / myCourses.length).toFixed(
        1,
      )
    : "—";
  const avgCompletion = mockCourseAnalytics.length
    ? Math.round(
        mockCourseAnalytics.reduce((s, a) => s + a.completionRate, 0) /
          mockCourseAnalytics.length,
      )
    : 0;

  if (!hasInstructorAccess) {
    return (
      <div>
        <Header
          title="Instructor Access Required"
          subtitle="Only instructors and admins can manage course content"
          user={currentUser}
        />
        <div className="px-6 py-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-text-primary">
                Instructor access required
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                Learners attend events and courses. Publishing and managing
                course content is limited to instructors and admins.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Instructor Dashboard"
        subtitle={`${user.name} · ${myCourses.length} courses`}
        user={currentUser}
      />

      <div className="px-6 py-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard
            label="Total Enrollments"
            value={formatNumber(totalEnrollments)}
            sub="across all courses"
            icon={Users}
            accent
          />
          <StatsCard
            label="Courses Published"
            value={myCourses.filter((c) => c.status === "published").length}
            icon={BookOpen}
          />
          <StatsCard
            label="Avg Completion"
            value={`${avgCompletion}%`}
            sub="across courses"
            icon={TrendingUp}
            trend={{ value: "+3%", positive: true }}
          />
          <StatsCard
            label="Avg Rating"
            value={avgRating}
            sub="out of 5.0"
            icon={Star}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Course performance */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Course Performance</CardTitle>
                <Link
                  href="/instructor/courses"
                  className="text-xs text-primary hover:underline"
                >
                  Manage all →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-5 py-3 text-xs font-medium text-text-muted">
                      Course
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-text-muted hidden sm:table-cell">
                      Enrolled
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-text-muted">
                      Completion
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-text-muted hidden md:table-cell">
                      Rating
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-text-muted">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {myCourses.map((course) => {
                    const analytics = mockCourseAnalytics.find(
                      (a) => a.courseId === course.id,
                    );
                    return (
                      <tr
                        key={course.id}
                        className="group hover:bg-surface transition-colors"
                      >
                        <td className="px-5 py-3">
                          <Link
                            href={`/courses/${course.id}`}
                            className="font-medium text-text-primary hover:text-primary transition-colors line-clamp-1"
                          >
                            {course.title}
                          </Link>
                          <p className="text-xs text-text-muted capitalize">
                            {course.difficulty}
                          </p>
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell text-text-secondary">
                          {formatNumber(course.enrollmentCount)}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={analytics?.completionRate ?? 0}
                              className="w-20"
                              size="xs"
                            />
                            <span className="text-xs text-text-muted tabular-nums">
                              {analytics?.completionRate ?? 0}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <span className="text-xs font-medium text-yellow-400">
                            ★ {course.rating}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <Badge
                            variant={
                              course.status === "published"
                                ? "success"
                                : "default"
                            }
                          >
                            {course.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Drop-off by module */}
          <Card>
            <CardHeader>
              <CardTitle>Drop-off by Module</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockCourseAnalytics[0] &&
                Object.entries(mockCourseAnalytics[0].dropOffByModule).map(
                  ([modId, pct]) => (
                    <div key={modId} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-text-secondary">
                          {modId.replace("mod-", "Module ")}
                        </span>
                        <span
                          className={`font-semibold ${pct > 10 ? "text-red-400" : "text-emerald-400"}`}
                        >
                          {pct}% drop-off
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-active overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${pct > 10 ? "bg-red-500" : "bg-emerald-500"}`}
                          style={{ width: `${pct * 5}%` }}
                        />
                      </div>
                    </div>
                  ),
                )}
              <p className="text-xs text-text-muted pt-2">
                Higher drop-off may indicate content difficulty or pacing
                issues.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <section>
          <SectionHeader title="Quick Actions" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Create new course",
                sub: "Add a course to your library",
                href: "/instructor/courses/new",
                icon: PenSquare,
              },
              {
                label: "View all my courses",
                sub: "Manage drafts and published",
                href: "/instructor/courses",
                icon: BookOpen,
              },
              {
                label: "Review analytics",
                sub: "Detailed learner insights",
                href: "/analytics",
                icon: TrendingUp,
              },
            ].map(({ label, sub, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-soft-md transition-all duration-150"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-muted group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                    {label}
                  </p>
                  <p className="text-xs text-text-muted">{sub}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
