"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  pages,
  total,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  if (pages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const getPages = () => {
    const list: (number | "…")[] = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) list.push(i);
    } else {
      list.push(1);
      if (page > 3) list.push("…");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(pages - 1, page + 1);
        i++
      )
        list.push(i);
      if (page < pages - 2) list.push("…");
      list.push(pages);
    }
    return list;
  };

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <p className="text-xs text-text-muted">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-1">
        <PagBtn
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </PagBtn>
        {getPages().map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="px-1.5 text-xs text-text-muted select-none"
            >
              …
            </span>
          ) : (
            <PagBtn
              key={p}
              active={p === page}
              onClick={() => onPageChange(p as number)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </PagBtn>
          ),
        )}
        <PagBtn
          disabled={page === pages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </PagBtn>
      </div>
    </div>
  );
}

function PagBtn({
  children,
  active,
  disabled,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  [k: string]: unknown;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-7 min-w-[28px] items-center justify-center rounded-md px-1.5 text-xs font-medium transition-all duration-150",
        active
          ? "bg-primary text-white shadow-primary-sm scale-105"
          : "text-text-secondary hover:bg-surface hover:text-text-primary",
        disabled && "pointer-events-none opacity-30",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
