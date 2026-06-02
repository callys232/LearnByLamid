// In-memory enrollment store — replace with db.enrollments when DB is wired

interface EnrollmentRecord {
  courseId:  string;
  paidAt:    string;
  reference: string;
  amount:    number;
  currency:  string;
}

const store = new Map<string, EnrollmentRecord[]>();

export function recordEnrollment(userId: string, record: EnrollmentRecord) {
  const existing = store.get(userId) ?? [];
  if (!existing.some((e) => e.courseId === record.courseId)) {
    store.set(userId, [...existing, record]);
  }
}

export function isEnrolled(userId: string, courseId: string): boolean {
  return store.get(userId)?.some((e) => e.courseId === courseId) ?? false;
}
