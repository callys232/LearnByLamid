import { NextResponse } from "next/server";

/** Parse a JSON request body, returning null on failure. */
export async function parseBody<T = Record<string, unknown>>(
  req: Request,
): Promise<T | null> {
  return req.json().catch(() => null);
}

/** Return a 400 response if required fields are missing from a parsed body. */
export function requireFields(
  body: Record<string, unknown> | null,
  fields: string[],
): NextResponse | null {
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  for (const field of fields) {
    if (!body[field]) {
      return NextResponse.json({ error: `${field} is required.` }, { status: 400 });
    }
  }
  return null;
}
