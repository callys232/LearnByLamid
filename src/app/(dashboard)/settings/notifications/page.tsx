"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, BreadcrumbNav, Separator } from "@/components/ui";
import { currentUser } from "@/mock/users";

interface NotifPref {
  id: string;
  label: string;
  description: string;
  email: boolean;
  inApp: boolean;
}

const DEFAULTS: NotifPref[] = [
  { id: "course_updates",    label: "Course updates",          description: "New modules, lessons, or content changes in courses you're enrolled in", email: true,  inApp: true  },
  { id: "quiz_reminders",    label: "Quiz & assignment due",   description: "Reminders before upcoming quizzes and assignment deadlines",              email: true,  inApp: true  },
  { id: "live_sessions",     label: "Live session reminders",  description: "Notifications 24h and 1h before a live session you've registered for",  email: true,  inApp: true  },
  { id: "cert_earned",       label: "Certificate earned",      description: "When you earn a new certificate or badge",                               email: true,  inApp: true  },
  { id: "xp_milestones",     label: "XP milestones",           description: "Streak milestones and leaderboard position changes",                    email: false, inApp: true  },
  { id: "new_courses",       label: "New course announcements",description: "When LAMID publishes a new course in your enrolled categories",          email: false, inApp: true  },
  { id: "instructor_msgs",   label: "Instructor messages",     description: "Direct messages and announcements from your course instructors",         email: true,  inApp: true  },
  { id: "admin_broadcast",   label: "Platform announcements",  description: "Important platform-wide updates from LAMID admins",                     email: true,  inApp: true  },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        checked ? "bg-primary" : "bg-surface-active"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function NotificationsSettingsPage() {
  const [prefs, setPrefs] = useState<NotifPref[]>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  function update(id: string, channel: "email" | "inApp", value: boolean) {
    setPrefs((prev) => prev.map((p) => p.id === id ? { ...p, [channel]: value } : p));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <Header title="Notifications" subtitle="Control when and how LAMID contacts you" user={currentUser} />

      <div className="px-6 py-6 max-w-2xl space-y-6">
        <BreadcrumbNav crumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Notifications" },
        ]} />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notification Preferences</CardTitle>
              <div className="hidden sm:flex items-center gap-6 text-xs font-medium text-text-muted pr-1">
                <span className="w-10 text-center">Email</span>
                <span className="w-10 text-center">In-app</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <ul className="divide-y divide-border">
              {prefs.map((pref, i) => (
                <li key={pref.id}>
                  {i > 0 && i % 4 === 0 && <Separator />}
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{pref.label}</p>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{pref.description}</p>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-text-muted sm:hidden">Email</span>
                        <Toggle checked={pref.email} onChange={(v) => update(pref.id, "email", v)} />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-text-muted sm:hidden">In-app</span>
                        <Toggle checked={pref.inApp} onChange={(v) => update(pref.id, "inApp", v)} />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={handleSave}>
            {saved ? "✓ Saved" : "Save preferences"}
          </Button>
          <button
            type="button"
            onClick={() => { setPrefs(DEFAULTS); setSaved(false); }}
            className="text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}
