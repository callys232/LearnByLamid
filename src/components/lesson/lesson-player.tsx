"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PanelRight,
  FileText,
  Presentation,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { QuizOverlay } from "./quiz-overlay";
import { VideoPlayer } from "./video-player";
import { CertificateEarnedModal } from "./certificate-modal";
import { LiveSession } from "./live-session";
import {
  Lesson,
  Quiz,
  LearnerProgress,
  Course,
  LearningEvent,
} from "@/types/types";
import { currentUser } from "@/mock/users";

interface LessonPlayerProps {
  lesson: Lesson;
  prevLessonId: string | null;
  nextLessonId: string | null;
  course: Course;
  courseTitle: string;
  quizzes: Quiz[];
  progress: LearnerProgress | undefined;
  totalLessons: number;
  linkedEvent?: LearningEvent;
  sidebarSlot: React.ReactNode;
}

export function LessonPlayer({
  lesson,
  prevLessonId,
  nextLessonId,
  course,
  courseTitle,
  quizzes,
  progress,
  totalLessons,
  linkedEvent,
  sidebarSlot,
}: LessonPlayerProps) {
  const courseId = course.id;
  const storageKey = `lamid_done_${currentUser.id}_${courseId}`;
  const router = useRouter();
  const [videoProgress, setVideoProgress] = useState(0);
  const [completed, setCompleted] = useState<boolean>(() => {
    const fromProgress =
      progress?.completedLessonIds.includes(lesson.id) ?? false;
    if (typeof window === "undefined") return fromProgress;
    try {
      const stored = JSON.parse(
        localStorage.getItem(storageKey) ?? "[]",
      ) as string[];
      return fromProgress || stored.includes(lesson.id);
    } catch {
      return fromProgress;
    }
  });
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCert, setShowCert] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarWRef = useRef(288); // px, mutated directly during drag

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.width = sidebarOpen
        ? `${sidebarWRef.current}px`
        : "0px";
    }
  }, [sidebarOpen]);

  const completedCount =
    (progress?.completedLessonIds.length ?? 0) + (completed ? 0 : 1);
  const isCourseComplete = !nextLessonId && completedCount >= totalLessons;

  function handleMarkComplete() {
    setCompleted(true);
    try {
      const stored = JSON.parse(
        localStorage.getItem(storageKey) ?? "[]",
      ) as string[];
      if (!stored.includes(lesson.id)) {
        localStorage.setItem(
          storageKey,
          JSON.stringify([...stored, lesson.id]),
        );
      }
    } catch {
      /* storage unavailable */
    }
    if (isCourseComplete) {
      // Auto-issue certificate — show modal instead of navigating
      setShowCert(true);
      return;
    }
    if (nextLessonId) {
      router.push(`/courses/${courseId}/learn/${nextLessonId}`);
    } else {
      router.push(`/courses/${courseId}`);
    }
  }

  function handleQuizComplete(correct: boolean) {
    setActiveQuiz(null);
    if (correct) setVideoProgress((p) => Math.min(p + 15, 90));
  }

  function startResize(e: React.MouseEvent) {
    const startX = e.clientX;
    const startW = sidebarWRef.current;
    function onMove(ev: MouseEvent) {
      const w = Math.min(480, Math.max(200, startW + (startX - ev.clientX)));
      sidebarWRef.current = w;
      if (sidebarRef.current) sidebarRef.current.style.width = `${w}px`;
    }
    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  // Quiz trigger: fire when video passes 40%
  function handleVideoProgress(pct: number) {
    setVideoProgress(pct);
    if (pct >= 40 && videoProgress < 40 && quizzes.length > 0 && !activeQuiz) {
      setActiveQuiz(quizzes[0]);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Certificate modal */}
      {showCert && (
        <CertificateEarnedModal
          courseTitle={courseTitle}
          userName={currentUser.name}
          verificationId={`LAMID-${course.categoryId.toUpperCase().replace("CAT-", "")}-${Date.now().toString(36).toUpperCase()}`}
          onClose={() => {
            setShowCert(false);
            router.push(`/courses/${courseId}`);
          }}
        />
      )}

      {/* Quiz overlay */}
      {activeQuiz && (
        <QuizOverlay
          quiz={activeQuiz}
          onComplete={handleQuizComplete}
          onDismiss={() => setActiveQuiz(null)}
          isCheckpoint={activeQuiz.type === "checkpoint"}
        />
      )}

      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-sm z-10">
        <nav
          className="flex items-center gap-1.5 min-w-0 text-xs"
          aria-label="Breadcrumb"
        >
          <Link
            href="/courses"
            className="shrink-0 text-text-muted hover:text-text-primary transition-colors"
          >
            Courses
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-text-muted" />
          <Link
            href={`/courses/${courseId}`}
            className="shrink-0 text-text-secondary hover:text-text-primary transition-colors max-w-[180px] truncate"
          >
            {courseTitle}
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-text-muted" />
          <span className="text-text-primary font-medium min-w-0">
            {lesson.title}
          </span>
          {completed && (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 ml-1" />
          )}
        </nav>
        <button
          type="button"
          onClick={() => setSidebarOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-secondary hover:bg-surface hover:text-text-primary transition-all"
        >
          <PanelRight className="h-3.5 w-3.5" />
          {sidebarOpen ? "Hide" : "Show"} outline
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {lesson.type === "video" && (
              <VideoPlayer
                contentUrl={lesson.contentUrl}
                title={lesson.title}
                lessonId={lesson.id}
                courseId={courseId}
                onProgress={handleVideoProgress}
              />
            )}
            {lesson.type === "text" && <TextContent lesson={lesson} />}
            {lesson.type === "slides" && <SlidesContent lesson={lesson} />}
            {lesson.type === "live" && (
              <LiveSession
                event={linkedEvent ?? null}
                lessonTitle={lesson.title}
              />
            )}
          </div>

          {/* Nav bar */}
          <div className="shrink-0 border-t border-border bg-background/90 px-6 py-3 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <Link
                href={
                  prevLessonId
                    ? `/courses/${courseId}/learn/${prevLessonId}`
                    : `/courses/${courseId}`
                }
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary hover:border-border-strong hover:bg-surface-hover hover:text-text-primary transition-all duration-150"
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </Link>

              <button
                type="button"
                onClick={() => setActiveQuiz(quizzes[0] ?? null)}
                disabled={quizzes.length === 0}
                className="text-xs text-text-muted hover:text-primary transition-colors disabled:opacity-0"
              >
                Take quiz ({quizzes.length})
              </button>

              <button
                type="button"
                onClick={handleMarkComplete}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-150 active:scale-[0.97]",
                  completed
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                    : "bg-primary text-white shadow-primary-sm hover:bg-primary-hover hover:shadow-primary hover:-translate-y-px",
                )}
              >
                {completed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />{" "}
                    {nextLessonId ? "Go to next" : "Course done!"}
                  </>
                ) : (
                  <>
                    {nextLessonId ? (
                      <>
                        Complete & Next <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      "Complete course"
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar — width set imperatively via sidebarRef to avoid inline style */}
        <div
          ref={sidebarRef}
          className={cn(
            "relative shrink-0 overflow-hidden transition-[width] duration-300",
            sidebarOpen ? "border-l border-border" : "",
          )}
        >
          <div
            onMouseDown={startResize}
            className="absolute left-0 top-0 bottom-0 w-1 z-10 cursor-col-resize hover:bg-primary/30 transition-colors"
            aria-hidden="true"
          />
          {sidebarSlot}
        </div>
      </div>

      {/* AI Tutor */}
      {/* AI chat provided by the global AiChatWidget in the dashboard layout */}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function TextContent({ lesson }: { lesson: Lesson }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-bold text-text-primary">{lesson.title}</h1>
      </div>
      <div className="prose prose-invert max-w-none space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>
          This lesson covers the foundational concepts behind{" "}
          <strong className="text-text-primary">{lesson.title}</strong>. As you
          read through, pay attention to key principles and how they connect to
          what you&apos;ve already learned.
        </p>
        <h2 className="text-base font-semibold text-text-primary mt-6">
          Core Concepts
        </h2>
        <p>
          The framework introduced here builds on previous modules. The goal is
          not just to memorise definitions, but to understand how each concept
          applies in real-world design and product contexts.
        </p>
        <h2 className="text-base font-semibold text-text-primary mt-6">
          Key Takeaways
        </h2>
        <ul className="space-y-2 list-disc list-inside">
          <li>Understand the underlying principle before its application</li>
          <li>Connect this concept to earlier lessons in the module</li>
          <li>
            Think about one real example where this applies in your context
          </li>
        </ul>
        <p className="mt-6 rounded-xl border border-primary/20 bg-primary-muted p-4 text-xs">
          💡 <strong className="text-primary">AI Tutor tip:</strong> Click the
          sparkle button in the bottom right to ask your AI tutor questions
          about this lesson.
        </p>
      </div>
    </div>
  );
}

function SlidesContent({ lesson }: { lesson: Lesson }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { title: "Overview", body: `Introduction to ${lesson.title}` },
    {
      title: "Key Concepts",
      body: "The core principles and their applications in practice.",
    },
    {
      title: "Examples",
      body: "Real-world examples that illustrate the concepts covered.",
    },
    { title: "Summary", body: "What we covered and what to expect next." },
  ];
  const current = slides[slide];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-4 flex items-center gap-2">
          <Presentation className="h-5 w-5 text-primary" />
          <span className="text-xs text-text-muted">
            {lesson.title} · Slide {slide + 1} of {slides.length}
          </span>
        </div>
        <div className="rounded-2xl border border-border bg-surface shadow-soft-lg p-10 min-h-64 flex flex-col items-center justify-center text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            {current.title}
          </h2>
          <p className="text-text-secondary max-w-md">{current.body}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSlide((s) => Math.max(0, s - 1))}
            disabled={slide === 0}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:-translate-y-px transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            ← Prev
          </button>
          <div className="flex gap-1.5">
            {slides.map((s, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                aria-current={i === slide ? "true" : undefined}
                onClick={() => setSlide(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === slide
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-border hover:bg-border-strong",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSlide((s) => Math.min(slides.length - 1, s + 1))}
            disabled={slide === slides.length - 1}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:-translate-y-px transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            Next →
          </button>
        </div>
        <div className="mt-3">
          <Progress
            value={Math.round(((slide + 1) / slides.length) * 100)}
            size="xs"
          />
        </div>
      </div>
    </div>
  );
}
