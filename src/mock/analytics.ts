import {
  CourseAnalytics,
  PlatformAnalytics,
  LearnerProgress,
} from "@/types/types";

export const mockPlatformAnalytics: PlatformAnalytics = {
  tenantId: "tenant-lamid",
  totalUsers: 4820,
  activeUsersThisMonth: 1340,
  totalCourses: 5,
  totalEnrollments: 8110,
  totalCertificatesIssued: 312,
  revenueThisMonth: 18600,
  topCourses: [
    { courseId: "course-005", enrollments: 3400 },
    { courseId: "course-004", enrollments: 2100 },
    { courseId: "course-001", enrollments: 1240 },
  ],
};

export const mockCourseAnalytics: CourseAnalytics[] = [
  {
    courseId: "course-001",
    totalEnrollments: 1240,
    completionRate: 68,
    avgScore: 82,
    avgTimeSpentMinutes: 310,
    dropOffByModule: { "mod-001": 5, "mod-002": 14, "mod-003": 13 },
    ratingBreakdown: { "5": 780, "4": 310, "3": 100, "2": 30, "1": 20 },
  },
  {
    courseId: "course-004",
    totalEnrollments: 2100,
    completionRate: 74,
    avgScore: 87,
    avgTimeSpentMinutes: 520,
    dropOffByModule: { "mod-008": 8, "mod-009": 10, "mod-010": 8 },
    ratingBreakdown: { "5": 1400, "4": 500, "3": 140, "2": 40, "1": 20 },
  },
];

export const mockLearnerProgress: LearnerProgress[] = [
  {
    userId: "user-001",
    courseId: "course-001",
    completedLessonIds: ["les-001", "les-002", "les-003", "les-004"],
    completedModuleIds: ["mod-001"],
    attendedEventIds: ["event-005"],
    quizAttempts: [
      {
        quizId: "quiz-001",
        selectedOptionId: "b",
        isCorrect: true,
        attemptedAt: "2026-04-10T10:00:00Z",
      },
      {
        quizId: "quiz-002",
        selectedOptionId: "c",
        isCorrect: true,
        attemptedAt: "2026-04-12T11:30:00Z",
      },
    ],
    percentComplete: 45,
    timeSpentMinutes: 74,
    lastAccessedAt: "2026-05-06T14:30:00Z",
  },
  {
    userId: "user-001",
    courseId: "course-003",
    completedLessonIds: ["les-013"],
    completedModuleIds: [],
    attendedEventIds: [],
    quizAttempts: [],
    percentComplete: 15,
    timeSpentMinutes: 20,
    lastAccessedAt: "2026-05-01T09:00:00Z",
  },
  {
    userId: "user-001",
    courseId: "course-005",
    completedLessonIds: ["les-024", "les-025"],
    completedModuleIds: ["mod-011"],
    attendedEventIds: [],
    quizAttempts: [],
    percentComplete: 50,
    timeSpentMinutes: 95,
    lastAccessedAt: "2026-04-28T11:00:00Z",
  },
];

export const mockWeeklyActivity = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 90 },
  { day: "Wed", minutes: 30 },
  { day: "Thu", minutes: 120 },
  { day: "Fri", minutes: 60 },
  { day: "Sat", minutes: 0 },
  { day: "Sun", minutes: 75 },
];
