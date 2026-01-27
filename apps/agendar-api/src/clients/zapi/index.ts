import { env } from "@/env"

interface SendTextMessageParams {
  phone: string
  message: string
  delayMessage?: number
  delayTyping?: number
}

interface SendTextMessageResponse {
  zaapId: string
  messageId: string
  id: string
}

/**
 * Formata o telefone para o formato aceito pela Z-API
 * Remove caracteres especiais e adiciona DDI do Brasil se necessário
 */
function formatPhone(phone: string): string {
  // Remove todos os caracteres não numéricos
  const numbers = phone.replace(/\D/g, "")

  // Se já tem 13 dígitos (55 + DDD + 9 dígitos), retorna
  if (numbers.length === 13) {
    return numbers
  }

  // Se tem 11 dígitos (DDD + 9 dígitos), adiciona 55
  if (numbers.length === 11) {
    return `55${numbers}`
  }

  // Se tem 10 dígitos (DDD + 8 dígitos antigo), adiciona 55
  if (numbers.length === 10) {
    return `55${numbers}`
  }

  return numbers
}

/**
 * Envia mensagem de texto via WhatsApp usando Z-API
 */
export async function sendWhatsAppMessage(
  params: SendTextMessageParams
): Promise<SendTextMessageResponse | null> {
  const { instanceId, token, clientToken } = env.ZAPI ?? {}

  if (!instanceId || !token || !clientToken) {
    console.warn("[Z-API] Credenciais não configuradas, mensagem não enviada")
    return null
  }

  const url = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Token": clientToken,
      },
      body: JSON.stringify({
        phone: formatPhone(params.phone),
        message: params.message,
        delayMessage: params.delayMessage,
        delayTyping: params.delayTyping,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[Z-API] Erro ao enviar mensagem:", error)
      return null
    }

    const data = (await response.json()) as SendTextMessageResponse
    console.log("[Z-API] Mensagem enviada:", data.messageId)
    return data
  } catch (error) {
    console.error("[Z-API] Erro ao enviar mensagem:", error)
    return null
  }
}
