export const terrovaTokens = {
  color: {
    ink: '#171714',
    cream: '#F3EFE4',
    terracotta: '#B65F43',
    vine: '#35483A',
    wine: '#632F3D',
    chalk: '#FBF9F3',
  },
  space: {
    xs: '0.5rem',
    sm: '0.875rem',
    md: '1.5rem',
    lg: 'clamp(2rem, 5vw, 5rem)',
    xl: 'clamp(5rem, 12vw, 10rem)',
  },
  radius: {
    soft: '0.25rem',
    pill: '999px',
  },
  motion: {
    easeOut: [0.22, 1, 0.36, 1] as const,
    durationFast: 0.28,
    durationBase: 0.72,
  },
} as const

export const defaultBrand = {
  slug: 'terrova',
  name: 'Terrova',
  locale: 'en-GB',
  currency: 'EUR',
  theme: terrovaTokens.color,
} as const

export function resendEmailsEndpoint(configured?: string): string {
  const base = (configured?.trim() || 'https://api.resend.com').replace(/\/+$/, '')
  return base.endsWith('/emails') ? base : `${base}/emails`
}
