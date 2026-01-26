import { Resend } from "resend"
import { env } from "@/env"

export const resend = new Resend(env.RESEND_API_KEY)

export async function sendEmail(to: string[], subject: string, body: string) {
  const { data, error } = await resend.emails.send({
    from: env.RESEND_EMAIL,
    to:
      env.RESEND_EMAIL === "Acme <onboarding@resend.dev>"
        ? ["delivered@resend.dev"]
        : to,
    subject,
    html: body,
  })

  return { data, error }
}
