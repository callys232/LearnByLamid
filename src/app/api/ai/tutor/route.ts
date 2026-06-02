import { NextRequest } from "next/server";
import {
  streamChatResponse,
  getActiveProvider,
  getActiveModel,
  PROVIDER_META,
} from "@/lib/ai-providers";
import type { ChatMessage } from "@/lib/ai-providers";

interface TutorContext {
  courseTitle: string;
  lessonTitle: string;
  lessonType: string;
  category: string;
  progressPct: number;
  quizAvgScore?: number;
}

function buildSystemPrompt(ctx: TutorContext): string {
  return `You are an AI learning assistant for the LAMID Learning Platform.

Current session:
- Course: ${ctx.courseTitle}
- Lesson: "${ctx.lessonTitle}" (${ctx.lessonType})
- Category: ${ctx.category}
- Progress: ${ctx.progressPct}% through the course
${ctx.quizAvgScore !== undefined ? `- Quiz average: ${ctx.quizAvgScore}%` : ""}

Your role:
1. Explain concepts from this lesson clearly and concisely
2. Answer questions related to the course content
3. Provide relevant real-world examples and analogies
4. Suggest what to focus on or review next
5. Be encouraging — adapt to the learner's progress

Keep responses focused (2–4 paragraphs max). Use **bold** for key terms.
If the question is unrelated to the course, gently redirect.`;
}

export async function POST(req: NextRequest) {
  try {
    const {
      messages,
      context,
    }: { messages: ChatMessage[]; context: TutorContext } = await req.json();

    if (!messages?.length || !context) {
      return new Response("Missing messages or context", { status: 400 });
    }

    const provider = getActiveProvider();
    const meta = PROVIDER_META[provider];

    // Check the required key is set
    const keyValue = process.env[meta.envKey];
    const keyMissing =
      !keyValue ||
      keyValue.includes("your-") ||
      keyValue.includes("placeholder");

    if (keyMissing) {
      const fallback = `I'm your AI learning assistant — set \`${meta.envKey}\` in \`.env.local\` to enable real responses (provider: ${meta.name}). Get your free key at ${meta.signupUrl}`;
      return new Response(fallback, {
        headers: { "Content-Type": "text/plain" },
      });
    }

    const stream = await streamChatResponse(
      messages,
      buildSystemPrompt(context),
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-AI-Provider": provider,
        "X-AI-Model": getActiveModel(provider),
      },
    });
  } catch (err) {
    console.error("[api/ai/tutor]", err);
    const msg = err instanceof Error ? err.message : "AI service error";
    return new Response(msg, { status: 500 });
  }
}
