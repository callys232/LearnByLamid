import { NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  enrollmentEmail,
  certificateEmail,
  eventReminderEmail,
} from "@/lib/email";

type EmailType = "enrollment" | "certificate" | "event_reminder";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type,
      to,
      ...params
    }: { type: EmailType; to: string } & Record<string, string> = body;

    if (!type || !to) {
      return NextResponse.json(
        { error: "Missing type or to" },
        { status: 400 },
      );
    }

    let payload;
    switch (type) {
      case "enrollment":
        payload = enrollmentEmail({
          userEmail: to,
          userName: params.userName,
          courseTitle: params.courseTitle,
          courseUrl: params.courseUrl,
        });
        break;
      case "certificate":
        payload = certificateEmail({
          userEmail: to,
          userName: params.userName,
          courseTitle: params.courseTitle,
          verificationId: params.verificationId,
          downloadUrl: params.downloadUrl,
        });
        break;
      case "event_reminder":
        payload = eventReminderEmail({
          userEmail: to,
          userName: params.userName,
          eventTitle: params.eventTitle,
          eventDate: params.eventDate,
          joinUrl: params.joinUrl,
        });
        break;
      default:
        return NextResponse.json(
          { error: "Unknown email type" },
          { status: 400 },
        );
    }

    payload.to = to;
    const result = await sendEmail(payload);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ id: result.id, sent: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
