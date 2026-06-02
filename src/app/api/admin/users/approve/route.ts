import { NextResponse } from "next/server";
import { mockUsers } from "@/mock/users";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || !body.userId) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 },
    );
  }

  const userId = String(body.userId);
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  user.verificationStatus = "approved";
  user.lastActiveAt = new Date().toISOString();

  return NextResponse.json({ success: true, user }, { status: 200 });
}
