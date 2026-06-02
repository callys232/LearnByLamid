import { Skeleton } from "@/components/ui/skeleton";

export default function ProgramsLoading() {
  return (
    <div className="px-6 py-6 space-y-6 animate-fade-in">
      <Skeleton className="h-5 w-40 mb-2" />
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" rounded="lg" />
        ))}
      </div>
    </div>
  );
}
