import type { EmailAdapter, SendEmailOptions } from 'payload'

import { resendEmailsEndpoint } from '@terrova/config'

function recipientAddresses(value: SendEmailOptions['to']): string[] {
  const values = Array.isArray(value) ? value : value ? [value] : []
  return values.flatMap((recipient) => {
    if (typeof recipient === 'string') return recipient.split(',').map((item) => item.trim())
    if (recipient && typeof recipient === 'object' && 'address' in recipient) {
      return [String(recipient.address)]
    }
    return []
  })
}

export function createEmailAdapter(): EmailAdapter<{ id: string }> {
  return ({ payload }) => ({
    name: 'resend-compatible',
    defaultFromAddress: process.env.EMAIL_FROM_ADDRESS ?? 'hello@terrova.net',
    defaultFromName: process.env.EMAIL_FROM_NAME ?? 'Terrova',
    async sendEmail(message) {
      const recipients = recipientAddresses(message.to)
      const apiKey = process.env.RESEND_API_KEY

      if (!apiKey) {
        payload.logger.info({
          event: 'email.development_sink',
          recipientCount: recipients.length,
          subject: message.subject,
        })
        return { id: 'development-noop' }
      }

      const response = await fetch(resendEmailsEndpoint(process.env.RESEND_API_URL), {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from:
            message.from ??
            `${process.env.EMAIL_FROM_NAME ?? 'Terrova'} <${process.env.EMAIL_FROM_ADDRESS ?? 'hello@terrova.net'}>`,
          to: recipients,
          subject: message.subject,
          html: typeof message.html === 'string' ? message.html : undefined,
          text: typeof message.text === 'string' ? message.text : undefined,
        }),
      })

      if (!response.ok) throw new Error(`Email provider rejected request (${response.status})`)
      const result = (await response.json()) as { id?: string }
      return { id: result.id ?? 'accepted' }
    },
  })
}
