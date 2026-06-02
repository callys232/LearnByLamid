"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  X,
  Send,
  Sparkles,
  ChevronDown,
  Bot,
  RotateCcw,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { mockCourses } from "@/mock/courses";
import { mockLessons } from "@/mock/modules";

// ─── Types ─────────────────────────────────────────────────────────────────

interface ProviderInfo {
  provider: string;
  model: string;
  name: string;
  free: boolean;
  speed: string;
  keySet: boolean;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

interface PageContext {
  courseTitle?: string;
  lessonTitle?: string;
  lessonType?: string;
  category?: string;
  page: string;
}

// ─── Quick prompt chips ─────────────────────────────────────────────────────

const QUICK_PROMPTS = [
  "What should I study next?",
  "Summarise what I just learned",
  "Help me understand this concept",
  "What skills am I missing?",
];

// ─── Context detection from URL ────────────────────────────────────────────

function usePageContext(): PageContext {
  const pathname = usePathname();

  // /courses/[id]/learn/[lessonId]
  const learnMatch = pathname.match(/\/courses\/([^/]+)\/learn\/([^/]+)/);
  if (learnMatch) {
    const course = mockCourses.find((c) => c.id === learnMatch[1]);
    const lesson = mockLessons.find((l) => l.id === learnMatch[2]);
    return {
      courseTitle: course?.title,
      lessonTitle: lesson?.title,
      lessonType: lesson?.type,
      category: course?.categoryId.replace("cat-", "").toUpperCase(),
      page: "lesson",
    };
  }

  // /courses/[id]
  const courseMatch = pathname.match(/\/courses\/([^/]+)/);
  if (courseMatch) {
    const course = mockCourses.find((c) => c.id === courseMatch[1]);
    return { courseTitle: course?.title, page: "course" };
  }

  if (pathname.startsWith("/analytics")) return { page: "analytics" };
  if (pathname.startsWith("/events")) return { page: "events" };
  if (pathname.startsWith("/certificates")) return { page: "certificates" };
  if (pathname.startsWith("/programs")) return { page: "programs" };
  if (pathname.startsWith("/instructor")) return { page: "instructor" };
  if (pathname.startsWith("/admin")) return { page: "admin" };

  return { page: "dashboard" };
}

// ─── Welcome message ────────────────────────────────────────────────────────

function getWelcome(ctx: PageContext): string {
  if (ctx.lessonTitle && ctx.courseTitle) {
    return `Hi! I'm your AI tutor. You're on **${ctx.lessonTitle}** in **${ctx.courseTitle}**. Ask me anything about this lesson.`;
  }
  if (ctx.courseTitle) {
    return `Hi! I can help you with **${ctx.courseTitle}**. What would you like to know?`;
  }
  const pageMap: Record<string, string> = {
    analytics:
      "I can help you interpret your learning analytics and identify areas to improve.",
    events:
      "I can help you decide which lectures to attend and how they fit your learning path.",
    certificates:
      "I can explain your certifications and suggest paths toward your next one.",
    instructor:
      "I can help you design better courses and understand your learner engagement data.",
    dashboard:
      "I'm here to help with anything on the LAMID platform — courses, progress, or learning advice.",
  };
  return `Hi! ${pageMap[ctx.page] ?? "Ask me anything about LAMID Learning."}`;
}

// ─── Storage helpers ────────────────────────────────────────────────────────

function chatKey(page: string, lesson?: string) {
  return `lamid-chat:${page}${lesson ? `:${lesson}` : ""}`;
}

function loadMessages(page: string, lesson?: string): Message[] | null {
  try {
    const raw = localStorage.getItem(chatKey(page, lesson));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Message[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function saveMessages(
  page: string,
  lesson: string | undefined,
  msgs: Message[],
) {
  try {
    localStorage.setItem(chatKey(page, lesson), JSON.stringify(msgs));
  } catch {
    /* storage full or unavailable */
  }
}

// ─── Main component ─────────────────────────────────────────────────────────

export function AiChatWidget() {
  const ctx = usePageContext();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore or reset conversation when page context changes
  useEffect(() => {
    const stored = loadMessages(ctx.page, ctx.lessonTitle);
    if (stored) {
      setMessages(stored);
    } else {
      setMessages([
        { id: "welcome", role: "assistant", content: getWelcome(ctx) },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.page, ctx.lessonTitle]);

  // Persist messages whenever they change (debounced 500ms)
  useEffect(() => {
    if (messages.length === 0) return;
    const t = setTimeout(
      () => saveMessages(ctx.page, ctx.lessonTitle, messages),
      500,
    );
    return () => clearTimeout(t);
  }, [messages, ctx.page, ctx.lessonTitle]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: trimmed,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", streaming: true },
      ]);

      try {
        const historyToSend = [...messages, userMsg]
          .filter((m) => m.id !== "welcome")
          .slice(-10) // keep last 10 messages for context window efficiency
          .map((m) => ({ role: m.role, content: m.content }));

        const res = await fetch("/api/ai/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: historyToSend,
            context: {
              courseTitle: ctx.courseTitle ?? "LAMID Learning Platform",
              lessonTitle: ctx.lessonTitle ?? `${ctx.page} page`,
              lessonType: ctx.lessonType ?? "general",
              category: ctx.category ?? "General",
              progressPct: 0,
            },
          }),
        });

        if (!res.ok || !res.body) throw new Error("Stream failed");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: accumulated } : m,
            ),
          );
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false } : m,
          ),
        );

        if (!open) setUnread((n) => n + 1);
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: "Sorry, I couldn't connect right now. Try again.",
                  streaming: false,
                }
              : m,
          ),
        );
      }

      setLoading(false);
    },
    [ctx, loading, messages, open],
  );

  const panelHeight = expanded ? "h-[640px]" : "h-[480px]";
  const panelWidth = expanded ? "w-96" : "w-80";

  return (
    <>
      {/* ── Floating trigger button ── */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3",
          open &&
            "pointer-events-none opacity-0 transition-opacity duration-200",
        )}
      >
        {/* Tooltip */}
        <div className="group relative">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-primary transition-all duration-200 hover:scale-110 hover:bg-primary-hover hover:shadow-[0_8px_32px_rgba(193,33,41,0.5)] active:scale-95"
            aria-label="Open AI Assistant"
          >
            {/* Ping ring */}
            <span className="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping" />
            <Sparkles className="relative h-6 w-6" />

            {/* Unread badge */}
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary shadow-sm animate-scale-in">
                {unread}
              </span>
            )}
          </button>

          {/* Hover label */}
          <div className="pointer-events-none absolute bottom-16 right-0 whitespace-nowrap rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary shadow-soft opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            Ask AI Assistant
          </div>
        </div>
      </div>

      {/* ── Chat panel ── */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl border border-border bg-background-secondary shadow-soft-lg overflow-hidden",
          panelHeight,
          panelWidth,
          "transition-all duration-300 ease-out-expo",
          open
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-background-tertiary px-4 py-3">
          <div className="flex items-center gap-2.5">
            {/* Branded icon */}
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-primary-sm">
              <Bot className="h-4 w-4 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background-secondary bg-emerald-400" />
            </div>
            <div className="leading-none">
              <p className="text-sm font-semibold text-text-primary">
                LAMID AI
              </p>
              <p className="mt-0.5 text-[10px] text-text-muted">
                Your learning assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Context badge */}
            {ctx.page !== "dashboard" && (
              <Badge variant="primary" className="text-[9px] mr-1 capitalize">
                {ctx.page}
              </Badge>
            )}
            <button
              type="button"
              onClick={() =>
                setMessages([
                  {
                    id: "welcome",
                    role: "assistant",
                    content: getWelcome(ctx),
                  },
                ])
              }
              className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-text-secondary transition-all"
              aria-label="Reset conversation"
              title="Reset conversation"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-text-secondary transition-all"
              aria-label={expanded ? "Compact panel" : "Expand panel"}
              title={expanded ? "Compact" : "Expand"}
            >
              {expanded ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-text-primary transition-all"
              aria-label="Minimize chat"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {msg.role === "assistant" && (
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-muted">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[82%] rounded-2xl px-3 py-2 text-xs leading-relaxed animate-fade-up",
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-surface border border-border text-text-primary rounded-bl-sm",
                )}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br/>"),
                  }}
                />
                {msg.streaming && (
                  <span
                    className="inline-flex gap-0.5 ml-1 align-middle"
                    aria-label="Thinking"
                  >
                    {(
                      [
                        "[animation-delay:0ms]",
                        "[animation-delay:150ms]",
                        "[animation-delay:300ms]",
                      ] as const
                    ).map((delay, i) => (
                      <span
                        key={i}
                        className={`h-1 w-1 rounded-full bg-text-muted animate-bounce ${delay}`}
                      />
                    ))}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts — only show when no conversation yet */}
        {messages.length <= 1 && !loading && (
          <div className="shrink-0 px-4 pb-2">
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] text-text-secondary hover:border-primary/40 hover:bg-primary-muted hover:text-primary transition-all duration-150"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="shrink-0 border-t border-border p-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 focus-within:border-primary/50 focus-within:shadow-[0_0_0_3px_rgba(193,33,41,0.08)] transition-all duration-150">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage(input)
              }
              placeholder={
                ctx.lessonTitle
                  ? `Ask about ${ctx.lessonTitle}…`
                  : "Ask anything…"
              }
              disabled={loading}
              className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <button
              type="button"
              aria-label="Send message"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 hover:scale-105"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-text-muted">
            LAMID AI Assistant
          </p>
        </div>
      </div>
    </>
  );
}
