"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Separator, Badge } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { mockTenants, mockServiceCategories } from "@/mock/tenants";
import { currentUser } from "@/mock/users";

export default function SettingsPage() {
  const toast  = useToast();
  const tenant = mockTenants.find((t) => t.id === "tenant-lamid")!;

  const [orgName,    setOrgName]    = useState(tenant.name);
  const [subdomain,  setSubdomain]  = useState(tenant.slug);
  const [brandColor, setBrandColor] = useState(tenant.primaryColor);
  const [name,       setName]       = useState(currentUser.name);
  const [email,      setEmail]      = useState(currentUser.email);
  const [password,   setPassword]   = useState("");

  function saveBranding() {
    // Swap with PATCH /api/tenants/:id when DB is wired
    toast("Branding saved successfully.", "success");
  }

  function saveAccount() {
    if (!name.trim() || !email.trim()) {
      toast("Name and email are required.", "error");
      return;
    }
    // Swap with PATCH /api/users/:id when DB is wired
    setPassword("");
    toast("Account updated successfully.", "success");
  }

  function deleteAccount() {
    toast("Account deletion requires confirmation — contact support.", "warning");
  }

  return (
    <div>
      <Header title="Settings" subtitle="Tenant configuration · LAMID" user={currentUser} />

      <div className="px-6 py-6 max-w-2xl space-y-8">
        {/* Branding */}
        <Card>
          <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Organisation name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
            <Input
              label="Subdomain"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              hint="Your learners will access learn.lamid.co"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Brand colour</label>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary border border-primary/30 shadow-primary-sm" />
                <Input
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="max-w-[140px] font-mono text-xs"
                />
              </div>
            </div>
            <Button variant="primary" onClick={saveBranding}>Save branding</Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Service categories */}
        <Card>
          <CardHeader>
            <CardTitle>Service Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-text-secondary">
              Categories tag your courses and filter analytics. LAMID uses HCD, BIZ, and SD.
            </p>
            <div className="flex flex-wrap gap-2">
              {mockServiceCategories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 hover:border-primary/30 transition-colors">
                  <span className="font-mono text-xs font-bold text-primary">{cat.code}</span>
                  <span className="text-xs text-text-secondary">{cat.label}</span>
                  <Badge variant="default" className="text-[10px]">active</Badge>
                </div>
              ))}
              <button
                type="button"
                onClick={() => toast("Category management coming soon.", "info")}
                className="flex items-center gap-1.5 rounded-xl border border-dashed border-border px-3 py-2 text-xs text-text-muted hover:border-primary/40 hover:text-primary transition-all"
              >
                + Add category
              </button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Account */}
        <Card>
          <CardHeader><CardTitle>Account</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <Input
              label="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Leave blank to keep current"
            />
            <div className="flex gap-3">
              <Button variant="primary" onClick={saveAccount}>Save changes</Button>
              <Button variant="danger" onClick={deleteAccount}>Delete account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
