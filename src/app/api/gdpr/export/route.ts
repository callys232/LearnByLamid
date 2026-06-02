import { NextResponse } from "next/server";
import { mockUsers, mockLearnerProfiles } from "@/mock/users";
import { mockLearnerProgress } from "@/mock/analytics";
import { mockCertificates } from "@/mock/certifications";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Compile all data for this user — swap with real DB queries
  const user = mockUsers.find((u) => u.id === userId);
  const profile = mockLearnerProfiles.find((p) => p.id === userId);
  const progress = mockLearnerProgress.filter((p) => p.userId === userId);
  const certs = mockCertificates.filter((c) => c.userId === userId);

  const exportData = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    subject: "GDPR Data Export — LAMID Learning Platform",
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          joinedAt: user.joinedAt,
          lastActiveAt: user.lastActiveAt,
          xp: user.xp,
          streak: user.streak,
        }
      : null,
    learnerProfile: profile
      ? {
          enrolledCourses: profile.enrolledCourseIds,
          completedCourses: profile.completedCourseIds,
          certificates: profile.earnedCertificateIds,
        }
      : null,
    progress: progress.map((p) => ({
      courseId: p.courseId,
      percentComplete: p.percentComplete,
      timeSpentMinutes: p.timeSpentMinutes,
      completedLessons: p.completedLessonIds.length,
      lastAccessed: p.lastAccessedAt,
    })),
    certificates: certs.map((c) => ({
      id: c.id,
      verificationId: c.verificationId,
      title: c.title,
      level: c.level,
      issuedAt: c.issuedAt,
    })),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="lamid-data-export-${userId}.json"`,
    },
  });
}
