declare const process: { env: Record<string, string | undefined> } | undefined

function formatDate(date: Date) {
	return date.toLocaleString()
}

const LEVEL_STYLES: Record<string, [number, number]> = {
	success: [97, 42],
	info: [97, 44],
	warn: [97, 43],
	error: [97, 41],
	debug: [97, 100],
}

const useColor = typeof process !== 'undefined' && !process.env?.NO_COLOR

function log(level: string, fn: (...args: unknown[]) => void, msg: string) {
	const time = formatDate(new Date())
	const label = level.toUpperCase()
	if (useColor) {
		const [fg, bg] = LEVEL_STYLES[level] || [37, 47]
		const coloredLevel = `\x1b[${bg}m\x1b[${fg};1m ${label} \x1b[0m`
		fn(`[${time}] ${coloredLevel}: ${msg}`)
	} else {
		fn(`[${time}] ${label}: ${msg}`)
	}
}

export const logger = {
	success: (msg: string) => log('success', console.log, msg),
	info: (msg: string) => log('info', console.log, msg),
	warn: (msg: string) => log('warn', console.warn, msg),
	error: (msg: string) => log('error', console.error, msg),
	debug: (msg: string) => log('debug', console.debug, msg),
}
