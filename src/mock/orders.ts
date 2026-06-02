import type { Order } from "@/types/types";

export const mockOrders: Order[] = [
  {
    id: "order-001",
    userId: "user-001",
    courseId: "course-002",
    amount: 40,
    currency: "USD",
    status: "paid",
    createdAt: "2025-12-01T10:00:00Z",
    paidAt: "2025-12-01T10:01:00Z",
  },
];
