import { CheckCircle2, XCircle, Award, ExternalLink } from "lucide-react";
import { mockCertificates } from "@/mock/certifications";
import { mockCourses, mockPrograms } from "@/mock/courses";
import { mockUsers } from "@/mock/users";
import { GraduationCap } from "lucide-react";

interface PageProps { params: Promise<{ id: string }> }

export default async function VerifyPage({ params }: PageProps) {
  const { id } = await params;
  const cert = mockCertificates.find((c) => c.verificationId === id || c.id === id);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-primary-sm">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-text-primary">LAMID <span className="text-primary">Learn</span></span>
      </div>

      <div className="w-full max-w-md">
        {cert ? (
          <ValidCert cert={cert} />
        ) : (
          <InvalidCert id={id} />
        )}
      </div>

      <p className="mt-8 text-xs text-text-muted">
        Certificate verification · LAMID Learning Platform
      </p>
    </div>
  );
}

function ValidCert({ cert }: { cert: (typeof mockCertificates)[0] }) {
  const user    = mockUsers.find((u) => u.id === cert.userId);
  const course  = cert.courseId  ? mockCourses.find((c)  => c.id === cert.courseId)  : null;
  const program = cert.programId ? mockPrograms.find((p) => p.id === cert.programId) : null;
  const title   = program?.title ?? course?.title ?? cert.title;
  const isExpired = cert.expiresAt ? new Date(cert.expiresAt) < new Date() : false;

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-surface overflow-hidden shadow-soft-lg animate-scale-in">
      <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-400" />
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          {isExpired
            ? <XCircle className="h-8 w-8 text-red-400 shrink-0" />
            : <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0" />
          }
          <div>
            <p className={`text-lg font-bold ${isExpired ? "text-red-400" : "text-emerald-400"}`}>
              {isExpired ? "Certificate Expired" : "Certificate Verified ✓"}
            </p>
            <p className="text-xs text-text-muted">This credential is {isExpired ? "no longer" : ""} valid</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-muted shrink-0">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-base font-bold text-text-primary">{title}</p>
              <p className="text-xs text-text-muted capitalize">{cert.level} certificate</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4 space-y-2.5 text-sm">
            <Row label="Issued to"   value={user?.name ?? "—"} />
            <Row label="Issued on"   value={new Date(cert.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />
            {cert.expiresAt && <Row label="Expires"    value={new Date(cert.expiresAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />}
            <Row label="Issued by"   value="LAMID Learning Platform" />
            <Row label="Verification ID" value={cert.verificationId} mono />
          </div>
        </div>
      </div>
    </div>
  );
}

function InvalidCert({ id }: { id: string }) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-surface overflow-hidden shadow-soft-lg animate-scale-in">
      <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-400" />
      <div className="p-8 text-center">
        <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-text-primary mb-2">Certificate Not Found</h2>
        <p className="text-sm text-text-secondary mb-4">
          No certificate with ID <span className="font-mono text-xs bg-surface-active px-1.5 py-0.5 rounded">{id}</span> was found.
          It may have been revoked or the ID is incorrect.
        </p>
        <a href="/" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
          <ExternalLink className="h-3.5 w-3.5" /> Return to LAMID Learn
        </a>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-text-muted shrink-0">{label}</span>
      <span className={`text-xs text-text-primary text-right ${mono ? "font-mono" : "font-medium"}`}>{value}</span>
    </div>
  );
}
