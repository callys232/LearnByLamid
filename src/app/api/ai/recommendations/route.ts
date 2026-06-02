import { NextRequest, NextResponse } from "next/server";
import {
  generateText,
  getActiveProvider,
  PROVIDER_META,
} from "@/lib/ai-providers";

export interface RecommendedCourse {
  courseId: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

export async function POST(req: NextRequest) {
  try {
    const {
      enrolledCourseIds,
      completedCourseIds,
      quizAvgScore,
      categoryFocus,
      availableCourses,
    } = await req.json();

    const provider = getActiveProvider();
    const meta = PROVIDER_META[provider];
    const keyValue = process.env[meta.envKey];
    const keyMissing =
      !keyValue ||
      keyValue.includes("your-") ||
      keyValue.includes("placeholder");

    if (keyMissing) {
      // Deterministic fallback when no key is set
      const fallback: RecommendedCourse[] = availableCourses
        .filter((c: { id: string }) => !enrolledCourseIds.includes(c.id))
        .slice(0, 3)
        .map((c: { id: string; title: string }, i: number) => ({
          courseId: c.id,
          reason: `${c.title} is a natural next step on your learning path.`,
          priority: i === 0 ? "high" : "medium",
        }));
      return NextResponse.json({ recommendations: fallback });
    }

    const courseList = availableCourses
      .map(
        (c: {
          id: string;
          title: string;
          categoryId: string;
          difficulty: string;
        }) => `- ${c.id}: "${c.title}" (${c.categoryId}, ${c.difficulty})`,
      )
      .join("\n");

    const prompt = `You are a learning advisor for the LAMID platform. Recommend 3 courses for this learner.

Learner profile:
- Enrolled: ${JSON.stringify(enrolledCourseIds)}
- Completed: ${JSON.stringify(completedCourseIds)}
- Quiz average: ${quizAvgScore ?? "unknown"}%
- Primary focus: ${categoryFocus ?? "not specified"}

Available courses (not enrolled):
${courseList}

Return ONLY a valid JSON array with 3 items (or fewer if unavailable):
[{"courseId":"...","reason":"1–2 sentence reason","priority":"high|medium|low"}]
Only include courses from the list above.`;

    const text = await generateText(prompt, 400);
    const match = text.match(/\[[\s\S]*\]/);
    const recommendations: RecommendedCourse[] = match
      ? JSON.parse(match[0])
      : [];

    return NextResponse.json({ recommendations });
  } catch {
    return NextResponse.json({ recommendations: [] });
  }
}
