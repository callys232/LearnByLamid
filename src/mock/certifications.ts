import { Certificate } from "@/types/types";

export const mockCertificates: Certificate[] = [
  {
    id: "cert-001",
    verificationId: "LAMID-HCD-2025-A1B2C3",
    userId: "user-001",
    courseId: "course-002",
    tenantId: "tenant-lamid",
    level: "skill",
    title: "UX Research Methods",
    issuedAt: "2025-12-15T00:00:00Z",
  },
  {
    id: "cert-002",
    verificationId: "LAMID-HCD-2025-D4E5F6",
    userId: "user-005",
    courseId: "course-003",
    tenantId: "tenant-lamid",
    level: "skill",
    title: "Prototyping & Validation",
    issuedAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "cert-003",
    verificationId: "LAMID-BIZ-2026-G7H8I9",
    userId: "user-005",
    programId: "prog-001",
    tenantId: "tenant-lamid",
    level: "professional",
    title: "HCD Practitioner",
    issuedAt: "2026-03-01T00:00:00Z",
    expiresAt: "2028-03-01T00:00:00Z",
  },
];
