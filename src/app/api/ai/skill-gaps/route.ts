import { NextRequest, NextResponse } from "next/server";
import {
  generateText,
  getActiveProvider,
  PROVIDER_META,
} from "@/lib/ai-providers";

export interface SkillGap {
  area: string;
  description: string;
  severity: "low" | "medium" | "high";
  courseId?: string;
}

export interface SkillGapResult {
  gaps: SkillGap[];
  strengths: string[];
  suggestions: { action: string; courseId?: string }[];
  overallScore: number;
}

export async function POST(req: NextRequest) {
  try {
    const {
      progress,
      quizAttempts,
      completedCourses,
      enrolledCourses,
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
      const fallback: SkillGapResult = {
        gaps: [
          {
            area: "Prototyping",
            description: "No prototyping courses completed yet.",
            severity: "high",
            courseId: "course-003",
          },
          {
            area: "Software Dev",
            description: "Limited technical module coverage.",
            severity: "medium",
            courseId: "course-004",
          },
          {
            area: "Business Strategy",
            description: "No business strategy content attempted.",
            severity: "low",
            courseId: "course-005",
          },
        ],
        strengths: [
          "HCD Foundations",
          "UX Research",
          "Consistent learning streak",
        ],
        suggestions: [
          {
            action: "Complete Prototyping & Validation to close the top gap",
            courseId: "course-003",
          },
          {
            action: "Start Modern React Development for technical breadth",
            courseId: "course-004",
          },
        ],
        overallScore: 42,
      };
      return NextResponse.json(fallback);
    }

    const correct = quizAttempts.filter(
      (a: { isCorrect: boolean }) => a.isCorrect,
    ).length;
    const quizScore =
      quizAttempts.length > 0
        ? Math.round((correct / quizAttempts.length) * 100)
        : null;

    const courseMap = availableCourses
      .map(
        (c: { id: string; title: string; categoryId: string }) =>
          `${c.id}: "${c.title}" (${c.categoryId})`,
      )
      .join("\n");

    const prompt = `Analyse this LAMID learner and identify skill gaps.

Data:
- Completed: ${JSON.stringify(completedCourses.map((c: { title: string }) => c.title))}
- Enrolled: ${JSON.stringify(enrolledCourses.map((c: { title: string }) => c.title))}
- Quiz score: ${quizScore !== null ? quizScore + "%" : "none"}
- Progress: ${JSON.stringify(progress.map((p: { courseId: string; percentComplete: number }) => ({ id: p.courseId, pct: p.percentComplete })))}

Available courses to fill gaps:
${courseMap}

Return ONLY valid JSON (max 4 gaps, 3 strengths, 3 suggestions):
{"gaps":[{"area":"...","description":"...","severity":"low|medium|high","courseId":"optional"}],"strengths":["..."],"suggestions":[{"action":"...","courseId":"optional"}],"overallScore":0-100}`;

    const text = await generateText(prompt, 600);
    const match = text.match(/\{[\s\S]*\}/);
    const result: SkillGapResult = match
      ? JSON.parse(match[0])
      : { gaps: [], strengths: [], suggestions: [], overallScore: 0 };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/ai/skill-gaps]", err);
    return NextResponse.json({
      gaps: [],
      strengths: [],
      suggestions: [],
      overallScore: 0,
    });
  }
}
