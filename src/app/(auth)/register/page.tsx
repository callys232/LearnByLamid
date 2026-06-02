import { GraduationCap } from "lucide-react";
import { RegisterForm } from "@/components/auth";

export const metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex lg:hidden items-center gap-2 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-text-primary">LAMID <span className="text-primary">Learn</span></span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
        <p className="mt-1 text-sm text-text-secondary">Start learning for free — no credit card required</p>
      </div>

      <RegisterForm />
    </div>
  );
}
