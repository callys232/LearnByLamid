"use client";

import Link from "next/link";
import { Award, Download, ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CertificateEarnedModalProps {
  courseTitle: string;
  userName: string;
  verificationId: string;
  onClose: () => void;
}

export function CertificateEarnedModal({
  courseTitle,
  userName,
  verificationId,
  onClose,
}: CertificateEarnedModalProps) {
  const issuedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface shadow-soft-lg animate-scale-in overflow-hidden">
        {/* Shimmer top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          title="Close"
          className="absolute right-4 top-4 rounded-md p-1 text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-muted border border-primary/20 shadow-primary animate-pop">
            <Award className="h-8 w-8 text-primary" />
          </div>

          {/* Congrats */}
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Course Complete 🎉
          </p>
          <h2 className="mb-1 text-xl font-bold text-text-primary">
            Certificate Earned!
          </h2>
          <p className="mb-6 text-sm text-text-secondary">
            Congratulations, {userName}. You&apos;ve completed the course.
          </p>

          {/* Certificate preview */}
          <div className="mb-6 rounded-xl border border-primary/20 bg-background p-5 text-left shadow-soft">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-primary-muted flex items-center justify-center">
                <Award className="h-3 w-3 text-primary" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                LAMID Learning Certificate
              </span>
            </div>
            <p className="text-base font-bold text-text-primary leading-snug mb-1">
              {courseTitle}
            </p>
            <p className="text-xs text-text-secondary">
              Awarded to{" "}
              <span className="font-semibold text-text-primary">
                {userName}
              </span>
            </p>
            <p className="text-xs text-text-muted mt-1">{issuedDate}</p>
            <p className="mt-2 font-mono text-[10px] text-text-muted">
              {verificationId}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-primary-sm hover:bg-primary-hover hover:-translate-y-px transition-all active:scale-[0.97]"
            >
              <Download className="h-4 w-4" /> Download Certificate
            </button>
            <Link
              href="/certificates"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-text-primary hover:bg-surface-hover hover:-translate-y-px transition-all"
            >
              <ExternalLink className="h-4 w-4" /> View All Certificates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
