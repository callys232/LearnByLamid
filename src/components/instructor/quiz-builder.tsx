"use client";

import { useState } from "react";
import { Plus, Trash2, Check, ChevronUp, ChevronDown, X } from "lucide-react";

export interface QuizDraft {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

interface QuizBuilderProps {
  quizzes: QuizDraft[];
  onChange: (quizzes: QuizDraft[]) => void;
}

let uid = 2000;
function nextId() { return `qd-${++uid}`; }
function optionLabel(index: number) { return String.fromCharCode(97 + index); } // a, b, c…

export function QuizBuilder({ quizzes, onChange }: QuizBuilderProps) {
  function addQuiz() {
    const q: QuizDraft = {
      id: nextId(),
      question: "",
      options: [
        { id: "a", text: "" },
        { id: "b", text: "" },
        { id: "c", text: "" },
        { id: "d", text: "" },
      ],
      correctOptionId: "a",
      explanation: "",
    };
    onChange([...quizzes, q]);
  }

  function removeQuiz(id: string) {
    onChange(quizzes.filter((q) => q.id !== id));
  }

  function updateQuiz(id: string, patch: Partial<QuizDraft>) {
    onChange(quizzes.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function moveQuiz(id: string, dir: -1 | 1) {
    const idx = quizzes.findIndex((q) => q.id === id);
    if (idx + dir < 0 || idx + dir >= quizzes.length) return;
    const next = [...quizzes];
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    onChange(next);
  }

  function updateOption(quizId: string, optionId: string, text: string) {
    onChange(
      quizzes.map((q) =>
        q.id === quizId
          ? { ...q, options: q.options.map((o) => (o.id === optionId ? { ...o, text } : o)) }
          : q,
      ),
    );
  }

  function addOption(quizId: string) {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz || quiz.options.length >= 6) return;
    const newId = optionLabel(quiz.options.length);
    onChange(quizzes.map((q) =>
      q.id === quizId ? { ...q, options: [...q.options, { id: newId, text: "" }] } : q,
    ));
  }

  function removeOption(quizId: string, optionId: string) {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz || quiz.options.length <= 2) return;
    onChange(quizzes.map((q) => {
      if (q.id !== quizId) return q;
      const opts = q.options.filter((o) => o.id !== optionId);
      const correctId = q.correctOptionId === optionId ? opts[0].id : q.correctOptionId;
      return { ...q, options: opts, correctOptionId: correctId };
    }));
  }

  return (
    <div className="space-y-4">
      {quizzes.length === 0 && (
        <p className="py-6 text-center text-sm text-text-muted">
          No questions yet — add your first question below.
        </p>
      )}

      {quizzes.map((quiz, qi) => (
        <div key={quiz.id} className="rounded-xl border border-border bg-surface p-4 animate-fade-up space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Question {qi + 1}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Move question up"
                disabled={qi === 0}
                onClick={() => moveQuiz(quiz.id, -1)}
                className="text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Move question down"
                disabled={qi === quizzes.length - 1}
                onClick={() => moveQuiz(quiz.id, 1)}
                className="text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Remove question"
                onClick={() => removeQuiz(quiz.id)}
                className="text-text-muted hover:text-red-400 transition-colors ml-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Question text */}
          <textarea
            id={`question-${quiz.id}`}
            value={quiz.question}
            onChange={(e) => updateQuiz(quiz.id, { question: e.target.value })}
            placeholder="Enter your question…"
            rows={2}
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
          />

          {/* Options */}
          <div className="space-y-2">
            <p className="text-xs text-text-muted">
              Click the letter to mark the correct answer
            </p>
            {quiz.options.map((opt) => {
              const isCorrect = quiz.correctOptionId === opt.id;
              return (
                <div key={opt.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={isCorrect ? `Option ${opt.id.toUpperCase()} is the correct answer` : `Mark option ${opt.id.toUpperCase()} as the correct answer`}
                    onClick={() => updateQuiz(quiz.id, { correctOptionId: opt.id })}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-150 ${
                      isCorrect
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-border text-text-muted hover:border-emerald-500/50"
                    }`}
                  >
                    {isCorrect ? <Check className="h-3 w-3" /> : opt.id.toUpperCase()}
                  </button>
                  <input
                    aria-label={`Option ${opt.id.toUpperCase()}`}
                    value={opt.text}
                    onChange={(e) => updateOption(quiz.id, opt.id, e.target.value)}
                    placeholder={`Option ${opt.id.toUpperCase()}…`}
                    className={`flex-1 rounded-lg border px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted bg-background focus:outline-none transition-colors ${
                      isCorrect
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : "border-border focus:border-primary/50"
                    }`}
                  />
                  {quiz.options.length > 2 && (
                    <button
                      type="button"
                      aria-label={`Remove option ${opt.id.toUpperCase()}`}
                      onClick={() => removeOption(quiz.id, opt.id)}
                      className="text-text-muted hover:text-red-400 transition-colors shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}

            {quiz.options.length < 6 && (
              <button
                type="button"
                onClick={() => addOption(quiz.id)}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors mt-1"
              >
                <Plus className="h-3 w-3" /> Add option
              </button>
            )}
          </div>

          {/* Explanation */}
          <input
            aria-label="Explanation (shown after answering)"
            value={quiz.explanation}
            onChange={(e) => updateQuiz(quiz.id, { explanation: e.target.value })}
            placeholder="Explanation shown after answering (optional)…"
            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addQuiz}
        className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-border py-3 text-sm text-text-muted hover:border-primary/40 hover:text-primary transition-all duration-150"
      >
        <Plus className="h-4 w-4" /> Add quiz question
      </button>
    </div>
  );
}
