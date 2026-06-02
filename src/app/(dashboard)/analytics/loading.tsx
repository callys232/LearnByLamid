import { StatsSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="px-6 py-6 space-y-8 animate-fade-in">
      <StatsSkeleton />
      <Skeleton className="h-9 w-56" rounded="lg" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-56 w-full" rounded="lg" />
        <Skeleton className="h-56 w-full" rounded="lg" />
      </div>
    </div>
  );
}
