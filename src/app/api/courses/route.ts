import { NextResponse } from "next/server";
import { mockCourses } from "@/mock/courses";
import type { Course, AccessType, ContentStatus } from "@/types/types";

interface CourseRequest {
  title: string;
  description: string;
  categoryId: string;
  difficulty: string;
  accessType: AccessType;
  price?: number;
  status: ContentStatus;
  instructorId: string;
  tenantId: string;
  moduleIds: string[];
  tags: string[];
  estimatedHours: number;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const courseBody = body as CourseRequest;
  const title = String(courseBody.title ?? "").trim();
  const description = String(courseBody.description ?? "").trim();
  const categoryId = String(courseBody.categoryId ?? "").trim();
  const difficulty = String(
    courseBody.difficulty ?? "",
  ) as Course["difficulty"];
  const accessType = String(
    courseBody.accessType ?? "",
  ) as Course["accessType"];
  const status = String(courseBody.status ?? "") as Course["status"];
  const instructorId = String(courseBody.instructorId ?? "").trim();
  const tenantId = String(courseBody.tenantId ?? "").trim();

  if (
    !title ||
    !description ||
    !categoryId ||
    !difficulty ||
    !accessType ||
    !status ||
    !instructorId ||
    !tenantId
  ) {
    return NextResponse.json(
      {
        error:
          "Title, description, category, difficulty, access type, status, tenant, and instructor are required.",
      },
      { status: 400 },
    );
  }

  const id = `course-${String(mockCourses.length + 1).padStart(3, "0")}`;
  const now = new Date().toISOString();
  const newCourse: Course = {
    id,
    tenantId,
    title,
    description,
    categoryId,
    instructorId,
    moduleIds: Array.isArray(courseBody.moduleIds) ? courseBody.moduleIds : [],
    status: status as Course["status"],
    difficulty: difficulty as Course["difficulty"],
    accessType: accessType as Course["accessType"],
    price: typeof courseBody.price === "number" ? courseBody.price : undefined,
    estimatedHours: Number(courseBody.estimatedHours) || 1,
    enrollmentCount: 0,
    rating: 0,
    tags: Array.isArray(courseBody.tags) ? courseBody.tags : [],
    createdAt: now,
    updatedAt: now,
  };

  mockCourses.push(newCourse);

  return NextResponse.json(
    { success: true, course: newCourse },
    { status: 201 },
  );
}
