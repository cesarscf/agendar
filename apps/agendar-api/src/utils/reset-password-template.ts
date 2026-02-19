import { env } from "@/env"

export function resetPasswordTemplate(token: string, name: string) {
  const year = new Date().getFullYear()
  const resetLink = `${env.FRONTEND_URL}/reset-password?token=${token}`

  return `
      <!doctype html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Redefinição de senha — Agendar</title>
        <style>
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .hero { padding: 24px !important; }
          }
        </style>
      </head>
      <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
        <center style="width:100%;background-color:#f4f6f8;padding:24px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" class="container" style="width:600px;max-width:100%;margin:0 auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.08);">
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(90deg,#5b6cff,#7a9bff);padding:20px 24px;color:#fff;">
                <table role="presentation" width="100%">
                  <tr>
                    <td style="vertical-align:middle;">
                      <h1 style="margin:0;font-size:20px;font-weight:700;">Agendar</h1>
                      <div style="opacity:0.95;font-size:13px;margin-top:4px;">Redefinição de senha</div>
                    </td>
                    <td style="text-align:right;vertical-align:middle;">
                      <div style="width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.15);display:inline-block;line-height:44px;text-align:center;font-weight:700;">A</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td class="hero" style="padding:32px 36px;color:#0b1437;">
                <p style="margin:0 0 16px 0;font-size:16px;">Olá <strong>${name}</strong>,</p>
                <p style="margin:0 0 20px 0;color:#445566;line-height:1.5;">
                  Recebemos uma solicitação para redefinir a senha da sua conta na <strong>Agendar</strong>.
                  Clique no botão abaixo para criar uma nova senha.
                </p>

                <!-- CTA Button -->
                <div style="margin:24px 0;text-align:center;">
                  <a href="${resetLink}"
                     style="display:inline-block;background:linear-gradient(90deg,#5b6cff,#7a9bff);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:6px;">
                    Redefinir senha
                  </a>
                </div>

                <p style="margin:0 0 8px 0;color:#6b7a90;font-size:13px;line-height:1.4;">
                  Ou copie e cole este link no seu navegador:
                </p>
                <p style="margin:0 0 20px 0;word-break:break-all;">
                  <a href="${resetLink}" style="color:#4c63ff;font-size:13px;">${resetLink}</a>
                </p>

                <div style="padding:12px 16px;background:#fff8e1;border-radius:6px;border-left:4px solid #f59e0b;margin-bottom:20px;">
                  <p style="margin:0;color:#92400e;font-size:13px;">
                    Este link expira em <strong>30 minutos</strong>.
                  </p>
                </div>

                <hr style="border:none;border-top:1px solid #eef2f7;margin:18px 0;">

                <p style="margin:0;color:#6b7a90;font-size:13px;line-height:1.4;">
                  Se você não solicitou a redefinição de senha, ignore este e-mail.
                  Sua senha permanecerá a mesma. Em caso de dúvidas, entre em contato em
                  <a href="mailto:${env.RESEND_EMAIL}" style="color:#4c63ff;text-decoration:underline;">${env.RESEND_EMAIL}</a>.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 36px;background:#fbfcff;border-top:1px solid #f0f4fb;color:#9aa6bf;font-size:12px;">
                <table role="presentation" width="100%">
                  <tr>
                    <td>
                      Agendar • Segurança e agendamento facilitados.<br>
                      <br>
                      © ${year} Agendar. Todos os direitos reservados.
                    </td>
                    <td style="text-align:right;">
                      <a style="color:#9aa6bf;text-decoration:underline;font-size:12px;">Política de Privacidade</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </center>
      </body>
      </html>
      `
}
