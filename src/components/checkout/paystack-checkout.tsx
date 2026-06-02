"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Lock, Loader2, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

// Paystack inline JS type
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref: string;
        label?: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

interface PaystackCheckoutProps {
  courseId: string;
  courseTitle: string;
  amount: number; // USD — converted to smallest unit on submit
  currency?: string;
  userEmail: string;
  userId: string;
}

export function PaystackCheckout({
  courseId,
  courseTitle,
  amount,
  currency = "USD",
  userEmail,
  userId,
}: PaystackCheckoutProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";

  function generateRef() {
    return `LAMID_${courseId}_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  }

  function handlePay() {
    if (!ready && !window.PaystackPop) {
      setError("Payment SDK is still loading. Please try again in a moment.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: userEmail,
      amount: amount * 100, // Paystack uses smallest currency unit
      currency,
      ref: generateRef(),
      label: courseTitle,
      metadata: {
        courseId,
        custom_fields: [
          {
            display_name: "Course",
            variable_name: "course",
            value: courseTitle,
          },
        ],
      },

      callback: async (response) => {
        setLoading(true);
        setError("");

        const res = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: response.reference,
            courseId,
            userId,
          }),
        });

        const data = await res.json();
        setLoading(false);

        if (data.status === "success") {
          router.push(`/checkout/success?courseId=${courseId}`);
        } else {
          setError(
            "Payment verification failed. Please contact support if you were charged.",
          );
        }
      },

      onClose: () => {
        // User dismissed — no action needed
      },
    });

    handler.openIframe();
  }

  return (
    <>
      {/* Load Paystack inline JS once */}
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="lazyOnload"
        onLoad={() => setReady(true)}
      />

      <div className="flex flex-col gap-5">
        {/* What you're paying */}
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-text-secondary">{courseTitle}</span>
            <span className="text-sm font-semibold text-text-primary">
              ${amount}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>One-time payment · Lifetime access</span>
            <span className="text-primary font-medium">{currency}</span>
          </div>
        </div>

        {/* Accepted methods */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-medium text-text-secondary">
            Accepted payment methods
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Visa",
              "Mastercard",
              "Bank Transfer",
              "USSD",
              "Mobile Money",
            ].map((m) => (
              <span
                key={m}
                className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-text-secondary"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 animate-fade-in">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-150 active:scale-[0.97]",
            loading
              ? "bg-primary/60 text-white cursor-not-allowed"
              : "bg-primary text-white shadow-primary-sm hover:bg-primary-hover hover:shadow-primary hover:-translate-y-px",
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Verifying payment…
            </>
          ) : !ready ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Loading payment SDK…
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" /> Pay ${amount} with Paystack
            </>
          )}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
          <Lock className="h-3 w-3" />
          Secured by{" "}
          <span className="font-semibold text-text-primary">Paystack</span> ·
          256-bit SSL encryption
        </p>
      </div>
    </>
  );
}
