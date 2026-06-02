import { StatsSkeleton, Skeleton } from "@/components/ui/skeleton";
export default function InstructorLoading() {
  return (
    <div className="px-6 py-6 space-y-8 animate-fade-in">
      <StatsSkeleton />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Skeleton className="h-64 w-full" rounded="lg" />
        <Skeleton className="h-64 w-full" rounded="lg" />
      </div>
    </div>
  );
}
