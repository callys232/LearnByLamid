"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, X, BookOpen, Layers, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mockCourses, mockPrograms } from "@/mock/courses";
import { mockEvents } from "@/mock/events";

interface Result {
  id: string;
  type: "course" | "program" | "event";
  title: string;
  subtitle: string;
  href: string;
}

const ICON = {
  course:  BookOpen,
  program: Layers,
  event:   Calendar,
} as const;

const TYPE_LABEL = {
  course:  "Course",
  program: "Program",
  event:   "Event",
} as const;

function buildIndex(): Result[] {
  return [
    ...mockCourses.map((c) => ({
      id: c.id,
      type: "course" as const,
      title: c.title,
      subtitle: c.description?.slice(0, 80) + "…",
      href: `/courses/${c.id}`,
    })),
    ...mockPrograms.map((p) => ({
      id: p.id,
      type: "program" as const,
      title: p.title,
      subtitle: p.description?.slice(0, 80) + "…",
      href: `/programs/${p.id}`,
    })),
    ...mockEvents.map((e) => ({
      id: e.id,
      type: "event" as const,
      title: e.title,
      subtitle: e.description?.slice(0, 80) + "…",
      href: `/events`,
    })),
  ];
}

const INDEX = buildIndex();

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-primary rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery]       = useState("");
  const [active, setActive]     = useState(0);
  const [mounted, setMounted]   = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);
  const pathname                = usePathname();

  // Only render portal after hydration
  useEffect(() => { setMounted(true); }, []);

  // Close on navigation
  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open ? onClose() : void 0;
      }
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = query.trim().length < 1 ? [] : INDEX.filter((r) => {
    const q = query.toLowerCase();
    return r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q);
  }).slice(0, 8);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === "Enter" && results[active]) {
      onClose();
    }
  }, [results, active, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel — stop propagation so clicks inside don't close the modal */}
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface shadow-soft-lg overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="h-4 w-4 shrink-0 text-text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search courses, programs, events…"
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="text-text-muted hover:text-text-secondary transition-colors">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-text-muted font-mono">
            Esc
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="max-h-[380px] overflow-y-auto py-2">
            {results.map((r, i) => {
              const Icon = ICON[r.type];
              return (
                <li key={r.id}>
                  <Link
                    href={r.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 transition-colors",
                      i === active ? "bg-surface-hover" : "hover:bg-surface-hover",
                    )}
                    onMouseEnter={() => setActive(i)}
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-muted">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {highlight(r.title, query)}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{r.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                      <span className="text-[10px] text-text-muted border border-border rounded px-1.5 py-0.5">
                        {TYPE_LABEL[r.type]}
                      </span>
                      {i === active && <ArrowRight className="h-3 w-3 text-text-muted" />}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty state */}
        {query.trim().length > 0 && results.length === 0 && (
          <div className="px-4 py-10 text-center text-sm text-text-muted">
            No results for <span className="font-medium text-text-secondary">"{query}"</span>
          </div>
        )}

        {/* Hint when idle */}
        {query.trim().length === 0 && (
          <div className="px-4 py-6 text-center text-xs text-text-muted">
            Search across courses, programs, and events
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 text-[10px] text-text-muted">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> open</span>
          <span><kbd className="font-mono">Esc</kbd> close</span>
          <span className="ml-auto"><kbd className="font-mono">Ctrl K</kbd> toggle</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
