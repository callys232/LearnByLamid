"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Users, BookOpen, Globe, Palette } from "lucide-react";
import Link from "next/link";
import { Header, AccessDenied } from "@/components/layout";
import {
  Card, CardContent, CardHeader, CardTitle,
  Badge, Button, Input, BreadcrumbNav, Separator,
} from "@/components/ui";
import { mockTenants } from "@/mock/tenants";
import { mockCourses } from "@/mock/courses";
import { mockUsers, currentUser } from "@/mock/users";

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  if (currentUser.role !== "super_admin") return <AccessDenied requiredRole="super admin" />;

  const tenant = mockTenants.find((t) => t.id === id);

  const [name,  setName]  = useState(tenant?.name  ?? "");
  const [slug,  setSlug]  = useState(tenant?.slug  ?? "");
  const [color, setColor] = useState(tenant?.primaryColor ?? "#C12129");
  const [saved, setSaved] = useState(false);

  if (!tenant) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-sm text-text-muted">
          Tenant not found.{" "}
          <Link href="/super-admin/tenants" className="text-primary hover:underline">
            Back to tenants
          </Link>
        </p>
      </div>
    );
  }

  const tenantCourses = mockCourses.filter((c) => c.tenantId === tenant.id);
  const tenantUsers   = mockUsers.filter((u) => u.tenantId === tenant.id);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <Header
        title={tenant.name}
        subtitle={`${tenant.slug}.lamid.co · ${tenant.type}`}
        user={currentUser}
      />

      <div className="px-6 py-6 space-y-6 max-w-2xl">
        <BreadcrumbNav crumbs={[
          { label: "Platform", href: "/super-admin" },
          { label: "Tenants", href: "/super-admin/tenants" },
          { label: tenant.name },
        ]} />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users,    label: "Users",   value: tenantUsers.length   },
            { icon: BookOpen, label: "Courses", value: tenantCourses.length },
            { icon: Globe,    label: "Domain",  value: tenant.domain ?? "—" },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-muted">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm truncate">{value}</p>
                  <p className="text-xs text-text-muted">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" /> Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Organisation name"
              value={name}
              onChange={(e) => { setName(e.target.value); setSaved(false); }}
            />
            <Input
              label="Subdomain slug"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSaved(false); }}
              hint={`${slug}.lamid.co`}
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tenant-color" className="text-sm font-medium text-text-primary">
                Brand colour
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-lg border border-border/50 shadow-sm shrink-0 [background:var(--swatch)]"
                  style={{ "--swatch": color } as React.CSSProperties}
                />
                <Input
                  id="tenant-color"
                  value={color}
                  onChange={(e) => { setColor(e.target.value); setSaved(false); }}
                  className="max-w-[140px] font-mono text-xs"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="primary" onClick={handleSave}>
                {saved ? "✓ Saved" : "Save branding"}
              </Button>
              {tenant.domain && (
                <a
                  href={`https://${tenant.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Visit site
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Service categories */}
        <Card>
          <CardHeader><CardTitle>Service Categories</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {tenant.serviceCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0 [background:var(--cat-color)]"
                    style={{ "--cat-color": cat.color ?? "#888" } as React.CSSProperties}
                  />
                  <span className="font-mono text-xs font-bold text-text-primary">{cat.code}</span>
                  <span className="text-xs text-text-secondary">{cat.label}</span>
                  <Badge variant="default" className="text-[10px]">active</Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted">
              Service categories scope courses and analytics for this tenant.
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Danger zone */}
        <Card className="border-red-900/30">
          <CardHeader><CardTitle className="text-red-400">Danger Zone</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-red-900/20 bg-red-900/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-text-primary">Suspend tenant</p>
                <p className="text-xs text-text-muted">Blocks all logins for this tenant's users immediately.</p>
              </div>
              <Button variant="danger" size="sm">Suspend</Button>
            </div>
          </CardContent>
        </Card>

        <Link
          href="/super-admin/tenants"
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to tenants
        </Link>
      </div>
    </div>
  );
}
