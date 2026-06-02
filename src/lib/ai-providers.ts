/**
 * Multi-provider AI abstraction for LAMID Learning Platform.
 *
 * Switch providers with a single env var:
 *   AI_PROVIDER=anthropic | gemini | groq | ollama
 *
 * Free options:
 *   - gemini  → Google AI Studio free tier (15 RPM, 1M tokens/day)
 *   - groq    → Groq free tier (Llama 3, ~30 RPM)
 *   - ollama  → Self-hosted, completely free
 */

import Anthropic from "@anthropic-ai/sdk";

// ─── Types ─────────────────────────────────────────────────────────────────

export type AiProvider = "anthropic" | "gemini" | "groq" | "ollama";

export interface ChatMessage {
  role:    "user" | "assistant";
  content: string;
}

// ─── Provider metadata ─────────────────────────────────────────────────────

export const PROVIDER_META: Record<
  AiProvider,
  { name: string; free: boolean; speed: string; envKey: string; signupUrl: string }
> = {
  anthropic: {
    name:      "Claude",
    free:      false,
    speed:     "fast",
    envKey:    "ANTHROPIC_API_KEY",
    signupUrl: "https://console.anthropic.com",
  },
  gemini: {
    name:      "Gemini Flash",
    free:      true,
    speed:     "fast",
    envKey:    "GOOGLE_AI_API_KEY",
    signupUrl: "https://aistudio.google.com/app/apikey",
  },
  groq: {
    name:      "Llama 3 (Groq)",
    free:      true,
    speed:     "very fast",
    envKey:    "GROQ_API_KEY",
    signupUrl: "https://console.groq.com",
  },
  ollama: {
    name:      "Ollama (local)",
    free:      true,
    speed:     "local",
    envKey:    "OLLAMA_BASE_URL",
    signupUrl: "https://ollama.com",
  },
};

// Default models per provider
const DEFAULT_MODELS: Record<AiProvider, string> = {
  anthropic: "claude-sonnet-4-6",
  gemini:    "gemini-2.0-flash-exp",
  groq:      "llama-3.3-70b-versatile",
  ollama:    "llama3.2",
};

export function getActiveProvider(): AiProvider {
  return (process.env.AI_PROVIDER ?? "anthropic") as AiProvider;
}

/** Returns true when no real API key is configured (dev / placeholder). */
export function isAiKeyMissing(provider?: AiProvider): boolean {
  const p   = provider ?? getActiveProvider();
  const key = process.env[PROVIDER_META[p].envKey] ?? "";
  return !key || key.includes("your-") || key.includes("placeholder");
}

export function getActiveModel(provider?: AiProvider): string {
  const p = provider ?? getActiveProvider();
  return process.env.AI_MODEL ?? DEFAULT_MODELS[p];
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Returns a ReadableStream of text chunks — wire directly into a Next.js Response.
 * Used by the AI tutor for real-time streaming.
 */
export async function streamChatResponse(
  messages: ChatMessage[],
  systemPrompt: string,
  maxTokens = 600
): Promise<ReadableStream<Uint8Array>> {
  const provider = getActiveProvider();
  const model    = getActiveModel(provider);

  switch (provider) {
    case "gemini":    return streamGemini(messages, systemPrompt, model, maxTokens);
    case "groq":      return streamGroq(messages, systemPrompt, model, maxTokens);
    case "ollama":    return streamOllama(messages, systemPrompt, model);
    case "anthropic":
    default:          return streamAnthropic(messages, systemPrompt, model, maxTokens);
  }
}

/**
 * Single-shot text generation — used for structured JSON outputs
 * (recommendations, skill gap analysis).
 */
export async function generateText(
  prompt: string,
  maxTokens = 500
): Promise<string> {
  const provider = getActiveProvider();
  const model    = getActiveModel(provider);

  switch (provider) {
    case "gemini":    return generateGemini(prompt, model, maxTokens);
    case "groq":      return generateGroq(prompt, model, maxTokens);
    case "ollama":    return generateOllama(prompt, model);
    case "anthropic":
    default:          return generateAnthropic(prompt, model, maxTokens);
  }
}

// ─── Anthropic ──────────────────────────────────────────────────────────────

const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function streamAnthropic(
  messages: ChatMessage[],
  system: string,
  model: string,
  maxTokens: number
): Promise<ReadableStream<Uint8Array>> {
  const stream = await anthropicClient.messages.stream({
    model,
    max_tokens: maxTokens,
    system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });
}

async function generateAnthropic(
  prompt: string,
  model: string,
  maxTokens: number
): Promise<string> {
  const res = await anthropicClient.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  return res.content[0].type === "text" ? res.content[0].text : "";
}

// ─── Google Gemini ──────────────────────────────────────────────────────────
// Free tier: 15 RPM · 1M tokens/day · Get key at aistudio.google.com

async function streamGemini(
  messages: ChatMessage[],
  system: string,
  model: string,
  maxTokens: number
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey || apiKey.includes("your-")) throw new Error("GOOGLE_AI_API_KEY not set");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({
        role:  m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: { maxOutputTokens: maxTokens },
    }),
  });

  if (!res.ok || !res.body) throw new Error(`Gemini stream error: ${res.status}`);

  return new ReadableStream({
    async start(controller) {
      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) controller.enqueue(encoder.encode(text));
          } catch { /* partial chunk — skip */ }
        }
      }
      controller.close();
    },
  });
}

async function generateGemini(
  prompt: string,
  model: string,
  maxTokens: number
): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey || apiKey.includes("your-")) throw new Error("GOOGLE_AI_API_KEY not set");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents:         [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens },
    }),
  });

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

// ─── Groq (OpenAI-compatible) ───────────────────────────────────────────────
// Free tier: ~30 RPM · Llama 3.3 70B · Get key at console.groq.com

async function streamGroq(
  messages: ChatMessage[],
  system: string,
  model: string,
  maxTokens: number
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.includes("your-")) throw new Error("GROQ_API_KEY not set");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream:     true,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok || !res.body) throw new Error(`Groq stream error: ${res.status}`);

  return new ReadableStream({
    async start(controller) {
      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
          try {
            const data = JSON.parse(line.slice(6));
            const text = data?.choices?.[0]?.delta?.content;
            if (text) controller.enqueue(encoder.encode(text));
          } catch { /* partial chunk */ }
        }
      }
      controller.close();
    },
  });
}

async function generateGroq(
  prompt: string,
  model: string,
  maxTokens: number
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.includes("your-")) throw new Error("GROQ_API_KEY not set");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages:   [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

// ─── Ollama (self-hosted, 100% free) ────────────────────────────────────────
// Run locally: `ollama run llama3.2` → no API key, no cost, no rate limits

async function streamOllama(
  messages: ChatMessage[],
  system: string,
  model: string
): Promise<ReadableStream<Uint8Array>> {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";

  const res = await fetch(`${baseUrl}/api/chat`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: "system", content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok || !res.body) throw new Error(`Ollama error: ${res.status}. Is Ollama running?`);

  return new ReadableStream({
    async start(controller) {
      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            const text = data?.message?.content;
            if (text) controller.enqueue(encoder.encode(text));
          } catch { /* incomplete JSON */ }
        }
      }
      controller.close();
    },
  });
}

async function generateOllama(prompt: string, model: string): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";

  const res = await fetch(`${baseUrl}/api/generate`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: false }),
  });

  const data = await res.json();
  return data?.response ?? "";
}
