import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex lg:hidden items-center gap-2 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-text-primary">LAMID <span className="text-primary">Learn</span></span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-text-primary">Reset your password</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <form className="flex flex-col gap-4">
        <Input label="Email address" type="email" placeholder="you@example.com" autoComplete="email" />
        <Button type="submit" variant="primary" size="lg" className="w-full">
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-text-secondary">
        Remember it?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
