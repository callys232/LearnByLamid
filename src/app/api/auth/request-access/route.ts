import { NextResponse } from "next/server";
import { mockUsers, setCurrentUserById } from "@/mock/users";
import type { AccountType } from "@/types/types";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(body?.password ?? "").trim();
  const accountType = body?.accountType as AccountType;

  if (!name || !email || !password || !accountType) {
    return NextResponse.json(
      { error: "Name, email, password, and account type are required." },
      { status: 400 },
    );
  }

  if (accountType === "individual") {
    return NextResponse.json(
      {
        error:
          "Individual learners should sign up through the public registration form.",
      },
      { status: 400 },
    );
  }

  if (!["tenant", "enterprise"].includes(accountType)) {
    return NextResponse.json(
      { error: "Please select a valid account type." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const existingUser = mockUsers.find(
    (user) => user.email.toLowerCase() === email,
  );
  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists." },
      { status: 409 },
    );
  }

  const id = `user-${String(mockUsers.length + 1).padStart(3, "0")}`;
  const newUser = {
    id,
    tenantId: "tenant-lamid",
    name,
    email,
    avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      name,
    )}`,
    role: "learner" as const,
    xp: 0,
    streak: 0,
    joinedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    accountType,
    verificationStatus: "pending" as const,
    password,
  };

  mockUsers.push(newUser);
  setCurrentUserById(newUser.id);

  return NextResponse.json(
    {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        accountType: newUser.accountType,
        verificationStatus: newUser.verificationStatus,
      },
    },
    { status: 201 },
  );
}
