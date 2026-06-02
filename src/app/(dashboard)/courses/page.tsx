"use client";

import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Header } from "@/components/layout";
import { BreadcrumbNav } from "@/components/ui";
import { CourseCard } from "@/components/dashboard";
import { mockCourses } from "@/mock/courses";
import { mockLearnerProgress } from "@/mock/analytics";
import { mockLearnerProfiles, currentUser } from "@/mock/users";
import { mockServiceCategories } from "@/mock/tenants";
import { cn } from "@/lib/utils";
import { paginate } from "@/lib/paginate";

type SortOption = "popular" | "rating" | "newest" | "price-asc" | "price-desc";
type PriceFilter = "all" | "free" | "paid";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;

function SidebarFilter({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg px-3 py-2 text-left text-sm transition-all",
        active
          ? "bg-text-primary text-text-inverse font-semibold"
          : "text-text-secondary hover:bg-surface hover:text-text-primary",
      )}
    >
      {label}
    </button>
  );
}

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [price, setPrice] = useState<PriceFilter>("all");
  const [sort, setSort] = useState<SortOption>("popular");
  const [page, setPage] = useState(1);

  const profile = mockLearnerProfiles.find((p) => p.id === currentUser.id);
  const enrolledIds = new Set(profile?.enrolledCourseIds ?? []);

  function getProgress(courseId: string) {
    return mockLearnerProgress.find(
      (p) => p.userId === currentUser.id && p.courseId === courseId,
    )?.percentComplete;
  }

  const filtered = useMemo(() => {
    let courses = [...mockCourses];

    if (query) {
      const q = query.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.includes(q)),
      );
    }
    if (category) courses = courses.filter((c) => c.categoryId === category);
    if (level) courses = courses.filter((c) => c.difficulty === level);
    if (price === "free")
      courses = courses.filter((c) => c.accessType === "free");
    if (price === "paid")
      courses = courses.filter((c) => c.accessType !== "free");

    switch (sort) {
      case "popular":
        return courses.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
      case "rating":
        return courses.sort((a, b) => b.rating - a.rating);
      case "newest":
        return courses.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "price-asc":
        return courses.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      case "price-desc":
        return courses.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      default:
        return courses;
    }
  }, [query, category, level, price, sort]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [query, category, level, price, sort]);

  const { items: paged, total, pages } = paginate(filtered, page);
  const hasFilters = !!(query || category || level || price !== "all");
  const featuredCourses = useMemo(
    () =>
      [...mockCourses]
        .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
        .slice(0, 3),
    [],
  );

  return (
    <div>
      <Header
        title="Courses"
        subtitle="Browse and continue your learning"
        user={currentUser}
      />

      <div className="px-6 py-6">
        <BreadcrumbNav crumbs={[{ label: "Courses" }]} className="mb-6" />

        {/* Featured row — only when no active filters */}
        {!hasFilters && (
          <section className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
              Featured Courses
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  progress={getProgress(course.id)}
                  isEnrolled={enrolledIds.has(course.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Two-column layout */}
        <div className="flex gap-6 items-start">
          {/* ── Sidebar ── */}
          <aside className="hidden lg:flex w-52 shrink-0 flex-col gap-6">
            {/* Category */}
            <div>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Category
              </p>
              <SidebarFilter
                label="All Categories"
                active={!category}
                onClick={() => setCategory(null)}
              />
              {mockServiceCategories.map((cat) => (
                <SidebarFilter
                  key={cat.id}
                  label={cat.label}
                  active={category === cat.id}
                  onClick={() => setCategory(cat.id)}
                />
              ))}
            </div>

            {/* Level */}
            <div>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Level
              </p>
              <SidebarFilter
                label="All Levels"
                active={!level}
                onClick={() => setLevel(null)}
              />
              {LEVELS.map((lvl) => (
                <SidebarFilter
                  key={lvl}
                  label={lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  active={level === lvl}
                  onClick={() => setLevel(lvl)}
                />
              ))}
            </div>

            {/* Price */}
            <div>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Price
              </p>
              <SidebarFilter
                label="All Prices"
                active={price === "all"}
                onClick={() => setPrice("all")}
              />
              <SidebarFilter
                label="Free"
                active={price === "free"}
                onClick={() => setPrice("free")}
              />
              <SidebarFilter
                label="Paid"
                active={price === "paid"}
                onClick={() => setPrice("paid")}
              />
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {/* Search + count + sort */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[180px] max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="search"
                  placeholder="Search courses…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors"
                />
              </div>

              <p className="text-sm text-text-muted shrink-0">
                {total} course{total !== 1 ? "s" : ""}
              </p>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                aria-label="Sort courses"
                className="ml-auto rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Course grid */}
            {total === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="h-10 w-10 text-text-muted mb-3" />
                <p className="text-sm font-medium text-text-primary">No courses found</p>
                <p className="text-xs text-text-muted mt-1">Try adjusting your search or filters.</p>
                <button
                  type="button"
                  onClick={() => { setQuery(""); setCategory(null); setLevel(null); setPrice("all"); }}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {paged.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      progress={getProgress(course.id)}
                      isEnrolled={enrolledIds.has(course.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                          p === page
                            ? "bg-primary text-white"
                            : "border border-border text-text-secondary hover:bg-surface",
                        )}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      disabled={page === pages}
                      className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
