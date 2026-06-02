import { redirect } from "next/navigation";
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  DollarSign,
  Activity,
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
import { ActiveUsersWidget } from "@/components/realtime";
import { mockPlatformAnalytics, mockCourseAnalytics } from "@/mock/analytics";
import { mockCourses } from "@/mock/courses";
import { mockUsers, currentUser } from "@/mock/users";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function AdminPage() {
  if (!["admin", "super_admin"].includes(currentUser.role))
    redirect("/dashboard");

  const a = mockPlatformAnalytics;

  const recentUsers = mockUsers.slice(0, 5);

  return (
    <div>
      <Header
        title="Admin Dashboard"
        subtitle="Platform overview · LAMID tenant"
        user={{ ...currentUser, avatar: currentUser.avatar || "" }}
      />

      <div className="px-6 py-6 space-y-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard
            label="Total Users"
            value={formatNumber(a.totalUsers)}
            sub="all time"
            icon={Users}
            accent
          />
          <StatsCard
            label="Active This Month"
            value={formatNumber(a.activeUsersThisMonth)}
            sub="unique learners"
            icon={Activity}
            trend={{ value: "+12%", positive: true }}
          />
          <StatsCard
            label="Certificates Issued"
            value={a.totalCertificatesIssued}
            sub="all time"
            icon={Award}
            trend={{ value: "+8", positive: true }}
          />
          <StatsCard
            label="Revenue (this month)"
            value={formatCurrency(a.revenueThisMonth)}
            sub="from paid courses"
            icon={DollarSign}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Top courses */}
          <Card>
            <CardHeader>
              <CardTitle>Top Courses by Enrollment</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <ul className="divide-y divide-border">
                {a.topCourses.map(({ courseId, enrollments }, i) => {
                  const course = mockCourses.find((c) => c.id === courseId);
                  const analytics = mockCourseAnalytics.find(
                    (c) => c.courseId === courseId,
                  );
                  if (!course) return null;
                  return (
                    <li
                      key={courseId}
                      className="flex items-center gap-4 px-5 py-3 hover:bg-surface transition-colors"
                    >
                      <span className="w-5 shrink-0 text-sm font-bold text-text-muted tabular-nums">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {course.title}
                        </p>
                        <div className="mt-1 flex items-center gap-3">
                          <Progress
                            value={analytics?.completionRate ?? 0}
                            className="max-w-[120px]"
                            size="xs"
                          />
                          <span className="text-xs text-text-muted">
                            {analytics?.completionRate ?? 0}% completion
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-text-primary">
                          {formatNumber(enrollments)}
                        </p>
                        <p className="text-xs text-text-muted">enrolled</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Platform health */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Enrollment rate", value: 78, color: "bg-primary" },
                {
                  label: "Avg completion rate",
                  value: 71,
                  color: "bg-emerald-500",
                },
                {
                  label: "Active user ratio",
                  value: Math.round(
                    (a.activeUsersThisMonth / a.totalUsers) * 100,
                  ),
                  color: "bg-blue-500",
                },
                {
                  label: "Cert issue rate",
                  value: Math.round(
                    (a.totalCertificatesIssued / a.totalEnrollments) * 100,
                  ),
                  color: "bg-yellow-500",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">{label}</span>
                    <span className="font-semibold text-text-primary">
                      {value}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-active overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-700`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Live activity */}
          <ActiveUsersWidget />
        </div>

        {/* Recent users */}
        <section>
          <SectionHeader title="Recent Users" href="/admin/users" />
          <Card>
            <CardContent className="px-0 pb-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-5 py-3 text-xs font-medium text-text-muted">
                      User
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-text-muted">
                      Role
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-text-muted hidden md:table-cell">
                      XP
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-text-muted hidden lg:table-cell">
                      Last Active
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-surface transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-muted text-xs font-bold text-primary shrink-0">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">
                              {user.name}
                            </p>
                            <p className="text-xs text-text-muted">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          variant={
                            user.role === "admin"
                              ? "primary"
                              : user.role === "instructor"
                                ? "warning"
                                : "default"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="text-text-secondary">
                          {user.xp.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell text-xs text-text-muted">
                        {new Date(user.lastActiveAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
