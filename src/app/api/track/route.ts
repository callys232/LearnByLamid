import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Swap with real analytics provider call, e.g.:
    // await analytics.track({ userId: body.userId, event: body.event, properties: body.metadata })

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
