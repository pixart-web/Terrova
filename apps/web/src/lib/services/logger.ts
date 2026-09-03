type LogLevel = 'info' | 'warn' | 'error'

export function log(level: LogLevel, event: string, details: Record<string, unknown> = {}) {
  const safe = Object.fromEntries(
    Object.entries(details).filter(
      ([key]) => !/email|name|address|token|secret|password|payload/i.test(key),
    ),
  )
  console[level](JSON.stringify({ level, event, ...safe, at: new Date().toISOString() }))
}
