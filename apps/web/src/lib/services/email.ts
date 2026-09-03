import { resendEmailsEndpoint } from '@terrova/config'

export type TransactionalTemplate =
  'welcome' | 'payment_problem' | 'cancellation' | 'gift_notification'

const subjects: Record<TransactionalTemplate, string> = {
  welcome: 'Welcome to your Terrova journey',
  payment_problem: 'Your Terrova payment needs attention',
  cancellation: 'Your Terrova membership update',
  gift_notification: 'A Terrova journey is waiting for you',
}

export async function sendTransactionalEmail(input: {
  template: TransactionalTemplate
  to: string
  brandName: string
  body: string
}) {
  const key = process.env.RESEND_API_KEY
  if (!key) return { id: 'development-noop' }
  const response = await fetch(resendEmailsEndpoint(process.env.RESEND_API_URL), {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${input.brandName} <${process.env.EMAIL_FROM_ADDRESS ?? 'hello@terrova.net'}>`,
      to: [input.to],
      subject: subjects[input.template],
      text: input.body,
    }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Email provider rejected request (${response.status})`)
  return (await response.json()) as { id: string }
}
