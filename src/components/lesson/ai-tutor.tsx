"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

interface AiTutorProps {
  lessonTitle: string;
  courseTitle: string;
  lessonType?: string;
  category?: string;
  progressPct?: number;
  quizAvgScore?: number;
}

export function AiTutor({
  lessonTitle,
  courseTitle,
  lessonType = "video",
  category = "General",
  progressPct = 0,
  quizAvgScore,
}: AiTutorProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: `Hi! I'm your AI tutor for **${courseTitle}**. Ask me anything about **${lessonTitle}** — I'm here to help you understand the concepts and apply them.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Create placeholder assistant message for streaming
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", streaming: true },
    ]);

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: {
            courseTitle,
            lessonTitle,
            lessonType,
            category,
            progressPct,
            quizAvgScore,
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
        // Update streaming message in real-time
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: accumulated, streaming: !done }
              : m,
          ),
        );
      }

      // Mark stream complete
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, streaming: false } : m,
        ),
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Sorry, I couldn't connect right now. Please try again.",
                streaming: false,
              }
            : m,
        ),
      );
    }

    setLoading(false);
  }

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Open AI Tutor"
        className={cn(
          "fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-primary",
          "hover:bg-primary-hover hover:scale-110 active:scale-95 transition-all duration-150",
          open && "opacity-0 pointer-events-none",
        )}
        aria-label="Open AI Tutor"
      >
        <Sparkles className="h-5 w-5" />
      </button>

      {/* Panel */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-50 flex h-[520px] w-80 flex-col border-l border-t border-border bg-background-secondary shadow-soft-lg rounded-tl-2xl",
          "transition-transform duration-300 ease-out-expo",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-muted">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                AI Tutor
              </p>
              <p className="text-[10px] text-text-muted">Powered by Claude</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close AI Tutor"
            className="rounded-md p-1 text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-surface border border-border text-text-primary rounded-bl-sm",
                )}
              >
                {/* Render basic markdown bold */}
                <span
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br/>"),
                  }}
                />
                {msg.streaming && (
                  <span className="inline-flex gap-0.5 ml-1 align-middle" aria-label="Thinking">
                    {(["[animation-delay:0ms]","[animation-delay:150ms]","[animation-delay:300ms]"] as const).map((delay, i) => (
                      <span key={i} className={`h-1 w-1 rounded-full bg-text-muted animate-bounce ${delay}`} />
                    ))}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 focus-within:border-primary/50 transition-colors">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              placeholder="Ask about this lesson…"
              disabled={loading}
              className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <button
              type="button"
              aria-label="Send message"
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            >
              <Send className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
