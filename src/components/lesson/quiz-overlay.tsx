"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Quiz } from "@/types/types";

interface QuizOverlayProps {
  quiz: Quiz;
  onComplete: (correct: boolean) => void;
  onDismiss?: () => void;
  isCheckpoint?: boolean;
}

type State = "answering" | "correct" | "incorrect";

export function QuizOverlay({
  quiz,
  onComplete,
  onDismiss,
  isCheckpoint,
}: QuizOverlayProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<State>("answering");

  function handleSubmit() {
    if (!selected) return;
    const correct = selected === quiz.correctOptionId;
    setState(correct ? "correct" : "incorrect");
  }

  function handleContinue() {
    if (state === "correct") {
      onComplete(true);
    } else if (!isCheckpoint) {
      onComplete(false);
    } else {
      // checkpoint: must retry on wrong answer
      setSelected(null);
      setState("answering");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface shadow-soft-lg animate-scale-in">
        {/* Close — only allowed for non-checkpoint */}
        {!isCheckpoint && onDismiss && state === "answering" && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close quiz"
            title="Close"
            className="absolute right-4 top-4 rounded-md p-1 text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="p-6">
          {/* Type badge */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
            {quiz.type === "checkpoint"
              ? "🚧 Checkpoint — must pass to continue"
              : quiz.type === "popup"
                ? "Quick Check"
                : "Quiz"}
          </p>

          {/* Question */}
          <h2 className="mb-5 text-base font-semibold text-text-primary leading-snug">
            {quiz.question}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-2 mb-5">
            {quiz.options.map((opt) => {
              const isSelected = selected === opt.id;
              const isCorrect = opt.id === quiz.correctOptionId;
              const showResult = state !== "answering";

              return (
                <button
                  type="button"
                  key={opt.id}
                  disabled={state !== "answering"}
                  onClick={() => setSelected(opt.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm text-left transition-all duration-150",
                    state === "answering" &&
                      !isSelected &&
                      "border-border bg-background hover:border-primary/40 hover:bg-primary-muted/50",
                    state === "answering" &&
                      isSelected &&
                      "border-primary bg-primary-muted text-primary",
                    showResult &&
                      isCorrect &&
                      "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
                    showResult &&
                      isSelected &&
                      !isCorrect &&
                      "border-red-500/50 bg-red-500/10 text-red-400",
                    showResult &&
                      !isSelected &&
                      !isCorrect &&
                      "border-border bg-background opacity-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all",
                      state === "answering" && isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-border text-text-muted",
                      showResult && isCorrect
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "",
                      showResult && isSelected && !isCorrect
                        ? "border-red-500 bg-red-500 text-white"
                        : "",
                    )}
                  >
                    {opt.id.toUpperCase()}
                  </span>
                  {opt.text}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {state !== "answering" && quiz.explanation && (
            <div
              className={cn(
                "mb-5 flex items-start gap-2 rounded-xl border p-3 text-sm",
                state === "correct"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300",
              )}
            >
              {state === "correct" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              <p>{quiz.explanation}</p>
            </div>
          )}

          {/* Actions */}
          {state === "answering" ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selected}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-primary-sm hover:bg-primary-hover hover:-translate-y-px transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"
            >
              Submit Answer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleContinue}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-primary-sm hover:bg-primary-hover hover:-translate-y-px transition-all duration-150 active:scale-[0.97]"
            >
              {state === "correct" || !isCheckpoint
                ? "Continue →"
                : "Try Again"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
