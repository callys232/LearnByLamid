import Link from "next/link";
import { ShieldX } from "lucide-react";

interface AccessDeniedProps {
  requiredRole?: string;
}

export function AccessDenied({ requiredRole }: AccessDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
        <ShieldX className="h-8 w-8 text-red-400" />
      </div>
      <h1 className="text-xl font-bold text-text-primary mb-2">Access Restricted</h1>
      <p className="text-sm text-text-secondary max-w-sm mb-6">
        {requiredRole
          ? `This page requires ${requiredRole} access. Contact your administrator if you believe this is an error.`
          : "You don't have permission to view this page."}
      </p>
      <Link
        href="/dashboard"
        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-primary-sm hover:bg-primary-hover transition-all"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
