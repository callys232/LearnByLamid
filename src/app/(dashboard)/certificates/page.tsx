import { Award, ExternalLink, QrCode, Printer } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout";
import { Card, CardContent, Badge, EmptyState, SectionHeader, BreadcrumbNav } from "@/components/ui";
import { mockCertificates } from "@/mock/certifications";
import { mockCourses, mockPrograms } from "@/mock/courses";
import { currentUser } from "@/mock/users";

const levelConfig = {
  completion: { label: "Completion", variant: "default" as const },
  skill: { label: "Skill", variant: "primary" as const },
  professional: { label: "Professional", variant: "success" as const },
};

export default function CertificatesPage() {
  const myCerts = mockCertificates.filter((c) => c.userId === currentUser.id);

  function getTitle(cert: (typeof mockCertificates)[0]) {
    if (cert.programId) return mockPrograms.find((p) => p.id === cert.programId)?.title ?? cert.title;
    if (cert.courseId) return mockCourses.find((c) => c.id === cert.courseId)?.title ?? cert.title;
    return cert.title;
  }

  return (
    <div>
      <Header
        title="Certificates"
        subtitle="Your earned credentials and achievements"
        user={currentUser}
      />
      <div className="px-6 pt-4">
        <BreadcrumbNav crumbs={[{ label: "Certificates" }]} />
      </div>

      <div className="px-6 py-6">
        {myCerts.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No certificates yet"
            description="Complete a course or program to earn your first certificate."
          />
        ) : (
          <>
            <SectionHeader
              title="My Certificates"
              description={`${myCerts.length} credential${myCerts.length !== 1 ? "s" : ""} earned`}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myCerts.map((cert) => {
                const cfg = levelConfig[cert.level];
                const issuedDate = new Date(cert.issuedAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                });

                return (
                  <Card key={cert.id} className="group relative overflow-hidden hover:border-primary/30 transition-all">
                    {/* Decorative top bar */}
                    <div className="h-1.5 w-full bg-primary" />
                    <CardContent className="p-5">
                      {/* Icon + level */}
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-muted">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      </div>

                      {/* Title */}
                      <h3 className="mb-1 text-sm font-bold text-text-primary leading-snug">
                        {getTitle(cert)}
                      </h3>
                      <p className="mb-1 text-xs text-text-secondary">Issued to {currentUser.name}</p>
                      <p className="mb-4 text-xs text-text-muted">
                        {issuedDate}
                        {cert.expiresAt && ` · Expires ${new Date(cert.expiresAt).toLocaleDateString("en-US", { year: "numeric", month: "short" })}`}
                      </p>

                      {/* Verification ID */}
                      <div className="mb-4 rounded-lg border border-border bg-background p-2.5">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted mb-0.5">
                          Verification ID
                        </p>
                        <p className="font-mono text-xs text-text-primary">{cert.verificationId}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/certificates/${cert.id}/print`}
                          target="_blank"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover hover:-translate-y-px transition-all"
                        >
                          <Printer className="h-3.5 w-3.5" /> Download PDF
                        </Link>
                        <Link
                          href={`/verify/${cert.verificationId}`}
                          target="_blank"
                          className="flex items-center justify-center gap-1 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-secondary hover:bg-surface-hover hover:border-primary/30 transition-all"
                          aria-label="View public verification page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
