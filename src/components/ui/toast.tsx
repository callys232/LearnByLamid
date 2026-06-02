"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "info", duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [
        ...prev.slice(-4),
        { id, message, variant, duration },
      ]);
      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx.toast;
}

// ─── Variant config ───────────────────────────────────────────────────────────

const variantConfig: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; classes: string }
> = {
  success: {
    icon: CheckCircle2,
    classes: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  error: {
    icon: AlertCircle,
    classes: "border-red-500/30 bg-red-500/10 text-red-400",
  },
  warning: {
    icon: AlertTriangle,
    classes: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  },
  info: { icon: Info, classes: "border-primary/30 bg-primary/10 text-primary" },
};

// ─── Toaster ─────────────────────────────────────────────────────────────────

function Toaster({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none"
    >
      {toasts.map((t) => {
        const { icon: Icon, classes } = variantConfig[t.variant ?? "info"];
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-soft-lg backdrop-blur-sm animate-fade-up text-sm font-medium min-w-[260px] max-w-[420px]",
              classes,
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-text-primary text-xs leading-snug">
              {t.message}
            </span>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="shrink-0 rounded-md p-0.5 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
