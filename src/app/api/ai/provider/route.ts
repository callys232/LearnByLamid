import { NextResponse } from "next/server";
import {
  getActiveProvider,
  getActiveModel,
  PROVIDER_META,
} from "@/lib/ai-providers";

export async function GET() {
  const provider = getActiveProvider();
  const meta = PROVIDER_META[provider];
  const model = getActiveModel(provider);

  const keyValue = process.env[meta.envKey];
  const keySet =
    !!keyValue &&
    !keyValue.includes("your-") &&
    !keyValue.includes("placeholder");

  return NextResponse.json({
    name: meta.name,
    free: meta.free,
    speed: meta.speed,
    keySet,
  });
}
