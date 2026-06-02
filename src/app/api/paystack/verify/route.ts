import { NextRequest, NextResponse } from "next/server";
import { recordEnrollment } from "@/lib/enrollments";

export async function POST(req: NextRequest) {
  try {
    const { reference, courseId, userId } = await req.json();

    if (!reference || !courseId || !userId) {
      return NextResponse.json(
        { error: "Missing reference, courseId, or userId" },
        { status: 400 },
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey || secretKey.includes("your-")) {
      // Dev mode: record enrollment and return success
      recordEnrollment(userId, {
        courseId,
        paidAt: new Date().toISOString(),
        reference,
        amount: 0,
        currency: "USD",
      });
      return NextResponse.json({ status: "success", enrolled: true });
    }

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
      },
    );

    const data = await res.json();

    if (!res.ok || data.data?.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed", status: data.data?.status },
        { status: 402 },
      );
    }

    const amount = data.data.amount / 100;
    const currency = data.data.currency;

    // Record enrollment — swap with: await db.enrollments.create(...)
    recordEnrollment(userId, {
      courseId,
      paidAt: new Date().toISOString(),
      reference,
      amount,
      currency,
    });

    return NextResponse.json({
      status: "success",
      enrolled: true,
      amount,
      currency,
      reference,
    });
  } catch (err) {
    console.error("[paystack/verify]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
