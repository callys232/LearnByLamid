import { notFound } from "next/navigation";
import { mockCertificates } from "@/mock/certifications";
import { mockCourses, mockPrograms } from "@/mock/courses";
import { mockUsers } from "@/mock/users";
import { QrCodeImage } from "@/components/ui/qr-code";

interface PageProps { params: Promise<{ id: string }> }

export default async function CertificatePrintPage({ params }: PageProps) {
  const { id } = await params;
  const cert  = mockCertificates.find((c) => c.id === id || c.verificationId === id);
  if (!cert) notFound();

  const user    = mockUsers.find((u) => u.id === cert.userId);
  const course  = cert.courseId  ? mockCourses.find((c)  => c.id === cert.courseId)  : null;
  const program = cert.programId ? mockPrograms.find((p) => p.id === cert.programId) : null;
  const title   = program?.title ?? course?.title ?? cert.title;

  const verifyUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/verify/${cert.verificationId}`;

  const issuedDate = new Date(cert.issuedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      {/* Print trigger — hidden when printing */}
      <div className="no-print fixed right-6 top-6 flex gap-3 z-10">
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-primary-sm hover:bg-primary-hover transition-all"
        >
          Download PDF
        </button>
        <button
          onClick={() => window.history.back()}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover transition-all"
        >
          Back
        </button>
      </div>

      {/* Certificate — A4 optimized */}
      <div
        id="certificate"
        className="min-h-screen bg-white flex items-center justify-center p-8"
        style={{ fontFamily: "Georgia, serif" }}
      >
        <div
          className="w-full max-w-[740px] border-8 border-double p-14 text-center relative"
          style={{ borderColor: "#C12129", color: "#111111", background: "#FAFAFA" }}
        >
          {/* Corner ornaments */}
          {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos) => (
            <div key={pos} className={`absolute ${pos} h-6 w-6 border-2`} style={{ borderColor: "#C12129" }} />
          ))}

          {/* Logo */}
          <div className="mb-6 flex flex-col items-center gap-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl mb-2" style={{ background: "#C12129" }}>
              <span className="text-2xl font-bold text-white">L</span>
            </div>
            <p style={{ fontSize: "11px", letterSpacing: "0.3em", color: "#C12129", fontFamily: "sans-serif" }}>
              LAMID LEARNING PLATFORM
            </p>
          </div>

          {/* Certificate of */}
          <p style={{ fontSize: "13px", letterSpacing: "0.25em", color: "#888", fontFamily: "sans-serif", marginBottom: "8px" }}>
            CERTIFICATE OF {cert.level === "professional" ? "ACHIEVEMENT" : "COMPLETION"}
          </p>

          <h1 style={{ fontSize: "40px", fontWeight: "normal", color: "#111", marginBottom: "16px", lineHeight: 1.2 }}>
            {title}
          </h1>

          <div style={{ width: "80px", height: "3px", background: "#C12129", margin: "0 auto 20px" }} />

          <p style={{ fontSize: "13px", color: "#888", fontFamily: "sans-serif", marginBottom: "6px" }}>
            This certifies that
          </p>
          <p style={{ fontSize: "32px", color: "#C12129", marginBottom: "6px", fontStyle: "italic" }}>
            {user?.name ?? "—"}
          </p>
          <p style={{ fontSize: "13px", color: "#666", fontFamily: "sans-serif", maxWidth: "440px", margin: "0 auto 24px" }}>
            has successfully completed the requirements for this{" "}
            {cert.level === "professional" ? "professional certification" : cert.level === "skill" ? "skill certification" : "course completion certificate"}.
          </p>

          {/* Date + signature row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "11px", color: "#999", fontFamily: "sans-serif", marginBottom: "2px" }}>ISSUED ON</p>
              <p style={{ fontSize: "13px", fontFamily: "sans-serif", color: "#333" }}>{issuedDate}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ borderTop: "1px solid #999", paddingTop: "4px", width: "140px" }}>
                <p style={{ fontSize: "11px", color: "#999", fontFamily: "sans-serif" }}>LAMID LEARNING</p>
              </div>
            </div>
          </div>

          {/* Verification ID + QR */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e5e5", paddingTop: "16px" }}>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "9px", color: "#bbb", fontFamily: "sans-serif", marginBottom: "2px", letterSpacing: "0.15em" }}>VERIFICATION ID</p>
              <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#666" }}>{cert.verificationId}</p>
              <p style={{ fontSize: "10px", color: "#999", fontFamily: "sans-serif", marginTop: "2px" }}>
                Verify at lamid.co/verify
              </p>
            </div>
            <QrCodeImage value={verifyUrl} size={72} />
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          @page { size: A4 landscape; margin: 0; }
        }
      `}</style>
    </>
  );
}
