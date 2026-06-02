import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

const roundedMap = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export function Skeleton({ className, rounded = "md" }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", roundedMap[rounded], className)}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-5 space-y-3",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-9 w-9" rounded="lg" />
      </div>
    </div>
  );
}

export function CourseCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface overflow-hidden",
        className,
      )}
    >
      <Skeleton className="h-40 w-full" rounded="sm" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-3 pt-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

export function EventCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-5 space-y-3",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-20" rounded="full" />
        <Skeleton className="h-5 w-16" rounded="full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-3 pt-1">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-8 w-full" rounded="lg" />
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="px-6 py-6 space-y-8 animate-fade-in">
      <StatsSkeleton />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
