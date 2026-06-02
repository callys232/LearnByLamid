import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Building2,
  Award,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Shield,
} from "lucide-react";
import { Header } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  SectionHeader,
  Progress,
} from "@/components/ui";
import { StatsCard } from "@/components/dashboard";
import { ActiveUsersWidget } from "@/components/realtime";
import { mockTenants } from "@/mock/tenants";
import { mockUsers, currentUser } from "@/mock/users";
import { mockPlatformAnalytics } from "@/mock/analytics";
import { formatNumber, formatCurrency } from "@/lib/utils";

// Cross-tenant rollup (in prod this would be a DB aggregation)
const crossTenantStats = {
  totalTenants: mockTenants.length,
  totalUsers: mockUsers.length + 4280, // mock other tenants
  totalCertificates: 312 + 840,
  totalRevenue: 18600 + 34200,
};

export default function SuperAdminPage() {
  if (currentUser.role !== "super_admin") redirect("/dashboard");

  const a = mockPlatformAnalytics;

  return (
    <div>
      <Header
        title="Super Admin"
        subtitle="Cross-tenant platform governance"
        user={currentUser}
      />

      <div className="px-6 py-6 space-y-8">
        {/* Platform-wide stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard
            label="Total Tenants"
            value={crossTenantStats.totalTenants}
            icon={Building2}
            accent
          />
          <StatsCard
            label="All Users"
            value={formatNumber(crossTenantStats.totalUsers)}
            icon={Users}
            trend={{ value: "+12%", positive: true }}
          />
          <StatsCard
            label="Certificates"
            value={formatNumber(crossTenantStats.totalCertificates)}
            icon={Award}
          />
          <StatsCard
            label="Platform Revenue"
            value={formatCurrency(crossTenantStats.totalRevenue)}
            icon={DollarSign}
            trend={{ value: "+8%", positive: true }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Tenant table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Tenants</CardTitle>
                <Link href="/super-admin/tenants/new">
                  <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-primary-sm hover:bg-primary-hover transition-all">
                    + New Tenant
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-5 py-3 text-xs font-medium text-text-muted">
                      Tenant
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-text-muted hidden sm:table-cell">
                      Type
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-text-muted hidden md:table-cell">
                      Domain
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-text-muted">
                      Categories
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-text-muted">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockTenants.map((tenant) => (
                    <tr
                      key={tenant.id}
                      className="group hover:bg-surface transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-6 w-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                            style={{ background: tenant.primaryColor }}
                          >
                            {tenant.name[0]}
                          </div>
                          <span className="font-medium text-text-primary">
                            {tenant.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <Badge
                          variant={
                            tenant.type === "lamid" ? "primary" : "default"
                          }
                        >
                          {tenant.type}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell text-xs text-text-muted">
                        {tenant.domain ?? "—"}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {tenant.serviceCategories.slice(0, 3).map((c) => (
                            <span
                              key={c.id}
                              className="rounded-md bg-surface-active px-1.5 py-0.5 text-[10px] font-mono font-semibold text-text-secondary"
                            >
                              {c.code}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Link
                          href={`/super-admin/tenants`}
                          className="text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Manage →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Live activity */}
          <ActiveUsersWidget />
        </div>

        {/* LAMID tenant deep-dive */}
        <section>
          <SectionHeader
            title="LAMID Tenant — Performance"
            description="Root tenant detailed metrics"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Enrollment rate", value: 78 },
              { label: "Avg completion rate", value: 71 },
              { label: "Cert issuance rate", value: 38 },
            ].map(({ label, value }) => (
              <Card key={label}>
                <CardContent className="p-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-text-secondary">{label}</span>
                    <span className="font-semibold text-text-primary">
                      {value}%
                    </span>
                  </div>
                  <Progress value={value} />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
