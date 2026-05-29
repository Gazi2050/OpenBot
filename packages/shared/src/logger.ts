function formatDate(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const day = pad(date.getDate())
  const month = pad(date.getMonth() + 1)
  const year = date.getFullYear()
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

const LEVEL_STYLES: Record<string, [number, number]> = {
  success: [97, 42],
  info: [97, 44],
  warn: [97, 43],
  error: [97, 41],
  debug: [97, 100],
}

function log(level: string, fn: (...args: unknown[]) => void, msg: string) {
  const time = formatDate(new Date())
  const label = level.toUpperCase()
  const [fg, bg] = LEVEL_STYLES[level] || [37, 47]
  const coloredLevel = `\x1b[${bg}m\x1b[${fg};1m ${label} \x1b[0m`
  fn(`[${time}] ${coloredLevel}: ${msg}`)
}

export const logger = {
  success: (msg: string) => log('success', console.log, msg),
  info: (msg: string) => log('info', console.log, msg),
  warn: (msg: string) => log('warn', console.warn, msg),
  error: (msg: string) => log('error', console.error, msg),
  debug: (msg: string) => log('debug', console.log, msg),
}
