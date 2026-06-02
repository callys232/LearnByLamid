// ─── Tenant ───────────────────────────────────────────────────────────────────

export type TenantType = "lamid" | "enterprise" | "independent";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  type: TenantType;
  logo?: string;
  primaryColor: string;
  domain?: string;
  serviceCategories: ServiceCategory[];
  createdAt: string;
}

// ─── Service Categories ────────────────────────────────────────────────────────

export interface ServiceCategory {
  id: string;
  tenantId: string;
  label: string;
  code: string; // e.g. "HCD", "BIZ", "SD"
  color?: string;
  description?: string;
}

// ─── Users & Roles ─────────────────────────────────────────────────────────────

export type UserRole = "learner" | "instructor" | "admin" | "super_admin";
export type AccountType = "tenant" | "enterprise" | "individual";
export type VerificationStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  xp: number;
  streak: number;
  joinedAt: string;
  lastActiveAt: string;
  accountType?: AccountType;
  verificationStatus?: VerificationStatus;
  headline?: string;
  password?: string;
}

export interface LearnerProfile extends User {
  role: "learner";
  enrolledCourseIds: string[];
  completedCourseIds: string[];
  earnedCertificateIds: string[];
  currentPath?: string;
}

// ─── Programs & Courses ────────────────────────────────────────────────────────

export type ContentStatus = "draft" | "published" | "archived";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type AccessType = "free" | "paid" | "subscription" | "enterprise";

export interface Program {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  thumbnail?: string;
  categoryId: string;
  courseIds: string[];
  status: ContentStatus;
  accessType: AccessType;
  price?: number;
  createdAt: string;
}

export interface Course {
  id: string;
  tenantId: string;
  programId?: string;
  title: string;
  description: string;
  thumbnail?: string;
  categoryId: string;
  instructorId: string;
  moduleIds: string[];
  status: ContentStatus;
  difficulty: DifficultyLevel;
  accessType: AccessType;
  price?: number;
  originalPrice?: number;
  estimatedHours: number;
  enrollmentCount: number;
  rating: number;
  ratingCount?: number;
  totalLessons?: number;
  featured?: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Modules & Lessons ─────────────────────────────────────────────────────────

export type LessonType = "video" | "text" | "slides" | "live" | "download";

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  lessonIds: string[];
  order: number;
  isLocked: boolean;
  releasedAt?: string; // drip scheduling
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: LessonType;
  contentUrl?: string;
  durationMinutes?: number;
  order: number;
  quizIds: string[];
}

// ─── Quizzes & Assessments ─────────────────────────────────────────────────────

export type QuizType = "popup" | "inline" | "checkpoint";

export interface Quiz {
  id: string;
  lessonId?: string;
  moduleId?: string;
  type: QuizType;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation?: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

// ─── Events ────────────────────────────────────────────────────────────────────

export type EventStatus = "upcoming" | "live" | "completed" | "cancelled";
export type EventFormat = "zoom" | "webrtc" | "in_person";

export interface LearningEvent {
  id: string;
  tenantId: string;
  courseId?: string;
  moduleId?: string;
  linkedLessonId?: string; // attending/watching marks this lesson complete
  title: string;
  description: string;
  format: EventFormat;
  meetingUrl?: string;
  recordingUrl?: string;
  replayWatchedByUserIds: string[]; // watched recording = counts as attended
  status: EventStatus;
  instructorId: string;
  registeredUserIds: string[];
  attendedUserIds: string[];
  scheduledAt: string;
  durationMinutes: number;
  maxCapacity?: number;
  tags?: string[];
}

// ─── Certifications ────────────────────────────────────────────────────────────

export type CertLevel = "completion" | "skill" | "professional";

export interface Certificate {
  id: string;
  verificationId: string;
  userId: string;
  courseId?: string;
  programId?: string;
  tenantId: string;
  level: CertLevel;
  title: string;
  issuedAt: string;
  expiresAt?: string;
}

// ─── Progress & Analytics ──────────────────────────────────────────────────────

export interface LearnerProgress {
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  completedModuleIds: string[];
  attendedEventIds: string[]; // attended live or watched replay
  quizAttempts: QuizAttempt[];
  percentComplete: number;
  timeSpentMinutes: number;
  lastAccessedAt: string;
  completedAt?: string;
}

export interface QuizAttempt {
  quizId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  attemptedAt: string;
}

export interface CourseAnalytics {
  courseId: string;
  totalEnrollments: number;
  completionRate: number;
  avgScore: number;
  avgTimeSpentMinutes: number;
  dropOffByModule: Record<string, number>; // moduleId -> drop-off %
  ratingBreakdown: Record<string, number>; // "1"–"5" -> count
}

export interface PlatformAnalytics {
  tenantId: string;
  totalUsers: number;
  activeUsersThisMonth: number;
  totalCourses: number;
  totalEnrollments: number;
  totalCertificatesIssued: number;
  revenueThisMonth: number;
  topCourses: { courseId: string; enrollments: number }[];
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export interface ActivityItem {
  id:    string;
  label: string;
  sub:   string;
  time:  string;
  icon:  string;
}

// ─── Notifications ─────────────────────────────────────────────────────────────

export type NotificationType =
  | "course_reminder"
  | "quiz_ready"
  | "event_starting"
  | "badge_earned"
  | "cert_issued"
  | "new_lecture";

export interface Notification {
  id:        string;
  userId:    string;
  type:      NotificationType;
  title:     string;
  body:      string;
  read:      boolean;
  createdAt: string;
  href?:     string;
}

// ─── Orders & Payments ────────────────────────────────────────────────────────

export interface Order {
  id:        string;
  userId:    string;
  courseId:  string;
  amount:    number;
  currency:  string;
  status:    "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
  paidAt?:   string;
}

// ─── Navigation ────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
}
