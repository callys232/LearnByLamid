"use client";

import { useState } from "react";
import {
  Download,
  Trash2,
  Shield,
  Eye,
  Bell,
  BarChart3,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Button,
} from "@/components/ui";
import { currentUser } from "@/mock/users";
import { cn } from "@/lib/utils";

interface Toggle {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

export default function PrivacyPage() {
  const [toggles, setToggles] = useState<Toggle[]>([
    {
      id: "analytics",
      label: "Learning analytics",
      description:
        "Track time spent, video progress, and quiz performance to improve recommendations.",
      icon: BarChart3,
      enabled: true,
    },
    {
      id: "emails",
      label: "Email notifications",
      description:
        "Receive reminders for upcoming events, course nudges, and certificate alerts.",
      icon: Bell,
      enabled: true,
    },
    {
      id: "profiling",
      label: "Personalisation",
      description:
        "Allow AI to analyse your learning patterns to recommend courses and detect skill gaps.",
      icon: Eye,
      enabled: true,
    },
  ]);
  const [exportState, setExportState] = useState<"idle" | "loading" | "done">(
    "idle",
  );
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  function toggle(id: string) {
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
    );
  }

  async function handleExport() {
    setExportState("loading");
    // Swap with: const res = await fetch("/api/gdpr/export") → download JSON
    await new Promise((r) => setTimeout(r, 1500));
    // Mock download
    const data = {
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lamid-data-export.json";
    a.click();
    URL.revokeObjectURL(url);
    setExportState("done");
    setTimeout(() => setExportState("idle"), 3000);
  }

  return (
    <div>
      <Header
        title="Privacy & Data"
        subtitle="Control how your data is used"
        user={currentUser}
      />

      <div className="px-6 py-6 max-w-2xl space-y-6">
        {/* Privacy toggles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Privacy Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0 divide-y divide-border">
            {toggles.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.id} className="flex items-start gap-4 px-5 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-active mt-0.5">
                    <Icon className="h-4 w-4 text-text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">
                      {t.label}
                    </p>
                    <p className="text-xs text-text-secondary leading-relaxed mt-0.5">
                      {t.description}
                    </p>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => toggle(t.id)}
                    className={cn(
                      "relative shrink-0 h-6 w-11 rounded-full transition-colors duration-200",
                      t.enabled
                        ? "bg-primary shadow-primary-sm"
                        : "bg-surface-active",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                        t.enabled ? "translate-x-5" : "translate-x-0.5",
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Separator />

        {/* Data export */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-muted">
                <Download className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Export your data
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  Download a copy of all data LAMID holds about you — profile,
                  progress, certificates, and activity.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                disabled={exportState === "loading"}
              >
                {exportState === "loading" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Preparing…
                  </>
                ) : exportState === "done" ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />{" "}
                    Downloaded
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" /> Export JSON
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delete account */}
        <Card className="border-red-900/30">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-900/20">
                <Trash2 className="h-4 w-4 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Delete account
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  Permanently delete your account and all associated data. This
                  cannot be undone.
                </p>
              </div>
              {!deleteConfirm ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteConfirm(true)}
                >
                  Delete
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="danger" size="sm">
                    Confirm Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
