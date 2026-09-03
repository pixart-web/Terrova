import { resendEmailsEndpoint } from '../../packages/config/src/index'
import { safeInternalPath } from '../../apps/web/src/lib/security'
import { sendTransactionalEmail } from '../../apps/web/src/lib/services/email'
import { createEmailAdapter } from '../../apps/cms/src/services/email'
import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('provider configuration', () => {
  it('builds the Resend emails endpoint from base or full URLs', () => {
    expect(resendEmailsEndpoint()).toBe('https://api.resend.com/emails')
    expect(resendEmailsEndpoint('https://api.resend.com')).toBe('https://api.resend.com/emails')
    expect(resendEmailsEndpoint('https://api.resend.com/')).toBe('https://api.resend.com/emails')
    expect(resendEmailsEndpoint('https://api.resend.com/emails')).toBe(
      'https://api.resend.com/emails',
    )
  })

  it('uses the normalized /emails endpoint in both web and Payload adapters', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubEnv('RESEND_API_URL', 'https://api.resend.com/')
    const request = vi.fn(async () => Response.json({ id: 'email_1' }))
    vi.stubGlobal('fetch', request)

    await sendTransactionalEmail({
      template: 'welcome',
      to: 'member@example.com',
      brandName: 'Terrova',
      body: 'Welcome.',
    })
    const payloadAdapter = createEmailAdapter()({
      payload: { logger: { info: vi.fn() } },
    } as never)
    await payloadAdapter.sendEmail({
      to: 'member@example.com',
      subject: 'Confirm',
      text: 'Confirm your account.',
    })

    expect(request).toHaveBeenCalledTimes(2)
    expect(request.mock.calls.map(([url]) => url)).toEqual([
      'https://api.resend.com/emails',
      'https://api.resend.com/emails',
    ])
  })

  it('preserves only safe internal post-auth checkout destinations', () => {
    expect(safeInternalPath('/boxes?plan=drinker&resume=1')).toBe('/boxes?plan=drinker&resume=1')
    expect(safeInternalPath('https://attacker.invalid')).toBe('/account')
    expect(safeInternalPath('//attacker.invalid/boxes')).toBe('/account')
    expect(safeInternalPath('/\\attacker.invalid')).toBe('/account')
  })
})
