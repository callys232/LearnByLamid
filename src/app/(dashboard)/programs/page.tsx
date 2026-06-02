import Link from "next/link";
import { BookOpen, Clock, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout";
import { Card, CardContent, Badge, SectionHeader } from "@/components/ui";
import { mockPrograms, mockCourses } from "@/mock/courses";
import { currentUser } from "@/mock/users";
import { mockServiceCategories } from "@/mock/tenants";
import { formatMinutes } from "@/lib/utils";

export default function ProgramsPage() {
  function getCategory(categoryId: string) {
    return mockServiceCategories.find((c) => c.id === categoryId);
  }

  function getCourses(courseIds: string[]) {
    return mockCourses.filter((c) => courseIds.includes(c.id));
  }

  const categoryVariant: Record<string, "hcd" | "biz" | "sd"> = {
    "cat-hcd": "hcd",
    "cat-biz": "biz",
    "cat-sd": "sd",
  };

  return (
    <div>
      <Header
        title="Programs"
        subtitle="Multi-course learning tracks with certification"
        user={currentUser}
      />

      <div className="px-6 py-6">
        <SectionHeader
          title="All Programs"
          description={`${mockPrograms.length} programs available`}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {mockPrograms.map((program) => {
            const courses = getCourses(program.courseIds);
            const category = getCategory(program.categoryId);
            const totalHours = courses.reduce(
              (s, c) => s + c.estimatedHours,
              0,
            );
            const totalEnrollments = courses.reduce(
              (s, c) => s + c.enrollmentCount,
              0,
            );

            return (
              <Card
                key={program.id}
                className="group hover:border-primary/30 transition-all"
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      {category && (
                        <Badge
                          variant={
                            categoryVariant[program.categoryId] ?? "default"
                          }
                          className="mb-2"
                        >
                          {category.code}
                        </Badge>
                      )}
                      <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors">
                        {program.title}
                      </h3>
                    </div>
                    <Badge
                      variant={
                        program.accessType === "free" ? "success" : "primary"
                      }
                    >
                      {program.accessType === "free"
                        ? "Free"
                        : `$${program.price}`}
                    </Badge>
                  </div>

                  <p className="mb-4 text-sm text-text-secondary leading-relaxed">
                    {program.description}
                  </p>

                  {/* Stats row */}
                  <div className="mb-4 flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {courses.length} courses
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatMinutes(totalHours * 60)}
                    </span>
                    <span>{totalEnrollments.toLocaleString()} enrolled</span>
                  </div>

                  {/* Course list */}
                  <div className="mb-5 flex flex-col gap-1.5">
                    {courses.map((course, i) => (
                      <div
                        key={course.id}
                        className="flex items-center gap-2 text-xs text-text-secondary"
                      >
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-surface-active text-[10px] font-semibold text-text-muted">
                          {i + 1}
                        </span>
                        {course.title}
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/programs/${program.id}`}
                    className="flex items-center justify-between rounded-lg bg-surface border border-border px-4 py-2.5 text-sm font-semibold text-text-primary hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    View Program <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
