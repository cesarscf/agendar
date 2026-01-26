import { env } from "@/env"

export function sendCodeTemplate(
  code: string,
  expiresInMinutes: number,
  name: string
) {
  const year = new Date().getFullYear()

  return `
      <!doctype html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Confirmação de conta — Agendar</title>
        <style>
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .hero { padding: 24px !important; }
            .code { font-size: 28px !important; letter-spacing: 4px !important; }
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
                      <div style="opacity:0.95;font-size:13px;margin-top:4px;">Confirmação de conta</div>
                    </td>
                    <td style="text-align:right;vertical-align:middle;">
                      <!-- optional small logo circle -->
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
                  Obrigado por criar uma conta na <strong>Agendar</strong>. Para concluir o cadastro, use o código abaixo para confirmar sua conta.
                </p>
      
                <!-- Code box -->
                <div style="margin:20px 0 24px 0;padding:18px;border-radius:8px;background:#f7f9fc;border:1px solid #e6eef9;text-align:center;">
                  <div style="font-size:13px;color:#6b7a90;margin-bottom:6px;">Seu código de verificação</div>
                  <div class="code" style="display:inline-block;font-weight:700;font-size:34px;letter-spacing:6px;background:white;padding:12px 22px;border-radius:6px;border:1px solid #e1e9fb;">
                    ${code}
                  </div>
                  <div style="margin-top:10px;font-size:13px;color:#8b98ad;">
                    Expira em ${expiresInMinutes} minutos
                  </div>
                </div>
                <hr style="border:none;border-top:1px solid #eef2f7;margin:18px 0;">
      
                <p style="margin:0;color:#6b7a90;font-size:13px;line-height:1.4;">
                  Se você não criou essa conta, ignore este e-mail ou entre em contato com nosso suporte em
                  <a style="color:#4c63ff;text-decoration:underline;">${env.RESEND_EMAIL}</a>.
<!--                  <a href="mailto:{{supportEmail}}" style="color:#4c63ff;text-decoration:underline;">${env.RESEND_EMAIL}</a>.-->
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
<!--                      <a href="{{privacyUrl}}" style="color:#9aa6bf;text-decoration:underline;font-size:12px;">Política de Privacidade</a>-->
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <div style="max-width:600px;margin:12px auto;color:#8b98ad;font-size:12px;">
            Se você não conseguir ver o e-mail acima, use o código: <strong>${code}</strong>
          </div>
        </center>
      </body>
      </html>
      `
}
