"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  courseId: string;
  amount: number;
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

export function CheckoutForm({ courseId, amount }: CheckoutFormProps) {
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cardBrand = cardNumber.startsWith("4")
    ? "Visa"
    : cardNumber.startsWith("5")
      ? "Mastercard"
      : cardNumber.startsWith("37")
        ? "Amex"
        : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (cardNumber.replace(/\s/g, "").length < 16) {
      setError("Please enter a valid card number.");
      return;
    }
    if (expiry.length < 5) {
      setError("Please enter a valid expiry date.");
      return;
    }
    if (cvc.length < 3) {
      setError("Please enter a valid CVC.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter the cardholder name.");
      return;
    }

    setLoading(true);

    // Swap with: const result = await stripe.confirmPayment(...) when real Stripe is wired
    await new Promise((r) => setTimeout(r, 1800));

    setLoading(false);
    router.push(`/checkout/success?courseId=${courseId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Card number */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary">
          Card number
        </label>
        <div className="relative">
          <input
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 pr-24 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors font-mono"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-text-muted" />
            {cardBrand && (
              <span className="text-xs font-medium text-text-secondary">
                {cardBrand}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expiry + CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">
            Expiry
          </label>
          <input
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            maxLength={5}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">CVC</label>
          <input
            value={cvc}
            onChange={(e) =>
              setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="•••"
            maxLength={4}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors font-mono"
          />
        </div>
      </div>

      {/* Name */}
      <Input
        label="Cardholder name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Amara Osei"
        autoComplete="cc-name"
      />

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 animate-fade-in">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Processing…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Pay ${amount}
          </span>
        )}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
        <Lock className="h-3 w-3" /> Payments secured by Stripe · 256-bit SSL
      </p>
    </form>
  );
}
