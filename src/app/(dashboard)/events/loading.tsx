import { Skeleton, EventCardSkeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <div className="px-6 py-6 space-y-6 animate-fade-in">
      <Skeleton className="h-9 w-72" rounded="lg" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
