import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Building2, ExternalLink } from "lucide-react";
import { Header } from "@/components/layout";
import { Card, CardContent, Badge, Button, SectionHeader } from "@/components/ui";
import { mockTenants } from "@/mock/tenants";
import { currentUser } from "@/mock/users";

export default function TenantsPage() {
  if (currentUser.role !== "super_admin") redirect("/dashboard");
  return (
    <div>
      <Header title="Tenant Management" subtitle={`${mockTenants.length} tenants on LAMID platform`} user={currentUser} />

      <div className="px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <SectionHeader title="All Tenants" />
          <Link href="/super-admin/tenants/new">
            <Button variant="primary" size="md"><Plus className="h-4 w-4" /> New Tenant</Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {mockTenants.map((tenant) => (
            <Card key={tenant.id} className="group hover:border-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-soft-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-lg font-bold shrink-0 shadow-sm" style={{ background: tenant.primaryColor }}>
                      {tenant.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{tenant.name}</p>
                      <p className="text-xs text-text-muted">{tenant.slug}.lamid.co</p>
                    </div>
                  </div>
                  <Badge variant={tenant.type === "lamid" ? "primary" : tenant.type === "enterprise" ? "warning" : "default"}>
                    {tenant.type}
                  </Badge>
                </div>

                {/* Branding color */}
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border border-border/50" style={{ background: tenant.primaryColor }} />
                  <span className="font-mono text-xs text-text-muted">{tenant.primaryColor}</span>
                </div>

                {/* Service categories */}
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {tenant.serviceCategories.map((c) => (
                    <span key={c.id} className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
                      {c.code} · {c.label}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/super-admin/tenants/${tenant.id}`}
                    className="flex-1 text-center rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
                  >
                    Manage
                  </Link>
                  {tenant.domain && (
                    <a href={`https://${tenant.domain}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-hover transition-all">
                      <ExternalLink className="h-3 w-3" /> Visit
                    </a>
                  )}
                  <button type="button" className="rounded-lg border border-red-900/40 bg-surface px-3 py-1.5 text-xs text-red-400 hover:bg-red-900/20 transition-all">
                    Suspend
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
