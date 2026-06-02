import { GraduationCap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-background-secondary border-r border-border p-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-text-primary">
            LAMID <span className="text-primary">Learn</span>
          </span>
        </div>

        <div>
          <blockquote className="text-xl font-semibold text-text-primary leading-relaxed mb-3">
            "The platform where structured learning meets real-world impact."
          </blockquote>
          <p className="text-sm text-text-secondary">
            Join 4,800+ learners building skills in HCD, software, and business strategy.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { value: "4,800+", label: "Active Learners" },
            { value: "312", label: "Certificates Issued" },
            { value: "5", label: "Expert-led Programs" },
          ].map(({ value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-lg font-bold text-primary">{value}</span>
              <span className="text-sm text-text-secondary">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
