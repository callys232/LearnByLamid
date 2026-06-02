"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Layers, HelpCircle, Eye } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout";
import {
  Card,
  CardContent,
  Input,
  Button,
  Badge,
  Separator,
} from "@/components/ui";
import {
  ModuleBuilder,
  QuizBuilder,
  type ModuleDraft,
  type QuizDraft,
} from "@/components/instructor";
import { mockServiceCategories } from "@/mock/tenants";
import { currentUser } from "@/mock/users";
import { cn } from "@/lib/utils";
import { DifficultyLevel, AccessType, ContentStatus } from "@/types/types";

type Step = "info" | "modules" | "quizzes" | "review";
const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "info", label: "Basic Info", icon: BookOpen },
  { id: "modules", label: "Modules", icon: Layers },
  { id: "quizzes", label: "Quizzes", icon: HelpCircle },
  { id: "review", label: "Review", icon: Eye },
];

interface CourseForm {
  title: string;
  description: string;
  categoryId: string;
  difficulty: DifficultyLevel;
  accessType: AccessType;
  price: string;
  status: ContentStatus;
}

export default function NewCoursePage() {
  const router = useRouter();
  const user = currentUser;
  const hasInstructorAccess = ["instructor", "admin", "super_admin"].includes(
    user.role,
  );
  const [step, setStep] = useState<Step>("info");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CourseForm>({
    title: "",
    description: "",
    categoryId: "cat-hcd",
    difficulty: "beginner",
    accessType: "free",
    price: "",
    status: "draft",
  });
  const [modules, setModules] = useState<ModuleDraft[]>([]);
  const [quizzes, setQuizzes] = useState<QuizDraft[]>([]);

  const stepIdx = STEPS.findIndex((s) => s.id === step);

  function updateForm(patch: Partial<CourseForm>) {
    setForm((f) => ({ ...f, ...patch }));
  }

  async function handleSave(publish = false) {
    setSaving(true);
    // Mock: simulate save latency then navigate — swap for real API call later
    await new Promise((r) => setTimeout(r, 600));
    void publish; // will control status when real API is wired
    router.push("/instructor/courses");
  }

  return (
    <div>
      <Header
        title="Create New Course"
        subtitle="Drag modules, add quizzes, publish"
        user={user}
      />

      <div className="px-6 py-6 max-w-3xl">
        <Link
          href="/instructor/courses"
          className="mb-6 flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to my courses
        </Link>

        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-2">
          {STEPS.map((s, i) => {
            const done = i < stepIdx;
            const current = s.id === step;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => i <= stepIdx && setStep(s.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150",
                    current
                      ? "bg-primary text-white shadow-primary-sm"
                      : done
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "text-text-muted",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-px w-6 transition-colors",
                      i < stepIdx ? "bg-emerald-500/40" : "bg-border",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {!hasInstructorAccess ? (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-text-primary">
                Unauthorized
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                Only instructors and administrators can create new courses.
                Learners may enroll in courses and attend events.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Step content */}
            {step === "info" && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Input
                    label="Course title"
                    value={form.title}
                    onChange={(e) => updateForm({ title: e.target.value })}
                    placeholder="e.g. Foundations of Human-Centered Design"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="course-description"
                      className="text-sm font-medium text-text-primary"
                    >
                      Description
                    </label>
                    <textarea
                      id="course-description"
                      value={form.description}
                      onChange={(e) =>
                        updateForm({ description: e.target.value })
                      }
                      placeholder="What will learners achieve? Be specific."
                      rows={4}
                      className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="course-category"
                        className="text-sm font-medium text-text-primary"
                      >
                        Category
                      </label>
                      <select
                        id="course-category"
                        value={form.categoryId}
                        onChange={(e) =>
                          updateForm({ categoryId: e.target.value })
                        }
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/50"
                      >
                        {mockServiceCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="course-difficulty"
                        className="text-sm font-medium text-text-primary"
                      >
                        Difficulty
                      </label>
                      <select
                        id="course-difficulty"
                        value={form.difficulty}
                        onChange={(e) =>
                          updateForm({
                            difficulty: e.target.value as DifficultyLevel,
                          })
                        }
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/50"
                      >
                        {["beginner", "intermediate", "advanced"].map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="course-access"
                        className="text-sm font-medium text-text-primary"
                      >
                        Access
                      </label>
                      <select
                        id="course-access"
                        value={form.accessType}
                        onChange={(e) =>
                          updateForm({
                            accessType: e.target.value as AccessType,
                          })
                        }
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/50"
                      >
                        {["free", "paid", "subscription", "enterprise"].map(
                          (a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                    {form.accessType === "paid" && (
                      <Input
                        label="Price (USD)"
                        value={form.price}
                        onChange={(e) => updateForm({ price: e.target.value })}
                        placeholder="40"
                        type="number"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {step === "modules" && (
              <ModuleBuilder modules={modules} onChange={setModules} />
            )}

            {step === "quizzes" && (
              <div>
                <p className="mb-4 text-sm text-text-secondary">
                  These quizzes will be attached to lessons during publishing.
                </p>
                <QuizBuilder quizzes={quizzes} onChange={setQuizzes} />
              </div>
            )}

            {step === "review" && (
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                      Course Summary
                    </p>
                    <h2 className="text-xl font-bold text-text-primary mb-1">
                      {form.title || "Untitled Course"}
                    </h2>
                    <p className="text-sm text-text-secondary">
                      {form.description || "No description."}
                    </p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      {
                        label: "Category",
                        value: mockServiceCategories.find(
                          (c) => c.id === form.categoryId,
                        )?.label,
                      },
                      { label: "Difficulty", value: form.difficulty },
                      {
                        label: "Access",
                        value:
                          form.accessType +
                          (form.price ? ` · $${form.price}` : ""),
                      },
                      {
                        label: "Modules",
                        value: `${modules.length} modules · ${modules.reduce((s, m) => s + m.lessons.length, 0)} lessons`,
                      },
                      {
                        label: "Quizzes",
                        value: `${quizzes.length} questions`,
                      },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs text-text-muted">{label}</p>
                        <p className="text-sm font-medium text-text-primary capitalize">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleSave(true)}
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={saving || !form.title}
                    >
                      {saving ? "Publishing…" : "Publish Course"}
                    </Button>
                    <Button
                      onClick={() => handleSave(false)}
                      variant="secondary"
                      size="md"
                      className="w-full"
                      disabled={saving}
                    >
                      Save as Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => setStep(STEPS[stepIdx - 1].id)}
                disabled={stepIdx === 0}
              >
                ← Previous
              </Button>
              {stepIdx < STEPS.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={() => setStep(STEPS[stepIdx + 1].id)}
                >
                  Next →
                </Button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
