import { Skeleton, CourseCardSkeleton } from "@/components/ui/skeleton";

export default function CoursesLoading() {
  return (
    <div className="px-6 py-6 space-y-8 animate-fade-in">
      <div className="flex gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-6 w-12" rounded="full" />
        <Skeleton className="h-6 w-12" rounded="full" />
        <Skeleton className="h-6 w-12" rounded="full" />
      </div>
      <div>
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}
