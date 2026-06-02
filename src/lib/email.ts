/**
 * Email service abstraction.
 * Provider: Resend (free tier: 3,000 emails/month, 100/day)
 * Get key: https://resend.com
 * Switch providers by implementing the same interface.
 */

export interface EmailPayload {
  to:      string | string[];
  subject: string;
  html:    string;
  from?:   string;
}

const FROM = "LAMID Learning <noreply@lamid.co>";

// ─── Send ───────────────────────────────────────────────────────────────────

export async function sendEmail(payload: EmailPayload): Promise<{ id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes("your-")) {
    // Dev mode: log to console instead of sending
    console.log("[email] Dev mode — would send:", {
      to:      payload.to,
      subject: payload.subject,
    });
    return { id: `dev-${Date.now()}` };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        from:    payload.from ?? FROM,
        to:      Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject,
        html:    payload.html,
      }),
    });

    const data = await res.json();
    if (!res.ok) return { error: data.message ?? "Send failed" };
    return { id: data.id };
  } catch (err) {
    return { error: String(err) };
  }
}

// ─── Templates ──────────────────────────────────────────────────────────────

export function enrollmentEmail(params: {
  userEmail:   string;
  userName:    string;
  courseTitle: string;
  courseUrl:   string;
}): EmailPayload {
  return {
    to:      params.userEmail,
    subject: `You're enrolled in ${params.courseTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0A0A0A;color:#F5F5F5;padding:32px;border-radius:12px">
        <p style="color:#C12129;font-weight:700;letter-spacing:0.1em;font-size:11px">LAMID LEARNING</p>
        <h1 style="font-size:22px;margin:8px 0 4px">You're enrolled!</h1>
        <p style="color:#A3A3A3">Hi ${params.userName},</p>
        <p style="color:#A3A3A3">You've successfully enrolled in <strong style="color:#F5F5F5">${params.courseTitle}</strong>. Start learning whenever you're ready.</p>
        <a href="${params.courseUrl}" style="display:inline-block;margin:16px 0;background:#C12129;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Start Learning →</a>
        <hr style="border-color:#262626;margin:24px 0"/>
        <p style="font-size:12px;color:#525252">LAMID Learning · Unsubscribe</p>
      </div>`,
  };
}

export function certificateEmail(params: {
  userEmail:      string;
  userName:       string;
  courseTitle:    string;
  verificationId: string;
  downloadUrl:    string;
}): EmailPayload {
  return {
    to:      params.userEmail,
    subject: `Your certificate is ready — ${params.courseTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0A0A0A;color:#F5F5F5;padding:32px;border-radius:12px">
        <p style="color:#C12129;font-weight:700;letter-spacing:0.1em;font-size:11px">LAMID LEARNING</p>
        <h1 style="font-size:22px;margin:8px 0 4px">🎓 Certificate earned!</h1>
        <p style="color:#A3A3A3">Hi ${params.userName},</p>
        <p style="color:#A3A3A3">Congratulations! You've completed <strong style="color:#F5F5F5">${params.courseTitle}</strong> and your certificate is ready.</p>
        <a href="${params.downloadUrl}" style="display:inline-block;margin:16px 0;background:#C12129;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Download Certificate</a>
        <p style="font-size:12px;color:#525252;margin-top:8px">Verification ID: <code>${params.verificationId}</code></p>
        <hr style="border-color:#262626;margin:24px 0"/>
        <p style="font-size:12px;color:#525252">LAMID Learning · Unsubscribe</p>
      </div>`,
  };
}

export function eventReminderEmail(params: {
  userEmail:  string;
  userName:   string;
  eventTitle: string;
  eventDate:  string;
  joinUrl:    string;
}): EmailPayload {
  return {
    to:      params.userEmail,
    subject: `Reminder: ${params.eventTitle} starts soon`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0A0A0A;color:#F5F5F5;padding:32px;border-radius:12px">
        <p style="color:#C12129;font-weight:700;letter-spacing:0.1em;font-size:11px">LAMID LEARNING</p>
        <h1 style="font-size:22px;margin:8px 0 4px">📅 Lecture reminder</h1>
        <p style="color:#A3A3A3">Hi ${params.userName},</p>
        <p style="color:#A3A3A3"><strong style="color:#F5F5F5">${params.eventTitle}</strong> starts on ${params.eventDate}.</p>
        <a href="${params.joinUrl}" style="display:inline-block;margin:16px 0;background:#C12129;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Join Session →</a>
        <hr style="border-color:#262626;margin:24px 0"/>
        <p style="font-size:12px;color:#525252">LAMID Learning · Unsubscribe</p>
      </div>`,
  };
}
