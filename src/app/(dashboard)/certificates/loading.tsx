import { Skeleton } from "@/components/ui/skeleton";

export default function CertificatesLoading() {
  return (
    <div className="px-6 py-6 space-y-6 animate-fade-in">
      <Skeleton className="h-5 w-40 mb-2" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full" rounded="lg" />
        ))}
      </div>
    </div>
  );
}
