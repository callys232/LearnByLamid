"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setCurrentUserById } from "@/mock/users";
import { AccountType } from "@/types/types";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setLoading(true);

    const endpoint =
      accountType === "individual"
        ? "/api/auth/register"
        : "/api/auth/request-access";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        accountType,
      }),
    });

    if (response.status === 409) {
      setLoading(false);
      setError(
        "An account already exists for that email. Please sign in instead.",
      );
      return;
    }

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setLoading(false);
      setError(result?.error ?? "Could not create account. Please try again.");
      return;
    }

    const result = await response.json();
    setLoading(false);

    if (result?.user?.id) {
      setCurrentUserById(result.user.id);
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setError(
      "Your account was created, but we could not complete the login flow.",
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Full name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Amara Osei"
        autoComplete="name"
        required
      />
      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        required
      />

      <fieldset className="space-y-3 rounded-2xl border border-border bg-surface p-4">
        <legend className="text-sm font-medium text-text-primary">
          Account type
        </legend>
        <p className="text-sm text-text-secondary">
          Public signup is only available for individual learners. Tenant and
          enterprise accounts require extra verification before access is
          granted.
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              value: "individual" as AccountType,
              label: "Learner",
              description: "Create a learner profile and start right away.",
            },
            {
              value: "tenant" as AccountType,
              label: "Tenant",
              description: "Request access for an organization or team.",
            },
            {
              value: "enterprise" as AccountType,
              label: "Enterprise",
              description: "Request enterprise verification for your company.",
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm transition-colors ${
                accountType === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background"
              }`}
            >
              <input
                type="radio"
                name="accountType"
                value={option.value}
                checked={accountType === option.value}
                onChange={() => setAccountType(option.value)}
                className="sr-only"
              />
              <div className="flex flex-col gap-1">
                <span className="font-medium text-text-primary">
                  {option.label}
                </span>
                <span className="text-xs text-text-secondary">
                  {option.description}
                </span>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="relative">
        <Input
          label="Password"
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          hint="At least 8 characters"
          autoComplete="new-password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPw((p) => !p)}
          className="absolute right-3 top-8 text-text-muted hover:text-text-secondary transition-colors"
        >
          {showPw ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

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
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
          </span>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-xs text-text-muted">
        By signing up you agree to our{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      <p className="text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
