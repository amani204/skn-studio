import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { isRateLimited, recordFailedAttempt } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  website: z.string().max(0).optional(), 
});

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimitKey = `contact:${ip}`;

  if (isRateLimited(rateLimitKey)) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    recordFailedAttempt(rateLimitKey);
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { name, email, subject, message, website } = parsed.data;

  // Honeypot tripped — pretend success so bots don't learn to skip this field
  if (website) {
    return NextResponse.json({ success: true });
  }

  const contactEmail = process.env.CONTACT_EMAIL;
  if (!contactEmail) {
    console.error("CONTACT_EMAIL env var is not set");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  try {
    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", 
      to: contactEmail,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `
        <p><strong>De :</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p><strong>Sujet :</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message :</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    recordFailedAttempt(rateLimitKey); // counts toward rate limit even on success, prevents spam floods
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// Basic HTML-escaping so submitted text can't break out of the email's HTML structure
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}