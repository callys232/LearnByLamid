import { User, LearnerProfile } from "@/types/types";

export const mockUsers: User[] = [
  {
    id: "user-000",
    tenantId: "tenant-lamid",
    name: "LAMID Admin",
    email: "superadmin@lamid.co",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=LA",
    role: "super_admin",
    xp: 99999,
    streak: 365,
    headline: "LAMID Platform Â· Founder",
    joinedAt: "2023-01-01T00:00:00Z",
    lastActiveAt: "2026-05-07T08:00:00Z",
    accountType: "individual",
    verificationStatus: "approved",
  },
  {
    id: "user-001",
    tenantId: "tenant-lamid",
    name: "Amara Osei",
    email: "amara@lamid.co",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=AO",
    role: "learner",
    xp: 3420,
    streak: 12,
    headline: "UX Researcher Â· HCD Track",
    joinedAt: "2024-09-01T00:00:00Z",
    lastActiveAt: "2026-05-06T14:30:00Z",
    accountType: "individual",
    verificationStatus: "approved",
  },
  {
    id: "user-002",
    tenantId: "tenant-lamid",
    name: "Kwame Mensah",
    email: "kwame@lamid.co",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=KM",
    role: "instructor",
    xp: 8900,
    streak: 45,
    headline: "Product Designer Â· Course Author",
    joinedAt: "2023-03-15T00:00:00Z",
    lastActiveAt: "2026-05-07T09:00:00Z",
    accountType: "individual",
    verificationStatus: "approved",
  },
  {
    id: "user-003",
    tenantId: "tenant-lamid",
    name: "Fatima Diallo",
    email: "fatima@lamid.co",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=FD",
    role: "admin",
    xp: 12500,
    streak: 60,
    headline: "Learning & Development Lead",
    joinedAt: "2023-01-01T00:00:00Z",
    lastActiveAt: "2026-05-07T08:00:00Z",
    accountType: "individual",
    verificationStatus: "approved",
  },
  {
    id: "user-004",
    tenantId: "tenant-lamid",
    name: "Emeka Nwosu",
    email: "emeka@lamid.co",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=EN",
    role: "learner",
    xp: 1850,
    streak: 4,
    headline: "Full-Stack Engineer",
    joinedAt: "2025-11-10T00:00:00Z",
    lastActiveAt: "2026-05-05T20:00:00Z",
    accountType: "individual",
    verificationStatus: "approved",
  },
  {
    id: "user-005",
    tenantId: "tenant-lamid",
    name: "Aisha Bello",
    email: "aisha@lamid.co",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=AB",
    role: "learner",
    xp: 5760,
    streak: 21,
    headline: "Business Strategist Â· BIZ Track",
    joinedAt: "2025-03-20T00:00:00Z",
    lastActiveAt: "2026-05-07T07:45:00Z",
    accountType: "individual",
    verificationStatus: "approved",
  },
  {
    id: "user-006",
    tenantId: "tenant-lamid",
    name: "Tunde Adeyemi",
    email: "tunde@lamid.co",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=TA",
    role: "learner",
    xp: 0,
    streak: 0,
    joinedAt: "2026-05-25T10:00:00Z",
    lastActiveAt: "2026-05-25T10:00:00Z",
    accountType: "individual",
    verificationStatus: "pending",
  },
  {
    id: "user-007",
    tenantId: "tenant-lamid",
    name: "Ngozi Eze",
    email: "ngozi@lamid.co",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=NE",
    role: "instructor",
    xp: 0,
    streak: 0,
    joinedAt: "2026-05-20T09:00:00Z",
    lastActiveAt: "2026-05-20T09:00:00Z",
    accountType: "individual",
    verificationStatus: "pending",
  },
  {
    id: "user-008",
    tenantId: "tenant-lamid",
    name: "Chidi Okafor",
    email: "chidi@lamid.co",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=CO",
    role: "learner",
    xp: 0,
    streak: 0,
    joinedAt: "2026-05-10T12:00:00Z",
    lastActiveAt: "2026-05-10T12:00:00Z",
    accountType: "individual",
    verificationStatus: "rejected",
  },
];

export const mockLearnerProfiles: LearnerProfile[] = [
  {
    ...mockUsers[1],
    role: "learner",
    enrolledCourseIds: ["course-001", "course-003", "course-005"],
    completedCourseIds: ["course-002"],
    earnedCertificateIds: ["cert-001"],
    currentPath: "HCD Practitioner Track",
  },
  {
    ...mockUsers[4],
    role: "learner",
    enrolledCourseIds: ["course-001"],
    completedCourseIds: [],
    earnedCertificateIds: [],
  },
  {
    ...mockUsers[5],
    role: "learner",
    enrolledCourseIds: ["course-002", "course-004"],
    completedCourseIds: ["course-003"],
    earnedCertificateIds: ["cert-002", "cert-003"],
  },
];

export let currentUser = mockUsers[1]; // Amara Osei â€” learner

function setCurrentUser(predicate: (u: User) => boolean): boolean {
  const next = mockUsers.find(predicate);
  if (next) {
    currentUser = next;
    return true;
  }
  return false;
}

export const setCurrentUserById = (id: string) =>
  setCurrentUser((u) => u.id === id);
export const setCurrentUserByEmail = (email: string) =>
  setCurrentUser((u) => u.email.toLowerCase() === email.toLowerCase());
