"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { Header, AccessDenied } from "@/components/layout";
import { Card, CardContent, Input, Button, Separator } from "@/components/ui";
import { currentUser } from "@/mock/users";

interface CategoryDraft {
  id: string;
  code: string;
  label: string;
  color: string;
}

let uid = 0;
function nextId() { return `cat-draft-${++uid}`; }

export default function NewTenantPage() {
  // ── All hooks first — before any conditional returns ──────────────────────
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [done,   setDone]   = useState(false);
  const [name,   setName]   = useState("");
  const [slug,   setSlug]   = useState("");
  const [domain, setDomain] = useState("");
  const [color,  setColor]  = useState("#C12129");
  const [type,   setType]   = useState<"enterprise" | "independent">("enterprise");
  const [cats,   setCats]   = useState<CategoryDraft[]>([
    { id: nextId(), code: "CAT1", label: "Category 1", color: "#C12129" },
  ]);

  // ── Gate (after hooks) ────────────────────────────────────────────────────
  if (currentUser.role !== "super_admin") return <AccessDenied requiredRole="super admin" />;

  function addCat() {
    setCats((prev) => [...prev, { id: nextId(), code: "", label: "", color: "#555555" }]);
  }

  function removeCat(id: string) {
    if (cats.length <= 1) return; // enforce minimum of one category
    setCats((prev) => prev.filter((c) => c.id !== id));
  }

  function updateCat(id: string, patch: Partial<CategoryDraft>) {
    setCats((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cats.length === 0) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    // Swap with: POST /api/tenants { name, slug, domain, color, type, categories }
    setDone(true);
    setSaving(false);
    setTimeout(() => router.push("/super-admin/tenants"), 1500);
  }

  return (
    <div>
      <Header title="New Tenant" subtitle="Provision a new organization" user={currentUser} />

      <div className="px-6 py-6 max-w-2xl">
        <Link
          href="/super-admin/tenants"
          className="mb-6 flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to tenants
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm font-semibold text-text-primary">Organisation Details</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Organisation name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, ""),
                    );
                  }}
                  placeholder="Acme Academy"
                  required
                />
                <Input
                  label="Slug (subdomain)"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="acme"
                  hint={slug ? `${slug}.lamid.co` : "e.g. acme.lamid.co"}
                  required
                />
              </div>
              <Input
                label="Custom domain (optional)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="academy.acme.com"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tenant-type" className="text-sm font-medium text-text-primary">
                    Tenant type
                  </label>
                  <select
                    id="tenant-type"
                    value={type}
                    onChange={(e) => setType(e.target.value as typeof type)}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/50"
                  >
                    <option value="enterprise">Enterprise</option>
                    <option value="independent">Independent Educator</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="brand-color" className="text-sm font-medium text-text-primary">
                    Brand colour
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="brand-color"
                      type="color"
                      aria-label="Brand colour picker"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-9 w-14 cursor-pointer rounded-lg border border-border bg-surface p-1"
                    />
                    <span className="font-mono text-sm text-text-secondary">{color}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service categories */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-primary">Service Categories</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    At least one required. Max 6 characters per code.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addCat}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>

              <div className="space-y-3">
                {cats.map((cat, i) => (
                  <div key={cat.id} className="flex items-center gap-3">
                    <input
                      type="color"
                      aria-label={`Colour for category ${i + 1}`}
                      title="Category colour"
                      value={cat.color}
                      onChange={(e) => updateCat(cat.id, { color: e.target.value })}
                      className="h-8 w-8 shrink-0 cursor-pointer rounded-md border border-border bg-surface p-0.5"
                    />
                    <input
                      aria-label={`Code for category ${i + 1}`}
                      value={cat.code}
                      onChange={(e) =>
                        updateCat(cat.id, { code: e.target.value.toUpperCase().slice(0, 6) })
                      }
                      placeholder="CODE"
                      className="w-20 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs font-mono font-bold text-text-primary focus:outline-none focus:border-primary/50"
                    />
                    <input
                      aria-label={`Label for category ${i + 1}`}
                      value={cat.label}
                      onChange={(e) => updateCat(cat.id, { label: e.target.value })}
                      placeholder="Category label…"
                      className="flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary/50"
                    />
                    <button
                      type="button"
                      aria-label={`Remove category ${i + 1}`}
                      onClick={() => removeCat(cat.id)}
                      disabled={cats.length <= 1}
                      className="text-text-muted hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {cats.length <= 1 && (
                <p className="text-xs text-text-muted">
                  At least one service category is required.
                </p>
              )}
            </CardContent>
          </Card>

          <Separator />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={saving || !name || !slug || cats.length === 0}
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Provisioning tenant…</>
            ) : done ? (
              <><CheckCircle2 className="h-4 w-4" /> Tenant created!</>
            ) : (
              "Provision Tenant"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
