import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs"; // important: keep this on Node.js runtime

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { success: false, error: "Missing to/subject/html" },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM,
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);

    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
