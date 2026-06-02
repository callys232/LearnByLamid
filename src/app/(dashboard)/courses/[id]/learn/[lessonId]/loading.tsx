import { Skeleton } from "@/components/ui/skeleton";

export default function LessonLoading() {
  return (
    <div className="flex h-screen flex-col bg-background animate-fade-in">
      <div className="flex h-14 items-center gap-4 border-b border-border px-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          <Skeleton className="aspect-video w-full max-h-[calc(100vh-14rem)]" rounded="sm" />
          <div className="border-t border-border p-4 flex justify-between">
            <Skeleton className="h-9 w-28" rounded="lg" />
            <Skeleton className="h-9 w-40" rounded="lg" />
          </div>
        </div>
        <Skeleton className="w-72 h-full" rounded="sm" />
      </div>
    </div>
  );
}
