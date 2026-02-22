import { Resend } from "resend";
import { z } from "zod";

import { env } from "@/lib/env";
import { apiResponse } from "@/lib/api-response";

import { requireAuth } from "@/common/guards/auth.guard";

import { HttpStatus } from "@/constants/http-status.constant";
import { API_ERRORS, EMAIL_ERRORS } from "@/constants/http-error-messages.constant";

export const runtime = "nodejs";

const emailSchema = z.object({
  to: z.email(),
  subject: z.string().min(1),
  html: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await req.json();
    const validation = emailSchema.safeParse(body);

    if (!validation.success) {
      return apiResponse({
        data: API_ERRORS.MISSING_FIELDS,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const { to, subject, html } = validation.data;

    if (!env.RESEND_API_KEY || !env.RESEND_EMAIL_FROM) {
      return apiResponse({
        data: EMAIL_ERRORS.NOT_CONFIGURED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    const resend = new Resend(env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: env.RESEND_EMAIL_FROM,
      to,
      subject,
      html,
    });

    return apiResponse({
      data: result,
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error sending email:", error);

    return apiResponse({
      data: EMAIL_ERRORS.SEND_FAILED,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
