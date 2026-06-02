import Link from "next/link";
import { Plus, Edit, Eye } from "lucide-react";
import { Header } from "@/components/layout";
import {
  Card,
  CardContent,
  Badge,
  Button,
  SectionHeader,
} from "@/components/ui";
import { mockCourses } from "@/mock/courses";
import { currentUser } from "@/mock/users";
import { formatNumber } from "@/lib/utils";

export default function InstructorCoursesPage() {
  const user = currentUser;
  const hasAccess = ["instructor", "admin", "super_admin"].includes(user.role);
  const myCourses = hasAccess
    ? mockCourses.filter((c) => c.instructorId === user.id)
    : [];

  return (
    <div>
      <Header
        title="My Courses"
        subtitle={
          hasAccess ? "Manage your course library" : "Access restricted"
        }
        user={user}
      />

      <div className="px-6 py-6 space-y-6">
        {!hasAccess ? (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-text-primary">
                Access denied
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                Learners can attend events and courses, but only instructors and
                admins can manage course content.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <SectionHeader title={`${myCourses.length} courses`} />
              <Link href="/instructor/courses/new">
                <Button variant="primary" size="md">
                  <Plus className="h-4 w-4" /> New Course
                </Button>
              </Link>
            </div>

            {myCourses.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center">
                  <p className="text-sm text-text-muted">No courses yet.</p>
                  <Link
                    href="/instructor/courses/new"
                    className="mt-3 inline-block text-sm text-primary hover:underline"
                  >
                    Create your first course →
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card>
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
                        <th className="px-5 py-3 text-xs font-medium text-text-muted hidden md:table-cell">
                          Rating
                        </th>
                        <th className="px-5 py-3 text-xs font-medium text-text-muted">
                          Status
                        </th>
                        <th className="px-5 py-3 text-xs font-medium text-text-muted">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {myCourses.map((course) => (
                        <tr
                          key={course.id}
                          className="group hover:bg-surface transition-colors"
                        >
                          <td className="px-5 py-3 max-w-xs">
                            <p className="font-medium text-text-primary line-clamp-1">
                              {course.title}
                            </p>
                            <p className="text-xs text-text-muted capitalize">
                              {course.difficulty} · {course.estimatedHours}h
                            </p>
                          </td>
                          <td className="px-5 py-3 hidden sm:table-cell text-text-secondary">
                            {formatNumber(course.enrollmentCount)}
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
                                  : course.status === "draft"
                                    ? "warning"
                                    : "default"
                              }
                            >
                              {course.status}
                            </Badge>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/instructor/courses/${course.id}/edit`}
                                className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
                              >
                                <Edit className="h-3 w-3" /> Edit
                              </Link>
                              <Link
                                href={`/courses/${course.id}`}
                                className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
                              >
                                <Eye className="h-3 w-3" /> Preview
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
