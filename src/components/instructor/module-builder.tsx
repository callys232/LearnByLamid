"use client";

import { useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  GripVertical,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Video,
  FileText,
  Presentation,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonType } from "@/types/types";

export interface LessonDraft {
  id: string;
  title: string;
  type: LessonType;
  durationMinutes: number;
}

export interface ModuleDraft {
  id: string;
  title: string;
  description: string;
  lessons: LessonDraft[];
}

const LESSON_TYPES: {
  value: LessonType;
  label: string;
  Icon: React.ElementType;
}[] = [
  { value: "video", label: "Video", Icon: Video },
  { value: "text", label: "Article", Icon: FileText },
  { value: "slides", label: "Slides", Icon: Presentation },
  { value: "download", label: "Download", Icon: Download },
];

interface ModuleBuilderProps {
  modules: ModuleDraft[];
  onChange: (modules: ModuleDraft[]) => void;
}

let uid = 1000;
function nextId() {
  return `draft-${++uid}`;
}

export function ModuleBuilder({ modules, onChange }: ModuleBuilderProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [dragModId, setDragModId] = useState<string | null>(null);
  const [dragOverModId, setDragOverModId] = useState<string | null>(null);
  const [dragLesson, setDragLesson] = useState<{
    modId: string;
    lessonId: string;
  } | null>(null);
  const [dragOverLessonId, setDragOverLessonId] = useState<string | null>(null);
  const pendingFocusId = useRef<string | null>(null);

  // ── CRUD ─────────────────────────────────────────────────────────────────

  function addModule() {
    const m: ModuleDraft = {
      id: nextId(),
      title: "",
      description: "",
      lessons: [],
    };
    onChange([...modules, m]);
    setExpanded((e) => ({ ...e, [m.id]: true }));
    pendingFocusId.current = m.id;
  }

  function removeModule(id: string) {
    onChange(modules.filter((m) => m.id !== id));
  }

  function duplicateModule(id: string) {
    const src = modules.find((m) => m.id === id);
    if (!src) return;
    const copy: ModuleDraft = {
      ...src,
      id: nextId(),
      title: src.title ? `${src.title} (copy)` : "",
      lessons: src.lessons.map((l) => ({ ...l, id: nextId() })),
    };
    const idx = modules.findIndex((m) => m.id === id);
    const next = [...modules];
    next.splice(idx + 1, 0, copy);
    onChange(next);
  }

  function moveModule(id: string, dir: -1 | 1) {
    const idx = modules.findIndex((m) => m.id === id);
    if (idx + dir < 0 || idx + dir >= modules.length) return;
    const next = [...modules];
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    onChange(next);
  }

  function updateModule(id: string, patch: Partial<ModuleDraft>) {
    onChange(modules.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function addLesson(modId: string) {
    const l: LessonDraft = {
      id: nextId(),
      title: "",
      type: "video",
      durationMinutes: 10,
    };
    updateModule(modId, {
      lessons: [...(modules.find((m) => m.id === modId)?.lessons ?? []), l],
    });
  }

  function removeLesson(modId: string, lessonId: string) {
    updateModule(modId, {
      lessons:
        modules
          .find((m) => m.id === modId)
          ?.lessons.filter((l) => l.id !== lessonId) ?? [],
    });
  }

  function duplicateLesson(modId: string, lessonId: string) {
    const mod = modules.find((m) => m.id === modId);
    const src = mod?.lessons.find((l) => l.id === lessonId);
    if (!src || !mod) return;
    const copy = {
      ...src,
      id: nextId(),
      title: src.title ? `${src.title} (copy)` : "",
    };
    const idx = mod.lessons.findIndex((l) => l.id === lessonId);
    const next = [...mod.lessons];
    next.splice(idx + 1, 0, copy);
    updateModule(modId, { lessons: next });
  }

  function moveLesson(modId: string, lessonId: string, dir: -1 | 1) {
    const mod = modules.find((m) => m.id === modId);
    if (!mod) return;
    const idx = mod.lessons.findIndex((l) => l.id === lessonId);
    if (idx + dir < 0 || idx + dir >= mod.lessons.length) return;
    const next = [...mod.lessons];
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    updateModule(modId, { lessons: next });
  }

  function updateLesson(
    modId: string,
    lessonId: string,
    patch: Partial<LessonDraft>,
  ) {
    updateModule(modId, {
      lessons:
        modules
          .find((m) => m.id === modId)
          ?.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)) ??
        [],
    });
  }

  // ── Module drag-and-drop ──────────────────────────────────────────────────

  function onModDragStart(e: React.DragEvent, id: string) {
    setDragModId(id);
    e.dataTransfer.effectAllowed = "move";
  }
  function onModDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (id !== dragModId) setDragOverModId(id);
  }
  function onModDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (!dragModId || dragModId === targetId) return;
    const from = modules.findIndex((m) => m.id === dragModId);
    const to = modules.findIndex((m) => m.id === targetId);
    const next = [...modules];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
    setDragModId(null);
    setDragOverModId(null);
  }
  function onModDragEnd() {
    setDragModId(null);
    setDragOverModId(null);
  }

  // ── Lesson drag-and-drop ──────────────────────────────────────────────────

  function onLessonDragStart(
    e: React.DragEvent,
    modId: string,
    lessonId: string,
  ) {
    e.stopPropagation();
    setDragLesson({ modId, lessonId });
    e.dataTransfer.effectAllowed = "move";
  }
  function onLessonDragOver(e: React.DragEvent, lessonId: string) {
    e.preventDefault();
    e.stopPropagation();
    if (lessonId !== dragLesson?.lessonId) setDragOverLessonId(lessonId);
  }
  function onLessonDrop(
    e: React.DragEvent,
    targetModId: string,
    targetLessonId: string,
  ) {
    e.preventDefault();
    e.stopPropagation();
    if (
      !dragLesson ||
      dragLesson.lessonId === targetLessonId ||
      dragLesson.modId !== targetModId
    )
      return;
    const mod = modules.find((m) => m.id === targetModId);
    if (!mod) return;
    const from = mod.lessons.findIndex((l) => l.id === dragLesson.lessonId);
    const to = mod.lessons.findIndex((l) => l.id === targetLessonId);
    const next = [...mod.lessons];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    updateModule(targetModId, { lessons: next });
    setDragLesson(null);
    setDragOverLessonId(null);
  }
  function onLessonDragEnd() {
    setDragLesson(null);
    setDragOverLessonId(null);
  }

  return (
    <div className="space-y-3">
      {modules.length === 0 && (
        <p className="py-6 text-center text-sm text-text-muted">
          No modules yet — add your first module below.
        </p>
      )}

      {modules.map((mod, i) => {
        const open = expanded[mod.id] ?? false;
        const isDragging = dragModId === mod.id;
        const isDragOver = dragOverModId === mod.id;

        return (
          <div
            key={mod.id}
            draggable
            onDragStart={(e) => onModDragStart(e, mod.id)}
            onDragOver={(e) => onModDragOver(e, mod.id)}
            onDrop={(e) => onModDrop(e, mod.id)}
            onDragEnd={onModDragEnd}
            className={cn(
              "rounded-xl border bg-surface overflow-hidden transition-all duration-150",
              isDragging ? "opacity-40 border-primary/40" : "border-border",
              isDragOver ? "border-primary ring-1 ring-primary/30" : "",
            )}
          >
            {/* Module header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-hover">
              {/* Desktop: drag handle */}
              <GripVertical className="hidden md:block h-4 w-4 text-text-muted shrink-0 cursor-grab active:cursor-grabbing" />

              {/* Mobile: up/down reorder */}
              <div className="flex flex-col gap-0.5 md:hidden shrink-0">
                <button
                  type="button"
                  aria-label="Move module up"
                  disabled={i === 0}
                  onClick={() => moveModule(mod.id, -1)}
                  className="text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  aria-label="Move module down"
                  disabled={i === modules.length - 1}
                  onClick={() => moveModule(mod.id, 1)}
                  className="text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>

              <span className="text-xs font-bold text-text-muted w-5 shrink-0">
                {i + 1}
              </span>
              <input
                ref={(el) => {
                  if (pendingFocusId.current === mod.id && el) {
                    el.focus();
                    pendingFocusId.current = null;
                  }
                }}
                aria-label="Module title"
                value={mod.title}
                onChange={(e) =>
                  updateModule(mod.id, { title: e.target.value })
                }
                placeholder="Module title…"
                className="flex-1 bg-transparent text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none min-w-0"
              />
              <span className="text-xs text-text-muted shrink-0">
                {mod.lessons.length} lessons
              </span>
              <button
                type="button"
                aria-label="Duplicate module"
                onClick={() => duplicateModule(mod.id)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label={open ? "Collapse module" : "Expand module"}
                onClick={() => setExpanded((e) => ({ ...e, [mod.id]: !open }))}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                {open ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                aria-label="Remove module"
                onClick={() => removeModule(mod.id)}
                className="text-text-muted hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {open && (
              <div className="px-4 pb-4 pt-2 space-y-2">
                <input
                  aria-label="Module description"
                  value={mod.description}
                  onChange={(e) =>
                    updateModule(mod.id, { description: e.target.value })
                  }
                  placeholder="Module description (optional)…"
                  className="w-full bg-transparent text-xs text-text-secondary placeholder:text-text-muted focus:outline-none mb-3"
                />

                {mod.lessons.map((lesson, li) => {
                  const isLessonDragging = dragLesson?.lessonId === lesson.id;
                  const isLessonDragOver = dragOverLessonId === lesson.id;
                  return (
                    <div
                      key={lesson.id}
                      draggable
                      onDragStart={(e) =>
                        onLessonDragStart(e, mod.id, lesson.id)
                      }
                      onDragOver={(e) => onLessonDragOver(e, lesson.id)}
                      onDrop={(e) => onLessonDrop(e, mod.id, lesson.id)}
                      onDragEnd={onLessonDragEnd}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border bg-background px-3 py-2 transition-all duration-150",
                        isLessonDragging
                          ? "opacity-40 border-primary/40"
                          : "border-border",
                        isLessonDragOver
                          ? "border-primary ring-1 ring-primary/30"
                          : "",
                      )}
                    >
                      {/* Desktop: drag handle */}
                      <GripVertical className="hidden md:block h-3.5 w-3.5 text-text-muted shrink-0 cursor-grab active:cursor-grabbing" />

                      {/* Mobile: up/down */}
                      <div className="flex flex-col gap-0.5 md:hidden shrink-0">
                        <button
                          type="button"
                          aria-label="Move lesson up"
                          disabled={li === 0}
                          onClick={() => moveLesson(mod.id, lesson.id, -1)}
                          className="text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
                        >
                          <ChevronUp className="h-2.5 w-2.5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Move lesson down"
                          disabled={li === mod.lessons.length - 1}
                          onClick={() => moveLesson(mod.id, lesson.id, 1)}
                          className="text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
                        >
                          <ChevronDown className="h-2.5 w-2.5" />
                        </button>
                      </div>

                      <span className="text-[10px] text-text-muted w-4 shrink-0 tabular-nums">
                        {li + 1}
                      </span>

                      {/* Lesson type icon toggles */}
                      <div
                        className="flex gap-0.5 shrink-0"
                        role="group"
                        aria-label="Lesson type"
                      >
                        {LESSON_TYPES.map(({ value, label, Icon }) => (
                          <button
                            key={value}
                            type="button"
                            title={
                              lesson.type === value
                                ? `${label} (selected)`
                                : label
                            }
                            onClick={() =>
                              updateLesson(mod.id, lesson.id, { type: value })
                            }
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-md transition-all duration-100",
                              lesson.type === value
                                ? "bg-primary text-white"
                                : "text-text-muted hover:text-text-secondary hover:bg-surface",
                            )}
                          >
                            <Icon className="h-3 w-3" />
                          </button>
                        ))}
                      </div>

                      <input
                        aria-label="Lesson title"
                        value={lesson.title}
                        onChange={(e) =>
                          updateLesson(mod.id, lesson.id, {
                            title: e.target.value,
                          })
                        }
                        placeholder="Lesson title…"
                        className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none min-w-0"
                      />

                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number"
                          aria-label="Duration in minutes"
                          value={lesson.durationMinutes}
                          onChange={(e) =>
                            updateLesson(mod.id, lesson.id, {
                              durationMinutes: Number(e.target.value),
                            })
                          }
                          className="w-12 bg-surface border border-border rounded-md px-1.5 py-1 text-xs text-text-secondary text-center focus:outline-none focus:border-primary/50"
                          min={1}
                        />
                        <span className="text-[10px] text-text-muted">min</span>
                      </div>

                      <button
                        type="button"
                        aria-label="Duplicate lesson"
                        onClick={() => duplicateLesson(mod.id, lesson.id)}
                        className="text-text-muted hover:text-text-primary transition-colors shrink-0"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        aria-label="Remove lesson"
                        onClick={() => removeLesson(mod.id, lesson.id)}
                        className="text-text-muted hover:text-red-400 transition-colors shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => addLesson(mod.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-text-muted hover:border-primary/40 hover:text-primary transition-all w-full"
                >
                  <Plus className="h-3.5 w-3.5" /> Add lesson
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addModule}
        className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-border py-3 text-sm text-text-muted hover:border-primary/40 hover:text-primary transition-all duration-150"
      >
        <Plus className="h-4 w-4" /> Add module
      </button>
    </div>
  );
}
