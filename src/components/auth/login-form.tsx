"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setCurrentUserByEmail } from "@/mock/users";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(
        result.error === "CredentialsSignin"
          ? "Invalid email or password. Try amara@lamid.co with any password."
          : result.error,
      );
      return;
    }

    setCurrentUserByEmail(email);
    router.push(redirect);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="amara@lamid.co"
        autoComplete="email"
        required
      />

      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <Input
            label="Password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
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
        <Link
          href="/forgot-password"
          className="self-end text-xs text-primary hover:underline"
        >
          Forgot password?
        </Link>
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
            <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
          </span>
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Sign up free
        </Link>
      </p>
    </form>
  );
}
